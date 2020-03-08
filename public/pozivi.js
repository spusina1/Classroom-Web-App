let Pozivi = (function () {

  let listaRedovnih = [];
  let listaVanrednih = [];


  function ucitajSaServera() {

    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = () => {

      if (ajax.readyState == 4 && ajax.status == 200) {

        var jsonData = JSON.parse(ajax.responseText);

        for (var i = 0; i < jsonData.periodicna.length; i++) {
          var jednoZauzece = jsonData.periodicna[i];

          var sala = {
            dan: jednoZauzece.dan,
            semestar: jednoZauzece.semestar,
            pocetak: jednoZauzece.pocetak,
            kraj: jednoZauzece.kraj,
            naziv: jednoZauzece.naziv,
            predavac: jednoZauzece.predavac
          };
          listaRedovnih.push(sala);
        }

        for (var i = 0; i < jsonData.vanredna.length; i++) {
          jednoZauzece = jsonData.vanredna[i];

          var salaV = {
            datum: jednoZauzece.datum,
            pocetak: jednoZauzece.pocetak,
            kraj: jednoZauzece.kraj,
            naziv: jednoZauzece.naziv,
            predavac: jednoZauzece.predavac
          };
          listaVanrednih.push(salaV);
        }
        
        Kalendar.ucitajPodatke(listaRedovnih, listaVanrednih);
      }

      if (ajax.readyState == 4 && ajax.status == 404)
        console.log('Greska');
    }
    ajax.open("GET", "zauzeca.json", true);
    ajax.send();
  }


  function ucitajTermine(callback){
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = () => {

      if (ajax.readyState == 4 && ajax.status == 200) {
        let lista = JSON.parse(ajax.responseText);
    
        callback(lista);     
      }

      if (ajax.readyState == 4 && ajax.status == 404)
        console.log('Greska');
    }
    ajax.open("GET", "/termini", true);
    ajax.send();
  }

  function ucitajRezervacijeIzBaze(){
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = () => {

      if (ajax.readyState == 4 && ajax.status == 200) {
        var jsonData = JSON.parse(ajax.responseText);
     
        for (var i = 0; i < jsonData.periodicna.length; i++) {
          var jednoZauzece = jsonData.periodicna[i];

          var sala = {
            dan: jednoZauzece.dan,
            semestar: jednoZauzece.semestar,
            pocetak: jednoZauzece.pocetak,
            kraj: jednoZauzece.kraj,
            naziv: jednoZauzece.naziv,
            predavac: jednoZauzece.predavac
          };
          listaRedovnih.push(sala);
        }

        for (var i = 0; i < jsonData.vanredna.length; i++) {
          jednoZauzece = jsonData.vanredna[i];

          var salaV = {
            datum: jednoZauzece.datum,
            pocetak: jednoZauzece.pocetak,
            kraj: jednoZauzece.kraj,
            naziv: jednoZauzece.naziv,
            predavac: jednoZauzece.predavac
          };
          listaVanrednih.push(salaV);
        }
        Kalendar.ucitajPodatke(listaRedovnih, listaVanrednih);
        
      }

      if (ajax.readyState == 4 && ajax.status == 404)
        console.log('Greska');
    }
    ajax.open("GET", "/rezervacije", true);
    ajax.send();
  }

  function ucitajOsobljeIzBaze() {

    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = () => {

      if (ajax.readyState == 4 && ajax.status == 200) {

        let osobe = (JSON.parse(ajax.responseText)).lista;
        for(let i =0; i<osobe.length; i++){
        var x = document.getElementById("listaOsoblja");
        var option = document.createElement("option");
        option.text = osobe[i].ime + " " + osobe[i].prezime + ", " + osobe[i].uloga;
        x.add(option); 
        }
      }

      if (ajax.readyState == 4 && ajax.status == 404)
        console.log('Greska');
    }
    ajax.open("GET", "/osoblje", true);
    ajax.send();

  }


  function posaljiZahtevZaUpisUBazu(json) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
      if (ajax.readyState == 4 && ajax.status == 200) {
        var json = JSON.parse(ajax.responseText);

        var ct = ajax.getResponseHeader("content-type") || "";
        if (ct.indexOf('html') > -1) {
         
          alert(json.Poruka);
        }
     
          var jsonData = json.Objekt;
          for (var i = 0; i < jsonData.periodicna.length; i++) {
            var jednoZauzece = jsonData.periodicna[i];

            var sala = {
              dan: jednoZauzece.dan,
              semestar: jednoZauzece.semestar,
              pocetak: jednoZauzece.pocetak,
              kraj: jednoZauzece.kraj,
              naziv: jednoZauzece.naziv,
              predavac: jednoZauzece.predavac
            };
            listaRedovnih.push(sala);
          }

          for (var i = 0; i < jsonData.vanredna.length; i++) {
            jednoZauzece = jsonData.vanredna[i];

            var salaV = {
              datum: jednoZauzece.datum,
              pocetak: jednoZauzece.pocetak,
              kraj: jednoZauzece.kraj,
              naziv: jednoZauzece.naziv,
              predavac: jednoZauzece.predavac
            };
            listaVanrednih.push(salaV);
          }
          Kalendar.ucitajPodatke(listaRedovnih, listaVanrednih);

          var e = document.getElementById("listaSala");
          sala = e.options[e.selectedIndex].value;
          vrijemePocetka = document.getElementById("pocetak").value;
          vrijemeKraja = document.getElementById("kraj").value;
          Kalendar.obojiZauzeca(document.getElementById("kalendar"), dajTrenutniMjesec(), sala, vrijemePocetka, vrijemeKraja);
        


      }
      else if (ajax.readyState == 4)
        console.log('Greska');
    }
    ajax.open("POST", "/rezervacijaUpis", true);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.send(json);
  }

  function posaljiZahtevZaUpis(json) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
      if (ajax.readyState == 4 && ajax.status == 200) {
        var json = JSON.parse(ajax.responseText);

        var ct = ajax.getResponseHeader("content-type") || "";
        if (ct.indexOf('html') > -1) {
         
          alert(json.Poruka);
        }
     
          var jsonData = json.Objekt;
          for (var i = 0; i < jsonData.periodicna.length; i++) {
            var jednoZauzece = jsonData.periodicna[i];

            var sala = {
              dan: jednoZauzece.dan,
              semestar: jednoZauzece.semestar,
              pocetak: jednoZauzece.pocetak,
              kraj: jednoZauzece.kraj,
              naziv: jednoZauzece.naziv,
              predavac: jednoZauzece.predavac
            };
            listaRedovnih.push(sala);
          }

          for (var i = 0; i < jsonData.vanredna.length; i++) {
            jednoZauzece = jsonData.vanredna[i];

            var salaV = {
              datum: jednoZauzece.datum,
              pocetak: jednoZauzece.pocetak,
              kraj: jednoZauzece.kraj,
              naziv: jednoZauzece.naziv,
              predavac: jednoZauzece.predavac
            };
            listaVanrednih.push(salaV);
          }
          Kalendar.ucitajPodatke(listaRedovnih, listaVanrednih);

          var e = document.getElementById("listaSala");
          sala = e.options[e.selectedIndex].value;
          vrijemePocetka = document.getElementById("pocetak").value;
          vrijemeKraja = document.getElementById("kraj").value;
          Kalendar.obojiZauzeca(document.getElementById("kalendar"), dajTrenutniMjesec(), sala, vrijemePocetka, vrijemeKraja);
        


      }
      else if (ajax.readyState == 4)
        console.log('Greska');
    }
    ajax.open("POST", "http://localhost:8080", true);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.send(json);
  }

  function ucitajSlikeSaServera(callback, listaUcitanihSlika) {
    
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = () => {

      if (ajax.readyState == 4 && ajax.status == 200) {

        let triTrenutnoUcitane = (JSON.parse(ajax.responseText)).triSlike;
       
        callback(triTrenutnoUcitane);
      }

      if (ajax.readyState == 4 && ajax.status == 404)
        console.log('Greska');
    }

    ajax.open("POST", "/pocetna.html", true);
    ajax.setRequestHeader("Content-Type", "application/json");
    let arr = JSON.stringify(listaUcitanihSlika);
    ajax.send(arr);
  }


  return {
    ucitajSaServera: ucitajSaServera,
    posaljiZahtevZaUpis: posaljiZahtevZaUpis,
    ucitajSlikeSaServera: ucitajSlikeSaServera,
    ucitajOsobljeIzBaze: ucitajOsobljeIzBaze,
    ucitajRezervacijeIzBaze: ucitajRezervacijeIzBaze,
    posaljiZahtevZaUpisUBazu: posaljiZahtevZaUpisUBazu,
    ucitajTermine:ucitajTermine
  };
}());

