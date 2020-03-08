const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const db = require('./baza/db.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/pocetna.html');
    db.sequelize.sync({ force: true }).then(function () {
        inicializacija().then(function () {
            console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
            process.exit();
        });
    });
});

app.get('/osoblje', (req, res) => {
    db.Osoblje.findAll().then(function (osoblje) {
        let lista = [];
        for (let i = 0; i < osoblje.length; i++) {
            noviObj = { ime: osoblje[i].ime, prezime: osoblje[i].prezime, uloga: osoblje[i].uloga };
            lista.push(noviObj);
        }
        res.json({ lista });
    });

});

app.get('/termini', (req, res) => {
    db.Rezervacija.findAll({ include: [{ model: db.Sala, as: 'salaRezervacije' }, { model: db.Osoblje, as: 'osobaRezervacije' }, { model: db.Termin, as: 'terminRezervacije' }] }).then(function (lista) {
        let listaTermina = [];
        let listaOsoblja = [];

        for (let i = 0; i < lista.length; i++) {

            let noviObj = { idOsobe: 0, sala: "", dan: 0, datum: "", redovna: 0, semestar: "", pocetak: "", kraj: "" };

            noviObj.idOsobe = lista[i].osobaRezervacije.id,
            noviObj.sala = lista[i].salaRezervacije.naziv,
            noviObj.dan = lista[i].terminRezervacije.dan,
            noviObj.datum = lista[i].terminRezervacije.datum,
            noviObj.redovna = lista[i].terminRezervacije.redovni,
            noviObj.semestar = lista[i].terminRezervacije.semestar,
            noviObj.pocetak = lista[i].terminRezervacije.pocetak,
            noviObj.kraj = lista[i].terminRezervacije.kraj

            listaTermina.push(noviObj);
        }

        db.Osoblje.findAll().then(function(listaO){
            for(let i=0; i<listaO.length; i++){
            listaOsoblja.push({idOsobe: listaO[i].id,  ime: listaO[i].ime, prezime: listaO[i].prezime, uloga: listaO[i].uloga });
            }
            
            res.json({ listaTermina, listaOsoblja });
        });
        
    });

});


app.get('/rezervacije', (req, res) => {
    let vanredna = [];
    let periodicna = [];
    db.Rezervacija.findAll({ include: [{ model: db.Sala, as: 'salaRezervacije' }, { model: db.Osoblje, as: 'osobaRezervacije' }, { model: db.Termin, as: 'terminRezervacije' }] }).then(function (lista) {

        for (let i = 0; i < lista.length; i++) {
            let periodicni = { dan: 0, semestar: "", pocetak: "", kraj: "", naziv: "", predavac: "" };
            let vanredni = { datum: "", pocetak: "", kraj: "", naziv: "", predavac: "" };


            if (lista[i].terminRezervacije.redovni == 1) {
                periodicni.dan = lista[i].terminRezervacije.dan;
                periodicni.semestar = lista[i].terminRezervacije.semestar;
                periodicni.pocetak = lista[i].terminRezervacije.pocetak;
                periodicni.kraj = lista[i].terminRezervacije.kraj;
                periodicni.predavac = lista[i].osobaRezervacije.ime + lista[i].osobaRezervacije.prezime;
                periodicni.naziv = lista[i].salaRezervacije.naziv;
                periodicna.push(periodicni);
            }
            else {
                vanredni.datum = lista[i].terminRezervacije.datum;
                vanredni.pocetak = lista[i].terminRezervacije.pocetak;
                vanredni.kraj = lista[i].terminRezervacije.kraj;
                vanredni.predavac = lista[i].osobaRezervacije.ime + lista[i].osobaRezervacije.prezime;
                vanredni.naziv = lista[i].salaRezervacije.naziv;
                vanredna.push(vanredni);
            }
        }

        res.json({ periodicna, vanredna });

    });


});

app.post('/pocetna.html', (req, res) => {

    let triSlike = [];
    let ucitaneSlike = req.body;

    const testFolder = '/public/slike/';
    const fs = require('fs');

    fs.readdir(__dirname + '/public/slike/', (err, files) => {
        for (let i = 0; i < files.length; i++) {
            if (!daLiSadrzi(ucitaneSlike, files[i])) {
                triSlike.push(files[i]);
                if (triSlike.length == 3) break;
            }
        }
        res.json({ triSlike });
    });
});

function daLiSadrzi(lista, element) {
    for (var i = 0; i < lista.length; i++) {
        if (lista[i] === element) {
            return true;
        }
    }
    return false;
}

