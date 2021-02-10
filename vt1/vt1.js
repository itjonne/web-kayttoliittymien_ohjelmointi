"use strict";
let localData = data;
let lisattavaJoukkue = { 
    "nimi": "Mallijoukkue",
    "jasenet": [
      "Tommi Lahtonen",
      "Matti Meikäläinen"
    ],
    "id": 99999
}

lisaaJoukkue(localData,"Jäärogaining",lisattavaJoukkue,"8h");
tulostaKokonaisluvullaAlkavatRastit(localData);
poistaJoukkue(localData, "Jäärogaining", "Vara 1", "8h" )
// poistaJoukkue(localData, "Jäärogaining", "Vara 1123", "8h" ) Tän voi laittaa testinä
poistaJoukkue(localData, "Jäärogaining", "Vara 2", "8h" )
poistaJoukkue(localData, "Jäärogaining", "Vapaat", "4h" )

tulostaPisteet(localData)

function tulostaJoukkueet(data) {
    let kilpailut = [];
    let joukkueet = [];
    let joukkueidenNimet = [];
     
    for (let kilpailu of data) {
        kilpailut.push(kilpailu.nimi);
        for (let sarja of kilpailu.sarjat) {
            for (let joukkue of sarja.joukkueet) {
                joukkueet.push(joukkue);
            }
        }
    }

    if (joukkueet.length != 0) {
        joukkueet.forEach(joukkue => {
            joukkueidenNimet.push(joukkue.nimi);
        });
    }
    else console.log("nyt meni jotain pieleen")

    if (joukkueidenNimet.length != 0) {
        joukkueidenNimet.sort().forEach(nimi => {
            console.log(nimi);
        })
    }
    else console.log("ei löytynyt joukkueita.")     
}

function lisaaJoukkue(data, kilpailu, joukkue, hsarja) {
    let kilpailut = [];
    let kilpailujenNimet = [];

    data.forEach(kilpailu => {
        kilpailut.push(kilpailu);
    })

    kilpailut.forEach(kilpailu => {
        kilpailujenNimet.push(kilpailu.nimi);
    })

    if (kilpailujenNimet.includes(kilpailu)) {
        let haettuKilpailu = {};
        

        kilpailut.forEach(kisa => {
            if (kisa.nimi === kilpailu) haettuKilpailu = kisa;
        })
        
        haettuKilpailu.sarjat.forEach(sarja => {
            if (sarja.nimi === hsarja) {
                sarja.joukkueet.push(joukkue);
                //console.log('Joukkue ' + joukkue.nimi + " lisätty sarjaan: " + hsarja)
            }
        })
        
        
    }
    else console.log('ei löydy')
    tulostaJoukkueet(data)
}

function tulostaKokonaisluvullaAlkavatRastit(data) {
    let rastit = [];
    let rastiStr = "";

    data.forEach(kilpailu => {
        kilpailu.rastit.forEach(rasti => {
            rastit.push(rasti);
        })
    })
    rastit.forEach(rasti => {

        if (!isNaN(rasti.koodi.charAt(0))) {
            rastiStr += (rasti.koodi + ";");
        }
    })    
    console.log("\n" + rastiStr)
}

function poistaJoukkue(data, kilpailu, hjoukkue, hsarja) {  
    for (var i in data) {
        if (data[i]["nimi"] === kilpailu) {
            for (var j in data[i].sarjat) {
                if (data[i].sarjat[j]["nimi"] === hsarja) {
                    for (var k in data[i].sarjat[j].joukkueet){
                    if (data[i].sarjat[j].joukkueet[k]["nimi"] === hjoukkue) {
                        data[i].sarjat[j].joukkueet.splice(k,1);
                        return;                       
                    }
                    }
                }
            }
        }
    }
    console.log('Ei löytynyt tollasta joukkuetta: ' + hjoukkue)
}

