let trenutniMjesec;
let trenutnaGodina;
let sala;
let vrijemePocetka;
let vrijemeKraja;


window.onload = function () {

    var d = new Date();
    trenutniMjesec = d.getMonth();
    trenutnaGodina = d.getFullYear();
    var e = document.getElementById("listaSala");
    sala = e.options[e.selectedIndex].value;
    vrijemePocetka = document.getElementById("pocetak").value;
    vrijemeKraja = document.getElementById("kraj").value;

    //Pozivi.ucitajSaServera();
    Pozivi.ucitajRezervacijeIzBaze();
    Pozivi.ucitajOsobljeIzBaze();
    
    //Kalendar.ucitajPodatke(listaRedovnih, listaVanrednih);
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"), trenutniMjesec);

    prepareEventHandlers();
}

function prepareEventHandlers() {

    var sljedeci = document.getElementById("sljedeci");
    sljedeci.onclick = function () {
        trenutniMjesec++;
        validirajPromjenu();
        var e = document.getElementById("listaSala");
        sala = e.options[e.selectedIndex].value;
        vrijemePocetka = document.getElementById("pocetak").value;
        vrijemeKraja = document.getElementById("kraj").value;
        Kalendar.iscrtajKalendar(document.getElementById("kalendar"), trenutniMjesec);
        Kalendar.obojiZauzeca(document.getElementById("kalendar"), trenutniMjesec, sala, vrijemePocetka, vrijemeKraja);
    }

    var prethodni = document.getElementById("prethodni");
    prethodni.onclick = function () {
        trenutniMjesec--;
        validirajPromjenu();
        var e = document.getElementById("listaSala");
        sala = e.options[e.selectedIndex].value;
        vrijemePocetka = document.getElementById("pocetak").value;
        vrijemeKraja = document.getElementById("kraj").value;
        Kalendar.iscrtajKalendar(document.getElementById("kalendar"), trenutniMjesec);
        Kalendar.obojiZauzeca(document.getElementById("kalendar"), trenutniMjesec, sala, vrijemePocetka, vrijemeKraja);
    }

    const selectElement = document.getElementById('listaSala');
    selectElement.addEventListener('change', (event) => {
        sala = `${event.target.value}`;
        vrijemePocetka = document.getElementById("pocetak").value;
        vrijemeKraja = document.getElementById("kraj").value;
        Kalendar.obojiZauzeca(document.getElementById("kalendar"), trenutniMjesec, sala, vrijemePocetka, vrijemeKraja);
    });

    const pocetnoV = document.getElementById('pocetak');
    pocetnoV.addEventListener('input', updateValue);
    function updateValue(e) {
        var e = document.getElementById("listaSala");
        sala = e.options[e.selectedIndex].value;
        vrijemePocetka = document.getElementById("pocetak").value;
        vrijemeKraja = document.getElementById("kraj").value;
        Kalendar.obojiZauzeca(document.getElementById("kalendar"), trenutniMjesec, sala, vrijemePocetka, vrijemeKraja);
    }

    const krajnjeV = document.getElementById('kraj');
    krajnjeV.addEventListener('input', updateValue);
    function updateValue(e) {
        var e = document.getElementById("listaSala");
        sala = e.options[e.selectedIndex].value;
        vrijemePocetka = document.getElementById("pocetak").value;
        vrijemeKraja = document.getElementById("kraj").value;
        Kalendar.obojiZauzeca(document.getElementById("kalendar"), trenutniMjesec, sala, vrijemePocetka, vrijemeKraja);
    }

    document.querySelectorAll('.mala').forEach(item => {
        item.addEventListener('click', event => {

            vrijemePocetka = document.getElementById("pocetak").value;
            vrijemeKraja = document.getElementById("kraj").value;

            var checkBox = document.getElementById("myCheck");
            if (checkBox.checked == true && (trenutniMjesec == 6 || trenutniMjesec == 7 || trenutniMjesec == 8)) {
                alert("Nije moguće izvršiti periodičnu rezervaciju u ovom mjesecu!");
            }
            else if(vrijemeKraja <= vrijemePocetka){
                alert("Pogrešno uneseno vrijeme rezervacije!");
            }

            else if (vrijemePocetka.trim() && vrijemeKraja.trim()) {

                let danUSedimci = item.childNodes[1].firstChild.firstChild.nextSibling.firstChild.textContent;
                var mjesec = trenutniMjesec + 1;
                var datumString = danUSedimci + "." + mjesec + "." + trenutnaGodina;
                var kojiDan = new Date(trenutnaGodina + "-" + mjesec + "-" + danUSedimci).getDay();
                if(kojiDan==0) kojiDan = 6;
                else kojiDan= kojiDan - 1; 
                if (item.childNodes[1].childNodes[2].childNodes[1].className == "slobodna") {
                    var r = confirm("Pritisnite OK da rezervišete salu!");
                    if (r == true) {
                        var semestra = "";
                        if (trenutniMjesec == 9 || trenutniMjesec == 10 || trenutniMjesec == 11 || trenutniMjesec == 0) semestra = "zimski";
                        if (trenutniMjesec == 1 || trenutniMjesec == 2 || trenutniMjesec == 3 || trenutniMjesec == 4 || trenutniMjesec == 5) semestra = "ljetni";
                        vrijemePocetka = document.getElementById("pocetak").value;
                        vrijemeKraja = document.getElementById("kraj").value;
                        var e = document.getElementById("listaSala");
                        sala = e.options[e.selectedIndex].value;
                        var checkBox = document.getElementById("myCheck");
                        var noviObj = "";
                        var f = document.getElementById("listaOsoblja");
                        let predavac = f.options[f.selectedIndex].value;

                        //provjera za mjesec!!!!
                        if (checkBox.checked == true) {
                            noviObj = { datum: datumString, dan: kojiDan, semestar: semestra, pocetak: vrijemePocetka, kraj: vrijemeKraja, naziv: sala, predavac };

                        } else {
                            noviObj = { datum: datumString, pocetak: vrijemePocetka, kraj: vrijemeKraja, naziv: sala, predavac };
                        }
                        var jsonObj = JSON.stringify(noviObj);

                        var json = JSON.parse(jsonObj);
                        Pozivi.posaljiZahtevZaUpisUBazu(jsonObj);
                        //Pozivi.posaljiZahtevZaUpis(jsonObj);

                    }
                }
            } else {
                alert("Niste unijeli sve podatke potrebne za rezervaciju!");
            }
        })
    })


}

function validirajPromjenu() {
    if (trenutniMjesec > 11) {
        trenutniMjesec = 11;
    }
    if (trenutniMjesec < 0) {
        trenutniMjesec = 0;
    }
}

function dajTrenutniMjesec() {
    return trenutniMjesec;
}