app.get('/zauzeca.json', (req, res) => {
    res.sendFile(__dirname + '/zauzeca.json');
});

app.post('/rezervacijaUpis', (req, res) => {
    let tijelo = req.body;

    let vanredna = [];
    let periodicna = [];
    db.Rezervacija.findAll({ include: [{ model: db.Sala, as: 'salaRezervacije' }, { model: db.Osoblje, as: 'osobaRezervacije' }, { model: db.Termin, as: 'terminRezervacije' }] }).then(function (lista) {

        for (let i = 0; i < lista.length; i++) {
            let periodicni = { dan: 0, semestar: "", pocetak: "", kraj: "", naziv: "", predavac: "" };
            let vanredni = { datum: "", pocetak: "", kraj: "", naziv: "", predavac: "" };


            if (lista[i].terminRezervacije.redovni == 1) {
                periodicni.dan = lista[i].terminRezervacije.dan;
                periodicni.semestar = lista[i].terminRezervacije.semestar;
                periodicni.pocetak = lista[i].terminRezervacije.pocetak;
                periodicni.kraj = lista[i].terminRezervacije.kraj;
                periodicni.predavac = lista[i].osobaRezervacije.ime + " " + lista[i].osobaRezervacije.prezime + ", " + lista[i].osobaRezervacije.uloga;
                periodicni.naziv = lista[i].salaRezervacije.naziv;
                periodicna.push(periodicni);
            }
            else {
                vanredni.datum = lista[i].terminRezervacije.datum;
                vanredni.pocetak = lista[i].terminRezervacije.pocetak;
                vanredni.kraj = lista[i].terminRezervacije.kraj;
                vanredni.predavac = lista[i].osobaRezervacije.ime + " " + lista[i].osobaRezervacije.prezime + ", " + lista[i].osobaRezervacije.uloga;
                vanredni.naziv = lista[i].salaRezervacije.naziv;
                vanredna.push(vanredni);
            }
        }
        let logicka = 1;
        let vecZauzeo = 1;
        let sala;
        let osoba;

        if (tijelo.hasOwnProperty("dan")) {
            for (let i = 0; i < periodicna.length; i++) {
                let jednoZauzece = periodicna[i];
                if (jednoZauzece.dan == tijelo.dan && ((tijelo.pocetak <= jednoZauzece.pocetak && tijelo.kraj > jednoZauzece.pocetak) || (tijelo.pocetak == jednoZauzece.pocetak && tijelo.kraj == jednoZauzece.kraj)
                    || (tijelo.pocetak < jednoZauzece.kraj && tijelo.kraj >= jednoZauzece.kraj)) && jednoZauzece.semestar == tijelo.semestar && jednoZauzece.naziv == tijelo.naziv) { osoba = jednoZauzece.predavac; logicka = 0; }

                if (jednoZauzece.dan == tijelo.dan && ((tijelo.pocetak <= jednoZauzece.pocetak && tijelo.kraj > jednoZauzece.pocetak) || (tijelo.pocetak == jednoZauzece.pocetak && tijelo.kraj == jednoZauzece.kraj)
                    || (tijelo.pocetak < jednoZauzece.kraj && tijelo.kraj >= jednoZauzece.kraj)) && jednoZauzece.semestar == tijelo.semestar && jednoZauzece.predavac == tijelo.predavac) vecZauzeo = 0;

            }

            for (let i = 0; i < vanredna.length; i++) {
                let jednoZauzece = vanredna[i];
                var strnigDatum = (jednoZauzece.datum).split(".");
                strnigDatum.reverse();
                strnigDatum.join("-");


                let datum = new Date(strnigDatum);
                let dan = datum.getDay();
                if (dan == 0) dan = 6;
                else dan = dan - 1;



                if (dan == tijelo.dan && ((tijelo.pocetak <= jednoZauzece.pocetak && tijelo.kraj > jednoZauzece.pocetak) || (tijelo.pocetak == jednoZauzece.pocetak && tijelo.kraj == jednoZauzece.kraj)
                    || (tijelo.pocetak < jednoZauzece.kraj && tijelo.kraj >= jednoZauzece.kraj)) && jednoZauzece.naziv == tijelo.naziv && dajSemestar(datum.getMonth()) == tijelo.semestar) { osoba = jednoZauzece.predavac; logicka = 0; }

                if (dan == tijelo.dan && ((tijelo.pocetak <= jednoZauzece.pocetak && tijelo.kraj > jednoZauzece.pocetak) || (tijelo.pocetak == jednoZauzece.pocetak && tijelo.kraj == jednoZauzece.kraj)
                    || (tijelo.pocetak < jednoZauzece.kraj && tijelo.kraj >= jednoZauzece.kraj)) && jednoZauzece.predavac == tijelo.predavac && dajSemestar(datum.getMonth()) == tijelo.semestar) vecZauzeo = 0;


            }

            if (logicka && vecZauzeo) {
                noviPer = {
                    dan: tijelo.dan,
                    semestar: tijelo.semestar,
                    pocetak: tijelo.pocetak,
                    kraj: tijelo.kraj,
                    naziv: tijelo.naziv,
                    predavac: tijelo.predavac
                }

                periodicna.push(noviPer);

                db.Termin.create({ redovni: true, dan: tijelo.dan, datum: null, semestar: tijelo.semestar, pocetak: tijelo.pocetak, kraj: tijelo.kraj }).then(function (t) {
                    db.Sala.findOrCreate({ where: { naziv: tijelo.naziv } }).then(function (s) {
                        s = s[0];
                        let naziv = tijelo.predavac.split(",");
                        naziv = naziv[0].split(" ");

                        db.Osoblje.findOne({ where: { ime: naziv[0], prezime: naziv[1] } }).then(function (o) {
                            db.Sala.update(
                                { zaduzenaOsoba: o.id },
                                { where: { id: s.id } }
                            ).then(function (sala) {

                                db.Rezervacija.create({ termin: t.id, sala: s.id, osoba: o.id });
                            });
                        });
                    });
                });
            }

        }
        else {

            for (let i = 0; i < periodicna.length; i++) {
                let jednoZauzece = periodicna[i];
                var strnigDatum = (tijelo.datum).split(".");
                strnigDatum.reverse();
                strnigDatum.join("-");
                let datum = new Date(strnigDatum);
               
                let dan = datum.getDay();
                if (dan == 0) dan = 6;
                else dan = dan - 1;

                if (dan == jednoZauzece.dan && ((tijelo.pocetak <= jednoZauzece.pocetak && tijelo.kraj > jednoZauzece.pocetak) || (tijelo.pocetak == jednoZauzece.pocetak && tijelo.kraj == jednoZauzece.kraj)
                    || (tijelo.pocetak < jednoZauzece.kraj && tijelo.kraj >= jednoZauzece.kraj)) && jednoZauzece.naziv == tijelo.naziv && dajSemestar(datum.getMonth()) == jednoZauzece.semestar) { osoba = jednoZauzece.predavac; logicka = 0; }

                if (dan == jednoZauzece.dan && ((tijelo.pocetak <= jednoZauzece.pocetak && tijelo.kraj > jednoZauzece.pocetak) || (tijelo.pocetak == jednoZauzece.pocetak && tijelo.kraj == jednoZauzece.kraj)
                    || (tijelo.pocetak < jednoZauzece.kraj && tijelo.kraj >= jednoZauzece.kraj)) && jednoZauzece.predavac == tijelo.predavac && dajSemestar(datum.getMonth()) == jednoZauzece.semestar) {console.log("Evo me");  vecZauzeo = 0;}

            }

            for (var i = 0; i < vanredna.length; i++) {
                var jednoZauzece = vanredna[i];
                if (jednoZauzece.datum == tijelo.datum && ((tijelo.pocetak <= jednoZauzece.pocetak && tijelo.kraj > jednoZauzece.pocetak) || (tijelo.pocetak == jednoZauzece.pocetak && tijelo.kraj == jednoZauzece.kraj)
                    || (tijelo.pocetak < jednoZauzece.kraj && tijelo.kraj >= jednoZauzece.kraj)) && jednoZauzece.naziv == tijelo.naziv) { osoba = jednoZauzece.predavac; logicka = 0; }

                if (jednoZauzece.datum == tijelo.datum && ((tijelo.pocetak <= jednoZauzece.pocetak && tijelo.kraj > jednoZauzece.pocetak) || (tijelo.pocetak == jednoZauzece.pocetak && tijelo.kraj == jednoZauzece.kraj)
                    || (tijelo.pocetak < jednoZauzece.kraj && tijelo.kraj >= jednoZauzece.kraj)) && jednoZauzece.predavac == tijelo.predavac) {vecZauzeo = 0;}

            }
            if (logicka && vecZauzeo) {
                vanredna.push(tijelo);

                db.Termin.create({ redovni: false, dan: null, datum: tijelo.datum, semestar: null, pocetak: tijelo.pocetak, kraj: tijelo.kraj }).then(function (t) {
                    db.Sala.findOrCreate({ where: { naziv: tijelo.naziv } }).then(function (s) {
                        s = s[0];
                        let naziv = tijelo.predavac.split(",");
                        naziv = naziv[0].split(" ");

                        db.Osoblje.findOne({ where: { ime: naziv[0], prezime: naziv[1] } }).then(function (o) {

                            db.Sala.update(
                                { zaduzenaOsoba: o.id },
                                { where: { id: s.id } }
                            ).then(function (sala) {

                                db.Rezervacija.create({ termin: t.id, sala: s.id, osoba: o.id });
                            });

                        });
                    });
                });
            }
        }

        if (logicka && vecZauzeo) {

            novi = { "Poruka": "", "Objekt": { periodicna, vanredna } };
            novi = JSON.stringify(novi);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(novi);
            res.end();
        } else if (vecZauzeo == 0) {
            let s = "Osoba " + tijelo.predavac + ", za navedeni datum " + tijelo.datum + " i termin od " + tijelo.pocetak + " do " + tijelo.kraj + " vec ima jednu rezervaciju!";
            novi = { "Poruka": s, "Objekt": { periodicna, vanredna } };
            novi = JSON.stringify(novi);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(novi);
            res.end();
        }
        else {
            let s = "Nije moguće rezervisati salu " + tijelo.naziv + " za navedeni datum " + tijelo.datum + " i termin od " + tijelo.pocetak + " do " + tijelo.kraj + " jer je salu rezervisala osoba " + osoba + "!";
            novi = { "Poruka": s, "Objekt": { periodicna, vanredna } };
            novi = JSON.stringify(novi);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(novi);
            res.end();
        }

    });

});




