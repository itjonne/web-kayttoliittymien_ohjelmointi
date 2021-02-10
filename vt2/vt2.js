/*

LUKIJALLE PAHOITTELUT, NYT EI OLE AIKAA SIISTIÄ TÄTÄ....

*/

let idNro = 1;
let localData = data;
let muokkaa = false;
let muokkaaRasti = false;
let maara = 1;
let muokattavaJoukkue;
let muokattavaRasti;

let kaikkiRastit;

"use strict";

// Luodaan tulostaulukko josta selviää joukkueet sarjoittain.
function luoTulosTaulukko(data) {
    // haetaan taulukon paikka
    let paikka = document.getElementById('tupa');
    let taulukko = document.createElement('table');
    let caption = document.createElement('caption');
    caption.textContent = "Tulokset";

    // luodaan taulukon otsikot
    let otsikkoRivi = document.createElement('tr');
    let otsikkoSarja = document.createElement('th');
    otsikkoSarja.textContent = "Sarja";
    let otsikkoJoukkue = document.createElement('th');
    otsikkoJoukkue.textContent = "Joukkue";

    otsikkoRivi.append(otsikkoSarja);
    otsikkoRivi.append(otsikkoJoukkue)

    // luodaan aputietorakenne joukkueille.
    let sarjaJaJoukkue = [];

    for (let kilpailu of data) {
        let sarjat = kilpailu.sarjat.sort((a,b) => a.nimi.localeCompare(b.nimi));
        for (let sarja of sarjat) {
            let joukkueet = sarja.joukkueet.sort((a,b) => a.nimi.localeCompare(b.nimi));
            for (let joukkue of joukkueet) {
                let palautettava = {
                    sarja: sarja.nimi,
                    joukkue: joukkue.nimi
                }
                sarjaJaJoukkue.push(palautettava);
            }
        }
    }

    // sijoitetaan taulukkoon caption + otsikko + sisältö
    taulukko.append(caption);
    taulukko.append(otsikkoRivi);
    
    for (let joukkue of sarjaJaJoukkue) {
        taulukko.append(luoRivi(joukkue));
    }
    
    paikka.append(taulukko);
}

// Luodaan lomake rastin lisäystä varten Taso 1
// Tässä oli alunperin hieno tuollainen testeri, jolla varmistettiin, että inputeissa on arvo
// Loppujenlopuksi tässä käytetään kuitenkin buttonin disabled / not, koska se tuntui paremmalta.
function luoForm() {
    let paikka = document.getElementById('form');
    if (paikka.children.length > 0) paikka.removeChild(paikka.children[0]); 

    let sisalto = ["Lat ", "Lon ", "Koodi "];
    let fieldset = document.createElement('fieldset');

    let legend = document.createElement('legend');
    legend.textContent = "Rastin tiedot";
    fieldset.append(legend);

    let pButton = document.createElement('p');
    let button = document.createElement('button');
    button.name = "rasti";
    button.id = "lisaaRasti";
    button.textContent = "Lisää rasti";
    button.disabled = true;
    pButton.append(button);

    // asetetaan clickikuuntelija jo tässä
    button.addEventListener("click", klikkikasittelija);
    function klikkikasittelija(e) {
    e.preventDefault();
    
    // Seuraavat rivit on testausta varten, tätä ei enää käytetä viimeisessä versiossa.    
    let lat = document.getElementById('lat').value;
    let lon = document.getElementById('lon').value;
    let koodi = document.getElementById('koodi').value;

    if (lat === "" || lon === "" || koodi === "") {
        if (!document.getElementById('virhe')) {
        let p = document.createElement('p');
        p.id = "virhe";
        p.textContent = "Jäikö joku kohta tyhjäksi?";
        p.style = "color: red";
        fieldset.append(p);
        }
    }

        else {
        if (document.getElementById('virhe')) document.getElementById('virhe').parentElement.removeChild(document.getElementById('virhe').parentElement.lastChild);
        lisaaRasti(lat, lon, koodi);
        } 
    }

    // Laiskana tehdään silmukalla
    for (let teksti of sisalto) {
        let p = document.createElement('p');

        let label = document.createElement('label');
        label.textContent = teksti;
        
        let input = document.createElement('input');
        input.type = "text";
        input.value = "";
        input.id = teksti.trim().toLowerCase();
        input.required = true;
        input.addEventListener("input", kokeileOnkoInputeissaArvoRasti);

        p.append(label);
        p.append(input);
        fieldset.append(p);
    } 
    fieldset.append(pButton);
   // fieldset.append(pButton2);
    paikka.append(fieldset);
}

