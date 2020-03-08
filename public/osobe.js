let listaUpisanih = [];

function dajSemestar(mjesec) {
  ljetni = [1, 2, 3, 4, 5];
  zimski = [9, 10, 11, 0];

  if (ljetni.includes(mjesec)) return "ljetni";
  else if (zimski.includes(mjesec)) return "zimski";
  else return "raspust";
}

function daLiJeUpisan(osoba) {
  for (let j = 0; j < listaUpisanih.length; j++) {
    if (listaUpisanih[j].ime == osoba.ime && listaUpisanih[j].prezime == osoba.prezime && listaUpisanih[j].uloga == osoba.uloga) return 1;
  }
  return 0;
}


setInterval(
  window.onload = function () {
    Pozivi.ucitajTermine(lista => {

      let listaTermina = lista.listaTermina;
      let listaOsoblja = lista.listaOsoblja;
      let datum = new Date();
      let d = datum.getDate();
      let m = datum.getMonth() + 1;
      let dat = d + "." + m + "." + datum.getFullYear();
      let dan = datum.getDay();
      if (dan == 0) dan = 6;
      else dan = dan - 1;
      let mjesec = datum.getMonth();
      let vrijeme = datum.getHours() + ":" + datum.getMinutes() + ":" + datum.getSeconds();


      for (let i = 0; i < listaOsoblja.length; i++) {
        if (daLiJeUpisan(listaOsoblja[i]) == 0) {
          let node = document.createElement("li");
          let textnode = document.createTextNode("Osoba: " + listaOsoblja[i].ime + " " + listaOsoblja[i].prezime + ", Uloga: " + listaOsoblja[i].uloga + ", u kancelariji");
          listaUpisanih.push({ ime: listaOsoblja[i].ime, prezime: listaOsoblja[i].prezime, uloga: listaOsoblja[i].uloga });
          node.appendChild(textnode);
          document.getElementById("vrijemeZauzeca").appendChild(node);
        }
      }

      let listaDjece = document.getElementById("vrijemeZauzeca").childNodes;

      for (let j = 0; j < listaOsoblja.length; j++) {
        let logicka = 1;
        for (let i = 0; i < listaTermina.length; i++) {

          if (listaTermina[i].idOsobe == listaOsoblja[j].idOsobe && listaTermina[i].redovna == 1 && this.dajSemestar(mjesec) == listaTermina[i].semestar && dan == listaTermina[i].dan && validirajV(listaTermina[i].pocetak, listaTermina[i].kraj)) {

            logicka = 0;
            listaDjece[listaOsoblja[j].idOsobe].innerHTML = "Osoba: " + listaOsoblja[j].ime + " " + listaOsoblja[j].prezime + ", Uloga: " + listaOsoblja[j].uloga + ", Sala: " + listaTermina[i].sala;
          }

          else if (listaTermina[i].idOsobe == listaOsoblja[j].idOsobe && listaTermina[i].redovna == 0 && dat == listaTermina[i].datum && validirajV(listaTermina[i].pocetak, listaTermina[i].kraj)) {
            logicka = 0;
            listaDjece[listaOsoblja[j].idOsobe].innerHTML = "Osoba: " + listaOsoblja[j].ime + " " + listaOsoblja[j].prezime + ", Uloga: " + listaOsoblja[j].uloga + ", Sala: " + listaTermina[i].sala;

          }
        }
        if (logicka) {
          listaDjece[listaOsoblja[j].idOsobe].innerHTML = "Osoba: " + listaOsoblja[j].ime + " " + listaOsoblja[j].prezime + ", Uloga: " + listaOsoblja[j].uloga + ", u kancelariji";
        }
      }



    });
  },
  30 * 1000
);

function validirajV(pocetak, kraj) {
  let poc = pocetak.split(":");
  let kra = kraj.split(":");
  let sPocetak = parseInt(poc[0]);
  let sKraj = parseInt(kra[0]);
  let minPocetak = parseInt(poc[1]);
  let minKraj = parseInt(kra[1]);
  let datum = new Date();
  let vrijeme = datum.getHours() * 60 + datum.getMinutes();
  let mPocetak = sPocetak * 60 + minPocetak;
  let mKraj = sKraj * 60 + minKraj;

  if (mPocetak <= vrijeme && vrijeme < mKraj) return true;

  return false;

}

