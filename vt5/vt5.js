"use strict";
// seuraavat estävät jshintin narinat jqueryn ja leafletin objekteista
/* jshint jquery: true */
/* globals L */

console.log(data);

// Muutama globaali
let mymap;
let joukkueidenReitit = [];
let joukkueetKartalla = [];
let kaikkiRastit = new Map();
let kaikkiJoukkueet = new Map();
let edellinenPallero = false;
let edellinenMarker = false;
let siirretty = false;
let latLon = [];

// Pääohjelma
window.onload = function() {
    kartta();
    haeRastit();
    piirraRastit();
    luoLista(data);
    keskitaKartta();
    luoDropListener();
}

// Palauttaa taulukon joukkueen hyväksytyistä rasteista ( Ei sisällä kilpailun hyväksymistä, hyväksyy kaikki rastit tällä hetkellä)
function haeSallitutRastit(joukkue) {
    let lahto = false;
    let loppu = false;    

    let kilpailunRastit = new Set();
    for (let rasti of joukkue.rastit) {
        if (rasti.rasti != 0) {
        kilpailunRastit.add(parseInt(rasti.rasti));
        }
    }
    let joukkueenRastit = [];
    for (let rasti of kilpailunRastit) {
        let kokoRasti = kaikkiRastit.get(rasti);
        if (kokoRasti != undefined) {
        joukkueenRastit.push(kokoRasti);
        }
    }
    return joukkueenRastit;   
}

// Erillinen aliohjelma, joka luo drop-kuuntelijat listoille
function luoDropListener() {
    let drop = document.getElementById("kartallaLista");
    drop.addEventListener("dragover", function(e) {
        e.preventDefault();

        e.dataTransfer.dropEffect = "move"
    });

    let dropTakaisin = document.getElementById("joukkueetLista");
    dropTakaisin.addEventListener("dragover", function(e) {
        e.preventDefault();

        e.dataTransfer.dropEffect = "move"
    });

    dropTakaisin.addEventListener("drop", function(e) {
        e.preventDefault();
        // Jos elementti on kotoisin karttalistasta, annetaan sen siirtyä
        if (e.dataTransfer.getData('div') == "kartallaUl") {
            var siirrettavaData = e.dataTransfer.getData("text");
            // lisätään tämän elementin sisään
            let paikka = document.getElementById('joukkueetUl');
            paikka.append(document.getElementById(siirrettavaData));

            let alkio = joukkueidenReitit.find(function(i) {
                return i[0] == siirrettavaData;
            })

            alkio[1].remove(mymap);
            for (let i = 0; i < joukkueidenReitit.length; i++) {
                if (alkio[0] == joukkueidenReitit[i][0]) {
                    joukkueidenReitit.splice(i,1);
                    break;
                }
            }
            
            for (let i = 0; i < joukkueetKartalla.length; i++) {
                if (joukkueetKartalla[i].id == parseInt(siirrettavaData)) {
                    joukkueetKartalla.splice(i,1);
                    break;
                }
            }
        }
   });
    drop.addEventListener("drop", function(e) {
         e.preventDefault();
         var siirrettavaData = e.dataTransfer.getData("text");
        // lisätään tämän elementin sisään
        let paikka = document.getElementById('kartallaUl');
        paikka.prepend(document.getElementById(siirrettavaData));
        let joukkue = haeJoukkueet(data).find(function(joukkue) {
            return joukkue.id == siirrettavaData;
        });
        joukkueetKartalla.push(joukkue);
        piirraJoukkueenMatka(siirrettavaData);
    });
}

// Piirtää joukkueen kulkeman matkan kartalle
function piirraJoukkueenMatka(id) {
    
    let joukkue = haeJoukkueet(data).find(function(joukkue) {
        return joukkue.id == id;
    });

    let matka = haeSallitutRastit(joukkue);
    let latLngs = [];

    for (let rasti of matka) {
        latLngs.push([parseFloat(rasti.lat), parseFloat(rasti.lon)]);
    }
    let listaItem = document.getElementById(joukkue.id);
    let polyline = L.polyline(latLngs, {
        color: listaItem.style.backgroundColor
    }).addTo(mymap);

    joukkueidenReitit.push([joukkue.id, polyline]);

}