// Luodaan lomake rastin lisäystä varten (TASO 5).
function luoFormRasti() {
    let paikka = document.getElementById('fieldsetJoukkue');
    let sisalto = ["Lat ", "Lon ", "Koodi ", "Aika "];
    let fieldset = document.createElement('fieldset');

    let legend = document.createElement('legend');
    legend.textContent = "Muokkaa joukkueen rastia";
    fieldset.append(legend);

    let pButton2 = document.createElement('p');
    let button2 = document.createElement('button');
    button2.name = "rastiMuokkaa";
    button2.id = "muokkaaRasti";
    button2.textContent = "Muokkaa rastia";
    button2.disabled = true;
    pButton2.append(button2);

    let pButton3 = document.createElement('p');
    let button3 = document.createElement('button');
    button3.name = "rastiPoista";
    button3.id = "poistaRasti";
    button3.textContent = "Poista rasti";
    button3.disabled = false;
    pButton3.append(button3);

    // asetetaan clickikuuntelija jo tässä
    button2.addEventListener("click", klikkikasittelija2);
    function klikkikasittelija2(e) {
    e.preventDefault();
    muokkaaRastia();
    }

    // asetetaan clickikuuntelija jo tässä
    button3.addEventListener("click", klikkikasittelija3);
    function klikkikasittelija3(e) {
    e.preventDefault();
    poistaRasti();
    }    

    // Laiskana luodaan sisällöt silmukassa
    for (let teksti of sisalto) {
        let p = document.createElement('p');

        let label = document.createElement('label');
        label.textContent = teksti;
        
        let input = document.createElement('input');
        input.type = "text";
        input.value = "";
        input.id = teksti.trim().toLowerCase() + "Muokkaa";
        input.required = true;
        input.addEventListener("input", kokeileOnkoInputeissaArvoRasti);
        if (teksti.trim() === "Lat" || teksti.trim() === "Lon" || teksti.trim() === "Koodi") {
            input.readOnly = true;
        }

        p.append(label);
        p.append(input);
        fieldset.append(p);
    } 
    fieldset.append(pButton2);
    fieldset.append(pButton3);
    paikka.append(fieldset);
}

// Aliohjelma, joka kirjoittaa joukkueen tiedot riville ja palauttaa sen
function luoRivi(joukkue) {
    let rivi = document.createElement('tr');
    let tdSarja = document.createElement('td');
    tdSarja.textContent = joukkue.sarja;
    rivi.append(tdSarja);

    let tdJoukkue = document.createElement('td');
    tdJoukkue.textContent = joukkue.joukkue;
    rivi.append(tdJoukkue);
    
    return rivi;
}

// Aliohjelma, joka lisää rastin Jäärogaining-kilpailuun. Rasti saa myös oman id-numeron.
function lisaaRasti(ilat, ilon, ikoodi) {
    let rasti = {};
    let rastit = [];
    let kilpailuNimi = "Jäärogaining";

    for (let kilpailu of data) {
        for (let rasti of kilpailu.rastit) {
            rastit.push(rasti.id);
        }
    }

    while (rastit.includes(idNro)) {       
        idNro++;
    }

    rasti = {
        lon: ilon,
        koodi: ikoodi,
        lat: ilat,
        id: idNro
        }

    for (let kilpailu of data) {
        if (kilpailu.nimi === kilpailuNimi) {
            kilpailu.rastit.push(rasti);
        }
    }
    tulostaRastit(data);
    luoForm();
}

// Tämä tulostaa rastit consoleen.
function tulostaRastit(data) {
    for (let kilpailu of data) {
        for (let rasti of kilpailu.rastit) {
            console.log(rasti.lon, rasti.lat, rasti.koodi);
        }
    }
}

// ================= TASO 3 ========================

