let listaSlika = [];
let listaHTML = [];
let listaUcitanihSlika = [];

window.onload = function () {

  zamjenaSlika();
  prepareEventHandlers();
}

function zamjenaSlika() {
  Pozivi.ucitajSlikeSaServera(obj => {

    if (listaHTML.length == 0) document.getElementById("prethodnii").disabled = true;
    else document.getElementById("prethodnii").disabled = false;
    listaSlika = obj;

    if (listaSlika.length == 0) document.getElementById("sljedecii").disabled = true;
    else document.getElementById("sljedecii").disabled = false;

    if (listaSlika.length != 0) {

      let prviHtml = '<img id="prvaSlika" alt=" " width="600" height="400';
      let drugiHtml = '<img id="prvaSlika" alt=" " width="600" height="400';
      let treciHtml = '<img id="prvaSlika" alt=" " width="600" height="400';
      for (let i = 0; i < listaSlika.length; i++) {
        listaUcitanihSlika.push(listaSlika[i]);
        if (i == 0) prviHtml = prviHtml + '" src = "slike/' + listaSlika[i];
        if (i == 1) drugiHtml = drugiHtml + '" src = "slike/' + listaSlika[i];
        if (i == 2) treciHtml = treciHtml + '" src = "slike/' + listaSlika[i];
      }

      prviHtml = prviHtml + '">';
      drugiHtml = drugiHtml + '">';
      treciHtml = treciHtml + '">';

      let objekt = { prva: prviHtml, druga: drugiHtml, treca: treciHtml };

      document.getElementById("prva").innerHTML = objekt.prva;
      document.getElementById("druga").innerHTML = objekt.druga;
      document.getElementById("treca").innerHTML = objekt.treca;
      listaHTML.push(objekt);
    }

  }, listaUcitanihSlika);
}

function prepareEventHandlers() {

  var sljedeci = document.getElementById("sljedecii");
  sljedeci.onclick = function () {
    zamjenaSlika();

  }

  var prethodni = document.getElementById("prethodnii");
  prethodni.onclick = function () {
    document.getElementById("sljedecii").disabled = false;
    let skinutiObj = listaHTML.pop();
    if (skinutiObj.prva.includes("src")) listaUcitanihSlika.pop();
    if (skinutiObj.druga.includes("src")) listaUcitanihSlika.pop();
    if (skinutiObj.treca.includes("src")) listaUcitanihSlika.pop();
    if (listaHTML.length == 1) document.getElementById("prethodnii").disabled = true;
    else document.getElementById("prethodnii").disabled = false;

    document.getElementById("prva").innerHTML = (listaHTML[listaHTML.length - 1]).prva;
    document.getElementById("druga").innerHTML = (listaHTML[listaHTML.length - 1]).druga;
    document.getElementById("treca").innerHTML = (listaHTML[listaHTML.length - 1]).treca;
  }
}