app.post('/pocetna.html', (req, res) => {

    let triSlike = [];
    let ucitaneSlike = req.body;

    const testFolder = '/public/slike/';
    const fs = require('fs');

    fs.readdir(__dirname + '/public/slike/', (err, files) => {
        for (let i = 0; i < files.length; i++) {
            if (!daLiSadrzi(ucitaneSlike, files[i])) {
                triSlike.push(files[i]);
                if (triSlike.length == 3) break;
            }
        }
        res.json({ triSlike });
    });
});

function daLiSadrzi(lista, element) {
    for (var i = 0; i < lista.length; i++) {
        if (lista[i] === element) {
            return true;
        }
    }
    return false;
}

app.get('/zauzeca.json', (req, res) => {
    res.sendFile(__dirname + '/zauzeca.json');
});

app.post('/', (req, res) => {
    let tijelo = req.body;
    let novaLinija = JSON.stringify(tijelo);

    fs.readFile("zauzeca.json", (err, dataBuffer) => {

        if (err) throw err;
        var data = dataBuffer.toString('utf-8');
        let jsonData = JSON.parse(data);
        var logicka = 1;

        var parse_obj = JSON.parse(data);
        if (tijelo.hasOwnProperty("dan")) {
            for (let i = 0; i < jsonData.periodicna.length; i++) {
                let jednoZauzece = jsonData.periodicna[i];
                if (jednoZauzece.dan == tijelo.dan && ((tijelo.pocetak <= jednoZauzece.pocetak && tijelo.kraj > jednoZauzece.pocetak) || (tijelo.pocetak == jednoZauzece.pocetak && tijelo.kraj == jednoZauzece.kraj)
                    || (tijelo.pocetak < jednoZauzece.kraj && tijelo.kraj >= jednoZauzece.kraj)) && jednoZauzece.semestar == tijelo.semestar && jednoZauzece.naziv == tijelo.naziv) logicka = 0;
            }

            for (let i = 0; i < jsonData.vanredna.length; i++) {
                let jednoZauzece = jsonData.vanredna[i];
                var strnigDatum = (jednoZauzece.datum).split(".");
                strnigDatum.reverse();
                strnigDatum.join("-");


                let datum = new Date(strnigDatum);


                if (datum.getDay() == tijelo.dan && ((tijelo.pocetak <= jednoZauzece.pocetak && tijelo.kraj > jednoZauzece.pocetak) || (tijelo.pocetak == jednoZauzece.pocetak && tijelo.kraj == jednoZauzece.kraj)
                    || (tijelo.pocetak < jednoZauzece.kraj && tijelo.kraj >= jednoZauzece.kraj)) && jednoZauzece.naziv == tijelo.naziv && dajSemestar(datum.getMonth()) == tijelo.semestar) logicka = 0;


            }

            if (logicka) {
                noviPer = {
                    dan: tijelo.dan,
                    semestar: tijelo.semestar,
                    pocetak: tijelo.pocetak,
                    kraj: tijelo.kraj,
                    naziv: tijelo.naziv,
                    predavac: tijelo.predavac
                }

                parse_obj['periodicna'].push(noviPer);
            }

        }
        else {

            for (let i = 0; i < jsonData.periodicna.length; i++) {
                let jednoZauzece = jsonData.periodicna[i];
                var strnigDatum = (tijelo.datum).split(".");
                strnigDatum.reverse();
                strnigDatum.join("-");
                let datum = new Date(strnigDatum);

                if (datum.getDay() == jednoZauzece.dan && ((tijelo.pocetak <= jednoZauzece.pocetak && tijelo.kraj > jednoZauzece.pocetak) || (tijelo.pocetak == jednoZauzece.pocetak && tijelo.kraj == jednoZauzece.kraj)
                    || (tijelo.pocetak < jednoZauzece.kraj && tijelo.kraj >= jednoZauzece.kraj)) && jednoZauzece.naziv == tijelo.naziv && dajSemestar(datum.getMonth()) == jednoZauzece.semestar) logicka = 0;

            }

            for (var i = 0; i < jsonData.vanredna.length; i++) {
                var jednoZauzece = jsonData.vanredna[i];
                if (jednoZauzece.datum == tijelo.datum && ((tijelo.pocetak <= jednoZauzece.pocetak && tijelo.kraj > jednoZauzece.pocetak) || (tijelo.pocetak == jednoZauzece.pocetak && tijelo.kraj == jednoZauzece.kraj)
                    || (tijelo.pocetak < jednoZauzece.kraj && tijelo.kraj >= jednoZauzece.kraj)) && jednoZauzece.naziv == tijelo.naziv) logicka = 0;

            }
            if (logicka)
                parse_obj['vanredna'].push(tijelo);
        }
        if (logicka) {
            Str_txt = JSON.stringify(parse_obj);


            fs.writeFile('zauzeca.json', Str_txt, function () {
                novi = { "Poruka": "", "Objekt": parse_obj };
                novi = JSON.stringify(novi);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(novi);
                res.end();
            })
        } else {
            let s = "Nije moguće rezervisati salu " + tijelo.naziv + " za navedeni datum " + tijelo.datum + " i termin od " + tijelo.pocetak + " do " + tijelo.kraj + "!";
            novi = { "Poruka": s, "Objekt": parse_obj };
            novi = JSON.stringify(novi);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(novi);
            res.end();
        }



    });

});
app.listen(8080);