// Luodaan uusi 3. tason mukainen tulostaulukko.
// @sort tuo sorttausfunktion, millä taulukko sortataan
function luoTulosTaulukkoTaso3(data, sort = sortSarja) {
    let paikka = document.getElementById('tupa3');
    if (paikka.children.length > 0) paikka.removeChild(paikka.children[0]);

    // haetaan taulukon paikka
    let taulukko = document.createElement('table');
    let caption = document.createElement('caption');
    caption.textContent = "Tulokset";

    // luodaan taulukon otsikot
    let otsikkoRivi = document.createElement('tr');
    let otsikkoSarja = document.createElement('th');
    let linkkiSarja = document.createElement('a');
    linkkiSarja.setAttribute('href', '#tupa3');
    linkkiSarja.onclick = () => luoTulosTaulukkoTaso3(data, sortSarja);
    linkkiSarja.textContent = "Sarja";
    otsikkoSarja.append(linkkiSarja);

    //otsikkoSarja.textContent = "Sarja";
    let otsikkoJoukkue = document.createElement('th');
    let linkkiJoukkue = document.createElement('a');
    linkkiJoukkue.setAttribute('href', '#tupa3');
    linkkiJoukkue.onclick = () => luoTulosTaulukkoTaso3(data, sortJoukkue);
    linkkiJoukkue.textContent = "Joukkue";
    otsikkoJoukkue.append(linkkiJoukkue);

    //otsikkoJoukkue.textContent = "Joukkue";
    let otsikkoPisteet = document.createElement('th');
    let linkkiPisteet = document.createElement('a');
    linkkiPisteet.setAttribute('href', '#tupa3');
    linkkiPisteet.onclick = () => luoTulosTaulukkoTaso3(data, sortPisteet);
    linkkiPisteet.textContent = "Pisteet";
    otsikkoPisteet.append(linkkiPisteet);
    //otsikkoPisteet.textContent = "Pisteet";

    let otsikkoMatka = document.createElement('th');
    let linkkiMatka = document.createElement('a');
    linkkiMatka.setAttribute('href', '#tupa3');
    linkkiMatka.onclick = () => luoTulosTaulukkoTaso3(data, sortMatka);
    linkkiMatka.textContent = "Matka";
    otsikkoMatka.append(linkkiMatka);

    let otsikkoAika = document.createElement('th');
    let linkkiAika = document.createElement('a');
    linkkiAika.setAttribute('href', '#tupa3');
    linkkiAika.onclick = () => luoTulosTaulukkoTaso3(data, sortAika);
    linkkiAika.textContent = "Aika";
    otsikkoAika.append(linkkiAika);

    otsikkoRivi.append(otsikkoSarja);
    otsikkoRivi.append(otsikkoJoukkue);
    otsikkoRivi.append(otsikkoPisteet);
    otsikkoRivi.append(otsikkoMatka);
    otsikkoRivi.append(otsikkoAika);

    let sarjaJaJoukkue = [];

    for (let kilpailu of data) {
        let kilpailuRastit = new Map();
        let sarjat = kilpailu.sarjat.sort((a,b) => a.nimi.localeCompare(b.nimi));
        for (let rasti of kilpailu.rastit) {
            kilpailuRastit.set(rasti.id.toString(), {"koodi": rasti.koodi,
                                                     "lat": rasti.lat,
                                                     "lon": rasti.lon});
        }
        for (let sarja of sarjat) {
            let joukkueet = sarja.joukkueet.sort((a,b) => a.nimi.localeCompare(b.nimi));
            for (let joukkue of joukkueet) {
                kaikkiRastit = kilpailuRastit;
                let palautettava = {
                    sarja: sarja.nimi,
                    joukkue: joukkue.nimi,
                    jasenet: [],
                    rastit: [],
                    pisteet: 0,
                    kilpailunRastit: kilpailuRastit,
                    id: joukkue.id
                }
                for (let jasen of joukkue.jasenet) {
                    palautettava.jasenet.push(jasen);
                }
                palautettava.rastit = joukkue.rastit.filter (rasti => parseInt(rasti.rasti) > 0);
                let uusiTaulukko = [];
                let lookupObject = {};
                
                for (let i in palautettava.rastit) { 
                    if (lookupObject[palautettava.rastit[i]['rasti']] === undefined) { 
                        uusiTaulukko.push(palautettava.rastit[i]); 
                    } 
                    lookupObject[palautettava.rastit[i]['rasti']] = palautettava.rastit[i]; }
        
                palautettava.rastit = uusiTaulukko;
                sarjaJaJoukkue.push(palautettava);
            }
        }
    }

    // sijoitetaan taulukkoon caption + otsikko + sisältö
    taulukko.append(caption);
    taulukko.append(otsikkoRivi);

    // lasketaan joukkueiden pisteet
    for (let joukkue of sarjaJaJoukkue) {
        laskeJoukkueenPisteet(joukkue);
    }

    // Järjestetään joukkueet
    sarjaJaJoukkue.sort(sort)
    
    for (let joukkue of sarjaJaJoukkue) {
        taulukko.append(luoRiviTaso3(joukkue));
    }
    
    paikka.append(taulukko);
}

