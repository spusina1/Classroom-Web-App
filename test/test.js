const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
var assert = chai.assert;
var expect = chai.expect;
chai.use(chaiHttp);

describe('Pozivi', function () {
    describe('ucitajOsobljeIzBaze()', function () {
        
        it('Ucitavanje osoblja', function () {
            chai.request('http://localhost:8080')
                .get('/osoblje')
                .end((err, res) => {
                    assert.equal(res.body.lista.length, 3, "Lista treba imati 3 elementa");
                });
                
        });

    });
    describe('ucitajRezervacijeIzBaze()', function () {
        it('Ucitavanje inicijalnih rezervacija iz baze', function () {
            chai.request('http://localhost:8080')
                .get('/rezervacije')
                .end((err, res) => {                   
                    assert.equal(res.body.periodicna.length>=1, true, "Lista periodicnih rezervacija nije prazna");
                   
                });                
        });

    });
    describe('posaljiZahtjevZaUpisUBazu()', function () {
        it('Neuspijesno dodavanje u bazu jer je osoba u tom vremenu u drugoj sali', function () {
            let noviObj = {
                datum: '1.1.2020',
                dan: 2,
                semestar: 'zimski',
                pocetak: '12:00',
                kraj: '13:00',
                naziv: '1-11',
                predavac: 'Neko Nekic, profesor'
              };
            var jsonObj = JSON.stringify(noviObj);
            chai.request('http://localhost:8080')
                .post('/rezervacijaUpis')
                .send(noviObj)
                .end((err, res) => {                   
                    expect(res).to.have.status(200);
               
                    assert.equal((res.text).includes("Osoba Neko Nekic, profesor, za navedeni datum 1.1.2020 i termin od 12:00 do 13:00 vec ima jednu rezervaciju!"), true, "Osoba ima rezervaciju");                                      
                });               
        });
    });

    describe('posaljiZahtjevZaUpisUBazu()', function () {
        it('Neuspijesno dodavanje u bazu jer u sali u tom vremenu ima druga osoba', function () {
            let noviObj = {
                datum: '1.1.2020',
                dan: 2,
                semestar: 'zimski',
                pocetak: '12:00',
                kraj: '13:00',
                naziv: '1-11',
                predavac: 'Drugi Neko, profesor'
              };
            var jsonObj = JSON.stringify(noviObj);
            chai.request('http://localhost:8080')
                .post('/rezervacijaUpis')
                .send(noviObj)
                .end((err, res) => {                   
                    expect(res).to.have.status(200);
                    assert.equal((res.text).includes("Nije moguće rezervisati salu 1-11 za navedeni datum 1.1.2020 i termin od 12:00 do 13:00 jer je salu rezervisala osoba Neko Nekic, profesor!"), true, "Druga osoba ima rezervaciju");                                      
                });               
        });       
    });

    describe('posaljiZahtjevZaUpisUBazu()', function () {
        it('Uspjesno dodavanje u bazu', function () {
            let noviObj = {
                datum: '7.7.2020',
                pocetak: '12:00',
                kraj: '13:00',
                naziv: '1-11',
                predavac: 'Drugi Neko, asistent'
              };
            var jsonObj = JSON.stringify(noviObj);
            chai.request('http://localhost:8080')
                .post('/rezervacijaUpis')
                .send(noviObj)
                .end((err, res) => {                   
                    expect(res).to.have.status(200);
                    assert.equal((res.text).includes(JSON.stringify(noviObj)), true, "Nije vracena poruka, vanredna rezervacija dodana!");                                      
                });               
        });       
    });

    describe('posaljiZahtjevZaUpisUBazu()', function () {
        it('Uspjesno dodavanje u bazu', function () {
            let noviObj = {"dan":4,"semestar":"zimski","pocetak":"12:00:00","kraj":"13:00:00","naziv":"1-02","predavac":"Test Test, asistent"};
              
            var jsonObj = JSON.stringify(noviObj);
            chai.request('http://localhost:8080')
                .post('/rezervacijaUpis')
                .send(noviObj)
                .end((err, res) => {                   
                    expect(res).to.have.status(200);
                    //expect(res).to.be.text({});
                    assert.equal((res.text).includes(JSON.stringify(noviObj)), true, "Nije vracena poruka, redovna rezervacija dodana!");                                      
                });               
        });       
    });

    describe('ucitajTermine()', function () {
        it('Dobavljanje rezervacija iz baze sa zaduzenim osobama', function () {
            let obj = {"idOsobe":1,"sala":"1-11","dan":null,"datum":"01.01.2020","redovna":false,"semestar":null,"pocetak":"12:00:00","kraj":"13:00:00"};
            chai.request('http://localhost:8080')
                .get('/termini')
                .end((err, res) => {                                      
                   // expect(res).to.be.text({});
                    assert.equal((res.text).includes(JSON.stringify(obj)), true, "Ispravna rezervacija i osoba!");                                      
                });               
        });       
    });
    describe('ucitajTermine()', function () {
        it('Dobavljanje rezervacija iz baze sa zaduzenim osobama 2', function () {
            let obj = {"idOsobe":1,"sala":"1-10","dan":null,"datum":"01.01.2020","redovna":false,"semestar":null,"pocetak":"12:00:00","kraj":"13:00:00"};
            chai.request('http://localhost:8080')
                .get('/termini')
                .end((err, res) => {                                      
                    assert.equal((res.text).includes(JSON.stringify(obj)), false, "Neispravna rezervacija i osoba!");                                      
                });               
        });       
    });
    describe('ucitajOsobljeIzBaze()', function () {
        
        it('Neispravan broj ucitanih', function () {
            chai.request('http://localhost:8080')
                .get('/osoblje')
                .end((err, res) => {
                    assert.notEqual(res.body.lista.length, 2, "Lista treba imati 3 elementa");
                });
                
        });

    });
    describe('ucitajRezervacijeIzBaze()', function () {
        it('Pogresno ucitavanje rezervacija', function () {
            chai.request('http://localhost:8080')
                .get('/rezervacije')
                .end((err, res) => {                   
                    assert.notEqual(res.body.periodicna.length==0, true, "Lista periodicnih rezervacija nije prazna");
                   
                });                
        });

    });
});
