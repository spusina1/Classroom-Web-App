let Kalendar = (function () {

  let listaRedovnih = [];
  let listaVanrednih = [];

  function ucitajPodatke(listaRedovni, listaVanredni) {
    listaRedovnih = listaRedovni;
    listaVanrednih = listaVanredni;
  }

  function provjeriVrijeme(pocetak, kraj, salaPocetak, salaKraj) {

    if (pocetak <= salaPocetak && kraj >= salaKraj) return true;
    if (pocetak >= salaPocetak && kraj <= salaKraj && pocetak < kraj) return true;
    if (pocetak <= salaPocetak && kraj > salaPocetak) return true;
    if (pocetak < salaKraj && kraj >= salaKraj) return true;
    return false;
  }

  function ocistiBojeKalendara(kalendarRef) {
    var c = kalendarRef.children;
    for (var i = 8; i < c.length; i++) {
      var td = c[i].childNodes[1].childNodes[1].childNodes[2].childNodes[1];
      td.className = "slobodna";
    }
  }

  function obojiZauzeca(kalendarRef, tmjesec, sala, pocetak, kraj) {
    var mjesec = tmjesec + 1;
    ocistiBojeKalendara(kalendarRef);


    for (var i = 0; i < listaRedovnih.length; i++) {
       console.log(listaRedovnih[i].naziv);
       console.log(sala);

      if (listaRedovnih[i].naziv == sala) {

      console.log("Tu sam");
        if ((listaRedovnih[i].semestar == "zimski" && (mjesec == 10 || mjesec == 11 || mjesec == 12 || mjesec == 1)) ||
          (listaRedovnih[i].semestar == "ljetni" && (mjesec == 2 || mjesec == 3 || mjesec == 4 || mjesec == 5 || mjesec == 6))) {

           
          if (provjeriVrijeme(pocetak, kraj, listaRedovnih[i].pocetak, listaRedovnih[i].kraj)) {
            var c = kalendarRef.children;
            var brojIndeksa = c[8].style.gridColumnStart;
            var kolona = listaRedovnih[i].dan;
            if(kolona==6) kolona = 0;
            else kolona = kolona + 1;
            var pocetakBrojanja = 8;
            if (brojIndeksa > kolona) {
              var razlikaDana = brojIndeksa - kolona;
              var koeficijentKolone = 8 - razlikaDana;
              pocetakBrojanja = koeficijentKolone + 7;
            }
            else if (brojIndeksa < kolona) {
              var razlikaDana = kolona - brojIndeksa;
              pocetakBrojanja = 8 + razlikaDana;
            }
            var j;
            for (j = pocetakBrojanja; j < c.length; j = j + 7) {
              var td = c[j].childNodes[1].childNodes[1].childNodes[2].childNodes[1];
              td.className = "zauzeta";
            }
          }
        }
      }
    }

    for (var k = 0; k < listaVanrednih.length; k++) {
      var strnigDatum = (listaVanrednih[k].datum).split(".");
      strnigDatum.reverse();
      strnigDatum.join("-");
      let datum = new Date(strnigDatum);
      let danZauzeca = datum.getDate();
      let mjesecZauzeca = datum.getMonth() + 1;
      let godinaZauzeca = datum.getFullYear();
      var trenutnaGodina;
      var d = new Date();
      trenutnaGodina = d.getFullYear();

      if (listaVanrednih[k].naziv == sala && mjesecZauzeca == mjesec && trenutnaGodina == godinaZauzeca) {
        if (provjeriVrijeme(pocetak, kraj, listaVanrednih[k].pocetak, listaVanrednih[k].kraj)) {
          var c = kalendarRef.children;
          var indeks = danZauzeca + 7;
          var td = c[indeks].childNodes[1].childNodes[1].childNodes[2].childNodes[1];
          td.className = "zauzeta";
        }
      }
    }
  }

  function iscrtajKalendar(kalendarRef, tmjesec) {
    document.getElementById("29").style.display = "block";
    document.getElementById("30").style.display = "block";
    document.getElementById("31").style.display = "block";

    var mjesec = tmjesec + 1;

    var d = new Date();
    var d = new Date();
    var trenutnaGodina = d.getFullYear();
    var brojDana = daysInMonth(mjesec, 2019);

    var prviDan = new Date(trenutnaGodina + "-" + mjesec + "-01").getDay();
    prviDan = (prviDan === 0) ? 7 : prviDan;

    var naziviMjeseci = ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar"];
    var boja = document.getElementById("prviD").style.gridColumnStart = prviDan;
    document.getElementById("box").innerHTML = naziviMjeseci[mjesec - 1] + " " + trenutnaGodina;

    for (var i = brojDana + 1; i <= 31; i++) {
      let string = `${i}`;
      document.getElementById(string).style.display = "none";
    }
  }

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  return {
    iscrtajKalendar: iscrtajKalendar,
    obojiZauzeca: obojiZauzeca,
    ucitajPodatke: ucitajPodatke

  };
}());