// Alla sort-funktiot
function sortSarja(a, b) {
    if (a.sarja === b.sarja) {
        if (a.pisteet < b.pisteet) return 1;
        if (a.pisteet > b.pisteet) return -1;
        return 0;
    }
    else return a.sarja.localeCompare(b.sarja)
}

function sortJoukkue(a, b) {
    if (a.joukkue === b.joukkue) {
        if (a.pisteet > b.pisteet) return 1;
        if (a.pisteet < b.pisteet) return -1;
        if (a.pisteet === b.pisteet) return b.sarja.localeCompare(a.sarja);
        return 0;
    }
    else return b.joukkue.localeCompare(a.joukkue);
}

function sortPisteet(a, b) {
    if (a.pisteet === b.pisteet) {
        if (a.joukkue < b.joukkue) return 1;
        if (a.joukkue > b.joukkue) return -1;
        if (a.joukkue === b.joukkue) {
            if (a.sarja < b.sarja) return 1;
            if (a.sarja > b.sarja) return -1;
            if (a.sarja === b.sarja) return 0;
        }
    }
    else return a.pisteet < b.pisteet;
}

function sortMatka(a, b) {
    if (a.pituus === b.pituus) {
        if (a.pisteet < b.pisteet) return 1;
        if (a.pisteet > b.pisteet) return -1;
        return 0;
    }
    else return a.pituus < b.pituus;
}

function sortAika(a, b) {
    if (a.kulutettuAika === b.kulutettuAika ) return 0;
    // nollat vikaks
    else if (a.kulutettuAika === 0) {
        return 1;
    }
    else if (b.kulutettuAika === 0) {
        return -1;
    }
    return a.kulutettuAika < b.kulutettuAika ? -1 : 1;
}



// Luo jokaiselle joukkueelle rivin taulukkoon. TASO3 mukaiset
function luoRiviTaso3(ijoukkue) {
    let rivi = document.createElement('tr');

    // Rivin ensimmäinen alkio
    let tdSarja = document.createElement('td');
    tdSarja.textContent = ijoukkue.sarja;
    rivi.append(tdSarja);

    // Rivin toinen alkio    
    let tdJoukkue = document.createElement('td');
    let riviJoukkue = document.createElement('tr');
    // tähän pitäisi saada linkki
    let linkkiJoukkue = document.createElement('a');
    linkkiJoukkue.setAttribute('href', '#formJoukkue');
    linkkiJoukkue.onclick = () => naytaJoukkue(ijoukkue);
    linkkiJoukkue.textContent = ijoukkue.joukkue;
    riviJoukkue.append(linkkiJoukkue);
    tdJoukkue.append(riviJoukkue);

    let trJasenet = document.createElement('tr');
    trJasenet.textContent = ijoukkue.jasenet.join(", ");
   
    tdJoukkue.append(trJasenet);
    rivi.append(tdJoukkue);

    // Rivin kolmas alkio (pisteet)
    let tdPisteet = document.createElement('td');
    tdPisteet.textContent = ijoukkue.pisteet;
    rivi.append(tdPisteet);

    let tdMatka = document.createElement('td');
    tdMatka.textContent = ijoukkue.pituus.toFixed(0) + "km";
    rivi.append(tdMatka);

    let tdAika = document.createElement('td');
    tdAika.textContent = msToTime(ijoukkue.kulutettuAika);
    rivi.append(tdAika);
   
    return rivi;
}