function tulostaPisteet(data) {
    let rastit = [];
    let joukkueet = [];
    let joukkueidenRastit = {
        joukkueet: []
    }

    // Lisätään aputietorakenteisiin joukkueet ja rastit
    data.forEach(kilpailu => {
        kilpailu.rastit.forEach(rasti => {
            rastit.push(rasti);
        } )
        for (let sarja of kilpailu.sarjat) {
            for (let joukkue of sarja.joukkueet) {
                joukkueet.push(joukkue);
            }
        }
    })


    // Luoraan tietorakenne joka pitää kirjaa joukkueen käymistä rasteista.
    joukkueet.forEach(joukkue => {
        let jouk = {
            nimi: "",
            rastit: [],
            pisteet: 0
        }
        jouk.nimi = joukkue.nimi;
        if (joukkue.rastit) {
        joukkue.rastit.forEach(rasti => {
           jouk.rastit.push(rasti);
        })
        }
        joukkueidenRastit.joukkueet.push(jouk);      
    })
    
    // Poistetaan "turhat" ja duplicaatit
    joukkueidenRastit.joukkueet.forEach(joukkue => {
        joukkue.rastit = joukkue.rastit.filter( rasti => parseInt(rasti.rasti) > 0)
        let uusiTaulukko = [];
        let lookupObject = {};

        for (let i in joukkue.rastit) { 
            if (lookupObject[joukkue.rastit[i]['rasti']] === undefined) { 
                uusiTaulukko.push(joukkue.rastit[i]); 
            } 
            lookupObject[joukkue.rastit[i]['rasti']] = joukkue.rastit[i]; }

        joukkue.rastit = uusiTaulukko;

    })

    // Lasketaan joukkueiden pisteet
    laskePisteet(joukkueidenRastit, rastit);
    laskeMatka(joukkueidenRastit, rastit);

console.log("\n");
console.log("----------");
console.log("\n");
console.log('Taso 3:');
console.log("\n");
console.log("----------");
console.log("\n");

// Sortataan pisteiden mukaan
joukkueidenRastit.joukkueet.sort((a,b) => {
    if (b.pisteet - a.pisteet === 0) {
        if (a.nimi < b.nimi) //sort string ascending
            return -1 
        if (a.nimi > b.nimi)
            return 1
        return 0 //default return value (no sorting)
    }
    else return b.pisteet - a.pisteet;
})

// Printataan tiedot
joukkueidenRastit.joukkueet.forEach(joukkue => {
    if (joukkue.kulutettuAika) {
    console.log(joukkue.nimi + " (" + joukkue.pisteet + " p)" + "\n");
    }
    else console.log(joukkue.nimi + " (" + joukkue.pisteet + " p)" + "\n");
})

console.log("\n");
console.log("----------");
console.log("\n");
console.log('Taso 5:');
console.log("\n");
console.log("----------");
console.log("\n");


// Printataan tiedot
joukkueidenRastit.joukkueet.forEach(joukkue => {
    if (joukkue.kulutettuAika) {
    console.log(joukkue.nimi + " (" + joukkue.pisteet + " p), " + joukkue.pituus.toFixed(0) + " km, " + msToTime(joukkue.kulutettuAika) + "\n");
    }
    else console.log(joukkue.nimi + " (" + joukkue.pisteet + " p), " + joukkue.pituus.toFixed(0) + " km, " + "00:00:00" + "\n");
})
}

// Laskee joukkueiden pisteet rastien perusteella.
function laskePisteet(joukkueidenRastit, rastit) {
    let lahto = false;
    let loppu = false;

    for (let joukkue of joukkueidenRastit.joukkueet) {
        for (let rasti of joukkue.rastit) {
            for (let rastiId of rastit) {
                if (parseInt(rasti.rasti) === parseInt(rastiId.id)) {
                    if (rastiId.koodi === "LAHTO") lahto = true;
                    if (rastiId.koodi === "MAALI" && lahto === true) loppu = true;
                    if (!isNaN(rastiId.koodi.charAt(0)) && lahto == true && loppu == false) {
                        joukkue.pisteet += parseInt(rastiId.koodi.charAt(0));
                }             
            }
        }
        if (parseInt(rasti.rasti) === parseInt(joukkue.rastit[joukkue.rastit.length - 1]["rasti"])) {
            lahto = false;
            loppu = false;
        }
    }
}
}

// Laskee joukkueiden pisteet rastien perusteella.
function laskeMatka(joukkueidenRastit, rastit) {
    let lahto = false;
    let loppu = false;

    let lahtoaika;
    let loppuaika;

    let pituus = 0;
    let edellinenPaikka = [];

    for (let joukkue of joukkueidenRastit.joukkueet) {
        if (joukkue.rastit.length === 0) joukkue.pituus = 0;
        for (let rasti of joukkue.rastit) {
            for (let rastiId of rastit) {
                if (parseInt(rasti.rasti) === parseInt(rastiId.id)) {
                    if (rastiId.koodi === "LAHTO") {lahto = true; edellinenPaikka = [rastiId.lat, rastiId.lon]; lahtoaika = new Date(rasti.aika)}
                    if (rastiId.koodi === "MAALI" && lahto === true) {
                            loppu = true;
                            pituus += getDistanceFromLatLonInKm(edellinenPaikka[0],edellinenPaikka[1],rastiId.lat,rastiId.lon);
                            loppuaika = new Date(rasti.aika);
                            joukkue.kulutettuAika = laskeAika(lahtoaika,loppuaika);
                        }   
                    if (!isNaN(rastiId.koodi.charAt(0)) && lahto == true && loppu == false) {
                        if (edellinenPaikka.length >= 2) {
                        pituus += getDistanceFromLatLonInKm(edellinenPaikka[0],edellinenPaikka[1],rastiId.lat,rastiId.lon);
                        edellinenPaikka = [rastiId.lat, rastiId.lon]; 
                        }
                }             
            }
        }
        if (parseInt(rasti.rasti) === parseInt(joukkue.rastit[joukkue.rastit.length - 1]["rasti"]))  {
            lahto = false;
            loppu = false;
            if (typeof pituus != "undefined") joukkue.pituus = pituus;
            else joukkue.pituus = 0;
            pituus = 0;
            edellinenPaikka = [];
        }
    }
}
}

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