// Keskittää kartan rastien mukaan
function keskitaKartta() {
   mymap.fitBounds(L.latLngBounds(latLon));
}

// Kilpailun rastit sijoitetaan yhteen kasaan
function haeRastit() {
    for (let kilpailu of data) {
        for (let rasti of kilpailu.rastit) {
            kaikkiRastit.set(parseInt(rasti.id), {
                koodi: rasti.koodi,
                lat: rasti.lat,
                lon: rasti.lon
            });
        }
    }
}

// Piirtää kaikki tunnetut rastit karttaan
function piirraRastit() {
    let joukkueet = haeJoukkueet(data);
    let rastit = [];

   for (let rasti of kaikkiRastit) {
       if (!rastit.includes([rasti[1].lat, rasti[1].lon]));
       rastit.push([rasti[1].lat, rasti[1].lon, rasti[1].koodi]);
   }

    for (let rasti of rastit) {

        // Viedään kaikki näytetyt rastit tuonne aputaulukkoon.    
        latLon.push([rasti[0], rasti[1]]);    
        let circle = L.circle(
            [rasti[0], rasti[1]], {
                color: 'red',
                radius: 150,
                fill: true,
                fillOpacity: 0
            }
            ).addTo(mymap).on('click', function(e) {
                muokkaaRastia(e, this);                
            });
            circle.bindTooltip(rasti[2]);
        }
}

// Aliohjelma, jolla hallitaan rastin siirtäminen kartalla
function muokkaaRastia(e, pallero) { 
    if (edellinenPallero != false) {
        if (edellinenPallero.getLatLng() != siirretty) {
        let uusiPallero = L.circle(
            edellinenPallero.getLatLng(), {
                color: 'red',
                radius: 150,
                fill: true,
                fillOpacity: 0
            }
            ).addTo(mymap).on('click', function(e) {
                muokkaaRastia(e, this);                
            });
        edellinenPallero.remove(mymap);  
        edellinenMarker.remove(mymap);              
        }
    }

    pallero.options.fill = true;
    pallero.options.fillColor = 'red';
    pallero.options.fillOpacity = 1;
    pallero.remove(mymap);
    pallero.addTo(mymap);
    edellinenPallero = pallero;

    let marker = L.marker(pallero.getLatLng(), {
        draggable: true
    }).addTo(mymap).on('dragend', function() {
        siirretty = pallero.getLatLng();
        let uusiPallero = L.circle(
            marker.getLatLng(), {
                color: 'red',
                radius: 150,
                fill: true,
                fillOpacity: 0
            }
            ).addTo(mymap).on('click', function(e) {
                muokkaaRastia(e, this);                
            });
            if ( pallero.getTooltip() != undefined && uusiPallero.bindTooltip(pallero.getTooltip()._content != undefined)) {
            uusiPallero.bindTooltip(pallero.getTooltip()._content);
        }
            pallero.remove(mymap);
            edellinenPallero.remove(mymap);
            
            this.remove(mymap);

            paivitaRastit(edellinenPallero.getLatLng(), marker.getLatLng());
    });
    if (edellinenMarker != false) {
        edellinenMarker.remove(mymap);
    }
    edellinenMarker = marker;
}

// Päivittää rastiluettelon jos kartalla on siirrelty rastia
function paivitaRastit(vanhaRasti, uusiRasti) {
    for (let rasti of kaikkiRastit) {
        let latlon = [parseFloat(rasti[1].lat), parseFloat(rasti[1].lon)];
        let vanha = [vanhaRasti.lat, vanhaRasti.lng];
        if (arraysEqual(vanha,latlon)) {
            rasti[1].lat = uusiRasti.lat;
            rasti[1].lon = uusiRasti.lng;
        };
    }
    paivitaMatkat();
}