// Lasketaan joukkueen pisteet
function laskeJoukkueenPisteet(joukkue) {
    joukkue.pituus = 0;
    joukkue.kulutettuAika = 0;
    let lahto = false;
    let loppu = false;

    let lahtoaika;
    let loppuaika;

    let pituus = 0;
    let edellinenPaikka = [];

    if (joukkue.rastit.length > 0) {
        for (var i in joukkue.rastit) {
        if (joukkue.kilpailunRastit.has(joukkue.rastit[i].rasti.toString())) {
                let loydetty = joukkue.kilpailunRastit.get(joukkue.rastit[i].rasti.toString());
                if (loydetty.koodi === "LAHTO") {lahto = true; edellinenPaikka = [loydetty.lat, loydetty.lon]; lahtoaika = new Date(joukkue.rastit[i].aika)}
                if (loydetty.koodi === "MAALI" && lahto === true) {
                    loppu = true;
                    pituus += getDistanceFromLatLonInKm(edellinenPaikka[0],edellinenPaikka[1],loydetty.lat,loydetty.lon);
                    loppuaika = new Date(joukkue.rastit[i].aika);
                    joukkue.kulutettuAika = laskeAika(lahtoaika,loppuaika);
                }
                
                // 
                if ((!isNaN(parseInt(loydetty.koodi)) && (lahto === true) && (loppu === false))) {
                    joukkue.pisteet += laskeRastinPisteet(loydetty.koodi);
                    if (edellinenPaikka.length >= 2) {
                        pituus += getDistanceFromLatLonInKm(edellinenPaikka[0],edellinenPaikka[1],loydetty.lat,loydetty.lon);
                        edellinenPaikka = [loydetty.lat, loydetty.lon]; 
                        }
            }             
        }
    }
        if (parseInt(joukkue.rastit[i].rasti) === parseInt(joukkue.rastit[joukkue.rastit.length - 1].rasti)) {
            if (loppu === false) joukkue.pisteet = 0;
            lahto = false;
            loppu = false;
            if (typeof pituus != "undefined") joukkue.pituus = pituus;
            else joukkue.pituus = 0;
            pituus = 0;
            edellinenPaikka = [];
        }
    }
    return joukkue.pisteet;    
}

//Pieni aliohjelma laiskuuttani
function laskeAika(alku,loppu) {
    return loppu - alku;
}

// Tää on kaivettu internetistä.
function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes + ":" + seconds;
}

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

/* Source: Tommi Lahtonen
 * Palauttaa rastin pistemäärän koodin ensimmäisen merkin perusteella.
 * Jos ensimmäinen merkki on numero, palautetaan se. Muutoin pistemäärä on 0.
 * @param koodi string rastin koodi
 */
function laskeRastinPisteet(koodi) {
    let alku = parseInt(koodi.toString().charAt(0), 10);
    if (Number.isInteger(alku)) {
        return alku;
    } 
    return 0;
}