function dajSemestar(mjesec) {
    ljetni = [1, 2, 3, 4, 5];
    zimski = [9, 10, 11, 0];

    if (ljetni.includes(mjesec)) return "ljetni";
    else if (zimski.includes(mjesec)) return "zimski";
    else return "raspust";
}

function inicializacija() {

    var osobljeListaPromisea = [];
    var rezervacijeListaPromisea = [];
    var saleListaPromisea = [];
    var terminiListaPromisea = [];



    return new Promise(function (resolve, reject) {

        osobljeListaPromisea.push(db.Osoblje.create({ ime: 'Neko', prezime: 'Nekic', uloga: 'profesor' }));
        osobljeListaPromisea.push(db.Osoblje.create({ ime: 'Drugi', prezime: 'Neko', uloga: 'asistent' }));
        osobljeListaPromisea.push(db.Osoblje.create({ ime: 'Test', prezime: 'Test', uloga: 'asistent' }));

        terminiListaPromisea.push(db.Termin.create({ redovni: false, dan: null, datum: '01.01.2020', semestar: null, pocetak: '12:00', kraj: '13:00' }));
        terminiListaPromisea.push(db.Termin.create({ redovni: true, dan: 0, datum: null, semestar: 'zimski', pocetak: '13:00', kraj: '14:00' }));

        saleListaPromisea.push(db.Sala.create({ naziv: '1-11', zaduzenaOsoba: 1 }));
        saleListaPromisea.push(db.Sala.create({ naziv: '1-15', zaduzenaOsoba: 2 }));

        rezervacijeListaPromisea.push(db.Rezervacija.create({ osoba: 1, termin: 1, sala: 1 }));
        rezervacijeListaPromisea.push(db.Rezervacija.create({ osoba: 3, termin: 2, sala: 1 }));

    });
}