// Päivittää kaikkien joukkueiden kulkeman kokonaismatkan kun rasteja siirrellään kartalla
function paivitaMatkat() {
    for (let joukkue of joukkueetKartalla) {
        let alkio = joukkueidenReitit.find(function(i) {
            return i[0] == joukkue.id;
        })

        alkio[1].remove(mymap);
        for (let i = 0; i < joukkueidenReitit.length; i++) {
            if (alkio[0] == joukkueidenReitit[i][0]) {
                joukkueidenReitit.splice(i,1);
                break;
            }
        }
        piirraJoukkueenMatka(joukkue.id);
    }
    paivitaPituudet();
}

// Päivittää pituudet listoihin
function paivitaPituudet() {
    let kartalla = document.getElementById("kartallaUl").children;
    for (let elementti of kartalla) {
        let joukkue = haeJoukkue(elementti.id);
        elementti.textContent = joukkue.nimi + " - " + laskeJoukkueenMatka(joukkue) + "km";
    }
   
    let joukkueissa = document.getElementById('joukkueetUl').children;
    for (let elementti of joukkueissa) {
        let joukkue = haeJoukkue(elementti.id);
        elementti.textContent = joukkue.nimi + " - " + laskeJoukkueenMatka(joukkue) + "km";
    }
}

// Palauttaa joukkueen kaikki tiedot ID:n mukaan
function haeJoukkue(haettavaId) {
    for (let kilpailu of data) {
        for (let sarja of kilpailu.sarjat) {
            for (let joukkue of sarja.joukkueet) {
                if (joukkue.id == haettavaId) {
                    return joukkue;
                }
            }
        }
    }
}

// Tarkistaa ovatko taulukot samoja ( Tässä tapauksessa ovatko koordinaatit samat )
function arraysEqual(a1,a2) {
    return JSON.stringify(a1)==JSON.stringify(a2);
}

// Laskee joukkueen kulkeman matkan rastien mukaan
function laskeJoukkueenMatka(joukkue) {
    let pituus = 0;
    let edellinenRasti;
    let matka = haeSallitutRastit(joukkue);
    for (let i = 0; i < matka.length; i++) {
        if (i == 0) {
            edellinenRasti = matka[0];
        }
        else {
            pituus += getDistanceFromLatLonInKm(edellinenRasti.lat,edellinenRasti.lon,matka[i].lat,matka[i].lon);
            edellinenRasti = matka[i];
        }
    }
    return pituus.toFixed(0);
}

// Luo listat näkyviin
function luoLista(data) {
    let ul = document.createElement('ul');
    ul.setAttribute('id', "joukkueetUl");
    let i = 0;

    let joukkueet = haeJoukkueet(data);
    for (let joukkue of joukkueet) {
        let li = document.createElement('li');
        li.textContent = joukkue.nimi + " - " + laskeJoukkueenMatka(joukkue) + "km";
        li.style.backgroundColor = rainbow(joukkueet.length, i);
        i++;
        li.setAttribute('draggable', true);
        li.setAttribute('id', joukkue.id);
        li.addEventListener("dragstart", function(e) {
            // raahataan datana elementin id-attribuutin arvo
             e.dataTransfer.setData("text/plain", li.getAttribute("id"));
             e.dataTransfer.setData('div', li.parentElement.id);
          });
        ul.appendChild(li);
    }
    let paikka = document.getElementById("joukkueetLista");
    paikka.append(ul);

    // Tehdään kartalla-listasta sortable
    $( function() {
        $("kartallaUl").sortable();
        $("kartallaUl").disableSelection();
    });
    
}

// Palauttaa kaikki datasta löytyneet joukkueet
function haeJoukkueet(data) {
    let joukkueet = [];
    for (let kilpailu of data) {
        for (let sarja of kilpailu.sarjat) {
            for (let joukkue of sarja.joukkueet) {
                joukkueet.push(joukkue);
            }
        }
    }
    return joukkueet;
}

// Luodaan kartta, tässä tapauksessa openstreetmapin kautta
function kartta() {
    mymap = new L.map('map', {
    }).setView([62.2333, 25.7333], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         maxZoom: 19,
         attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(mymap);     
    
}

// Reitin pituuden laskija
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

// Hienot värit - aliohjelma  
function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    let r, g, b;
    let h = step / numOfSteps;
    let i = ~~(h * 6);
    let f = h * 6 - i;
    let q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    let c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}