// Luodaan 3.tason mukainen form.
function luoFormTaso3() {
    let paikka = document.getElementById('formJoukkue');
    for (let i = 0; i < paikka.children.length; i++) {
    paikka.removeChild(paikka.children[i]);
    }

    let sisalto = ["Joukkue ", "Jäsen "];

    paikka = document.getElementById('formJoukkue');
    let fieldsetJoukkue = document.createElement('fieldset');
    fieldsetJoukkue.id = "fieldsetJoukkue";
    let legend = document.createElement('legend');
    legend.textContent = "Uusi joukkue";
    fieldsetJoukkue.append(legend);

    let fieldsetJasenet = document.createElement('fieldset');
    fieldsetJasenet.id = "fieldsetJasenet";
    let legendJasenet = document.createElement('legend');
    legendJasenet.textContent = "Jäsenet";
    fieldsetJasenet.append(legendJasenet);

    let pButton = document.createElement('p');
    let buttonLisaa = document.createElement('button');
    buttonLisaa.name = "joukkue";
    buttonLisaa.id = "lisaa";
    buttonLisaa.disabled = true;
    buttonLisaa.textContent = "Lisää joukkue";
    pButton.append(buttonLisaa);

    let pButton2 = document.createElement('p');
    let button2 = document.createElement('button');
    button2.name = "muokkaa";
    button2.id = "muokkaa";
    button2.disabled = true;
    button2.textContent = "Tallenna muutokset";
    pButton2.append(button2);

    let plisaaJasen = document.createElement('p');
    let lisaaJasen = document.createElement('button');
    lisaaJasen.name = 'lisaaJasen';
    lisaaJasen.id = "lisaaJasen";
    lisaaJasen.textContent = "+";
    plisaaJasen.append(lisaaJasen);   

        // asetetaan clickikuuntelija jo tässä      
        buttonLisaa.addEventListener("click", klikkikasittelija);
        function klikkikasittelija(e) {
        e.preventDefault(); 
        lisaaJoukkue();
        }
    
        
        button2.addEventListener("click", klikkikasittelija2);
        function klikkikasittelija2(e) {
        e.preventDefault();
        muokkaaJoukkue(); 
        }
    
        
        lisaaJasen.addEventListener("click", klikkikasittelija3);
        function klikkikasittelija3(e) {
        e.preventDefault();
        luoLabel(fieldsetJasenet, sisalto[1] + parseInt(maara) + " ");
        maara++;
        kokeileOnkoInputeissaArvo();
        }

    luoLabel(fieldsetJoukkue, sisalto[0]);

    maara = 1;

    // Miten monta tehdään?
    for (let i = 0; i < 2; i++) {
    luoLabel(fieldsetJasenet, sisalto[1] + parseInt(maara) + " ");
    maara++;
    }
    fieldsetJasenet.append(plisaaJasen);
    fieldsetJoukkue.append(fieldsetJasenet);
    fieldsetJoukkue.append(pButton);
    fieldsetJoukkue.append(pButton2);
    paikka.append(fieldsetJoukkue);
}

// Aliohjelma, joka testaa onko halutuissa inputeissa arvo (varmistetaan että nappulaa ei voi painaa)
function kokeileOnkoInputeissaArvo() {
    let inputs = [];
    var inputFields = document.getElementsByTagName("input");

    for (let input of inputFields) {
        if (input.id === "joukkue" || input.id.includes('jäsen')) {
        inputs.push(input);        
        }
    }
    let button = document.getElementById('lisaa');
    let buttonMuokkaa = document.getElementById('muokkaa');

    if (muokkaa === false) {
    buttonMuokkaa.disabled = true;
    button.disabled = false;
    inputs.forEach(input => {
        if (input.value === '' && muokkaa === false) { button.disabled = true; buttonMuokkaa.disabled = true; }
    })
    }

    if (muokkaa === true) {
    buttonMuokkaa.disabled = false;
    button.disabled = true;
    inputs.forEach(input => {
        if (input.value === '' && muokkaa === true) { button.disabled = true;}
    })
    }
}

// Tässä sama rastin inputeille (tämä olisi fiksua tehdä edellisen yhteydessä TODO:)
function kokeileOnkoInputeissaArvoRasti() {
    let inputs = [];
    let inputValues = [];
    var inputFields = document.getElementsByTagName("input");

    for (let input of inputFields) {
        if (input.id.trim() === 'lat' ||input.id.trim() === 'lon' || input.id.trim() === 'koodi') {
        inputs.push(input);     
        inputValues.push(input.value);   
        }
    }

    let button = document.getElementById('lisaaRasti');

   if (inputValues.includes('')) button.disabled = true;
   else {
       button.disabled = false;
   }
}

// Aliohjelma labelin luomista varten
function luoLabel(paikka, teksti) {
    let p = document.createElement('p');
    p.id = teksti.trim() + "Form";

        let label = document.createElement('label');
        label.textContent = teksti;
        
        let input = document.createElement('input');
        input.type = "text";
        input.value = "";
        input.id = teksti.trim().toLowerCase();
        input.required = true;

        input.addEventListener("input", kokeileOnkoInputeissaArvo);

        p.append(label);
        p.append(input);
        paikka.insertBefore(p, paikka.lastChild);
}

// Näytetään joukkueen tiedot formissa
function naytaJoukkue(joukkue) {
    luoFormTaso3();
    muokkaa = true;
    muokattavaJoukkue = joukkue;
    let buttonMuokkaa = document.getElementById('muokkaa');
    buttonMuokkaa.disabled = false;

    // Monta paikkaa jäsenille formissa
    let jasenPaikkojenMaara = document.getElementById("fieldsetJasenet").children.length - 2;
    
    while (joukkue.jasenet.length < jasenPaikkojenMaara ) {
        let children = document.getElementById("fieldsetJasenet").children;
        document.getElementById("fieldsetJasenet").removeChild(children[1]);
        maara--;
        jasenPaikkojenMaara--;
    }

    while (joukkue.jasenet.length > jasenPaikkojenMaara) {
        luoLabel(fieldsetJasenet, "Jäsen " + parseInt(jasenPaikkojenMaara + 1) + " ");
        jasenPaikkojenMaara += 1;
    }

    for (let i = 0; i < joukkue.jasenet.length; i++) {
        let str = "jäsen " + (i + 1).toString();
        document.getElementById(str).value = joukkue.jasenet[i];
    }

    document.getElementById('joukkue').value = joukkue.joukkue;
    maara = jasenPaikkojenMaara + 1;

    // Jos joukkueella rasteja, näytetään ne
    if (joukkue.rastit.length > 0) {

    // RASTIT   
    let labelRastit = document.createElement('label');
    labelRastit.textContent = "Rastit "
    labelRastit.id = 'labelRastit';
    labelRastit.hidden = true;

    let selectRasti = document.createElement('select');
    selectRasti.id = 'selectRasti';
    for (let rasti of joukkue.rastit) {        
        let loydetty = joukkue.kilpailunRastit.get(rasti.rasti.toString());
        let option = document.createElement('option');
        option.textContent = loydetty.koodi;
        option.id = rasti.rasti;
        option.className = rasti.aika;
        option.onselect = naytaRasti;
        if (rasti === joukkue.rastit[0]) option.selected = true;
        selectRasti.append(option);
    }
    selectRasti.addEventListener('change', function (e) {
        naytaRasti();
      });
    
    labelRastit.append(selectRasti);

    let elementEnnen = document.getElementById('JoukkueForm');

    elementEnnen.parentNode.insertBefore(labelRastit, elementEnnen.nextSibling);

    luoFormRasti();
    naytaRasti();
    }
}

// Näytetään rasti formissa
function naytaRasti() {

    let lat = document.getElementById('latMuokkaa');
    let lon = document.getElementById('lonMuokkaa');
    let koodi = document.getElementById('koodiMuokkaa');
    let aika = document.getElementById('aikaMuokkaa');

    let paikka = document.getElementById('selectRasti');
    let numero = document.getElementById('selectRasti').selectedIndex;
    muokattavaRasti = numero;
    let lapset = paikka.children;

    if (lapset.length > 0) {
    let labelRastit = document.getElementById('labelRastit');
    labelRastit.hidden = false;
    muokkaaRasti = true;
    document.getElementById('muokkaaRasti').disabled = false;

    let loydetty = kaikkiRastit.get(lapset[numero].id.toString())
    lat.value = loydetty.lat;
    lon.value = loydetty.lon;
    koodi.value = loydetty.koodi;
    aika.value = lapset[numero].className;

    // Luodaan ajalle näyttö
        let p = document.createElement('p');

        let label = document.createElement('label');
        label.textContent = "Aika";
        
        let input = document.createElement('input');
        input.type = "text";
        input.value = "";
        input.id = "aika";
        input.required = true;
        input.addEventListener("input", kokeileOnkoInputeissaArvoRasti);

        p.append(label);
        p.append(input);

        let fieldset = document.getElementById('koodi')
        fieldset.append(p);

        
    }
}

    // Rastin poista varten oleva aliohjelma
function poistaRasti() {
    let paikka = document.getElementById('selectRasti');
    let numero = document.getElementById('selectRasti').selectedIndex;
    let lapset = paikka.children;

        // etsitään datasta joukkue, ja vaihdetaan muokattava sen tilalle.
        for (let kilpailu of data) {
            for (let sarja of kilpailu.sarjat) {
                if (sarja.nimi === muokattavaJoukkue.sarja) {
                    for (let joukkue of sarja.joukkueet) {
                        if (joukkue.id === muokattavaJoukkue.id) {
                              for (let i = 0; i < joukkue.rastit.length; i++) {
                                  if (joukkue.rastit[i].rasti.toString() === lapset[numero].id.toString()) {
                                      joukkue.rastit.splice(i,1);
                                  }

                              }
                        }
                    }
                }
            }
        }   
    tulostaRastit(data);
    luoTulosTaulukkoTaso3(data);
    luoFormTaso3();
    muokkaaRasti = false;
    muokkaa = false;
   }

   // Rastin muokkaamista varten oleva aliohjelma
function muokkaaRastia() {
    let lat = document.getElementById('latMuokkaa');
    let lon = document.getElementById('lonMuokkaa');
    let koodi = document.getElementById('koodiMuokkaa');
    let aika = document.getElementById('aikaMuokkaa');

    let paikka = document.getElementById('selectRasti');
    let numero = document.getElementById('selectRasti').selectedIndex;
    let lapset = paikka.children;

    // hae täällä id:llä oikea rasti ja muokkaa.
    let muokattava = kaikkiRastit.get(lapset[numero].id.toString());
    muokattava.koodi = koodi.value;
    muokattava.lat = lat.value;
    muokattava.lon = lon.value;
    muokattava.aika = aika.value;
        // etsitään datasta joukkue, ja vaihdetaan muokattava sen tilalle.
        for (let kilpailu of data) {
            for (let sarja of kilpailu.sarjat) {
                if (sarja.nimi === muokattavaJoukkue.sarja) {
                    for (let joukkue of sarja.joukkueet) {
                        if (joukkue.id === muokattavaJoukkue.id) {
                              for (let rasti of joukkue.rastit) {
                                  if (rasti.rasti.toString() === lapset[numero].id.toString()) {
                                      rasti.aika = aika.value;
                                  }

                              }
                        }
                    }
                }
            }
        }   
    tulostaRastit(data);
    luoTulosTaulukkoTaso3(data);
    luoFormTaso3();
    muokkaaRasti = false;
    muokkaa = false;
   }

// Joukkueen lisäämistä varten oleva aliohjelma   
function lisaaJoukkue() {
    let jasenet = [];
    let paikat = document.getElementById("fieldsetJasenet").children;

    // Paikkoja 2 vähemmän kuin noita lapsia
    for (let i = 0; i < paikat.length - 2; i++) {
        let str = "jäsen " + (i + 1).toString();
        if (document.getElementById(str).value != "") jasenet.push(document.getElementById(str).value);
    }

    let joukkue = {
        nimi: document.getElementById('joukkue').value,
        jasenet: jasenet,
        id: idNro,
        rastit: [],
        leimaustapa: ["GPS"]
    }
    
    if (jasenet.length >= 2) {
        localData[2].sarjat[0].joukkueet.push(joukkue);
        idNro++;
        luoTulosTaulukkoTaso3(data);
    }
    luoFormTaso3();
}

// Joukkueen muokkaaminen
function muokkaaJoukkue() {
    let jasenet = [];
    let paikat = document.getElementById("fieldsetJasenet").children;


    if (paikat.length === 2) {
        let str = "jäsen " + (1).toString();
        if (document.getElementById(str).value != "") jasenet.push(document.getElementById(str).value);
    }
    // Paikkoja 2 vähemmän kuin noita lapsia
    for (let i = 0; i < paikat.length - 2; i++) {
        let str = "jäsen " + (i + 1).toString();
        if (document.getElementById(str).value != "") jasenet.push(document.getElementById(str).value);
    }
        muokattavaJoukkue.joukkue = document.getElementById('joukkue').value,
        muokattavaJoukkue.jasenet = jasenet;

        // etsitään datasta joukkue, ja vaihdetaan muokattava sen tilalle.
        for (let kilpailu of data) {
            for (let sarja of kilpailu.sarjat) {
                if (sarja.nimi === muokattavaJoukkue.sarja) {
                    for (let joukkue of sarja.joukkueet) {
                        if (joukkue.id === muokattavaJoukkue.id) {
                                joukkue.nimi = muokattavaJoukkue.joukkue;
                                joukkue.jasenet = muokattavaJoukkue.jasenet;
                        }
                    }
                }
            }
        }
        luoTulosTaulukkoTaso3(data);
        luoFormTaso3();
        muokkaa = false;
        let buttonMuokkaa = document.getElementById('muokkaa');
        buttonMuokkaa.disabled = true;
}

function main() {
    luoTulosTaulukko(data);
    luoForm();

    // TASO 3

    luoTulosTaulukkoTaso3(data);
    luoFormTaso3();

    // TASO 5 samalla
}
window.onload = main;