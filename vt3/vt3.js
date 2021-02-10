"use strict";  // pidä tämä ensimmäisenä rivinä

console.log(data);
let leimaustavat = [];
let id = 1;

// Palauttaa listankaikkien joukueiden id:stä
function haeJoukkueidenId(data) {
    let idLista = [];
    let joukkueet = haeJoukkueet(data);
    for (let joukkue of joukkueet) {
        if (joukkue.id) {
            idLista.push(joukkue.id);
        }
    }
    return idLista;
}

// Palauttaa datasta kilpailut
function haeKilpailut(data) {
    let kilpailut = [];
    for (let kilpailu of data) {
        kilpailut.push(kilpailu);
    }
    return kilpailut;
}

// Palauttaa datasta sarjat
function haeSarjat(data) {
    let sarjat = [];
    for (let kilpailu of data) {
        for (let sarja of kilpailu.sarjat) {
            if (!sarjat.includes(sarja.nimi)) {
                sarjat.push(sarja.nimi);
            }
        }
    }
    return sarjat;
}

// Palauttaa datasta joukkueet
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

// Palauttaa joukkueen jäsenet
function haeJasenet(joukkue) {
    let jasenet = [];
    for (let jasen of joukkue.jasenet) {
        jasenet.push(jasen);
    }
    return jasenet;
}

// Palauttaa datasta kaikki leimaustavat
function haeLeimaustavat(data) {
    let leimaustavat = [];
    for (let kilpailu of data) {
        for (let leimaustapa of kilpailu.leimaustapa) {
            if (!leimaustavat.includes(leimaustapa)) {
                leimaustavat.push(leimaustapa);
            }
        }
    }
    return leimaustavat;
}

// Näytetään joukkueet listana
function luoJoukkueLista(data) {
    let paikka = document.getElementById('joukkueetLista');

    while (paikka.firstChild) {
        paikka.removeChild(paikka.firstChild);
    }

    let h1 = document.createElement('h1');
    h1.textContent = "Joukkueet";

    let ul = document.createElement('ul');

    let joukkueet = haeJoukkueet(data).sort((a,b) => {
        return a.nimi.localeCompare(b.nimi);
    });

    // Listataan joukkueet
    for (let joukkue of joukkueet) {
        let joukkue_li = document.createElement('li');
        joukkue_li.textContent = joukkue.nimi;

        // Listataan jäsenet
        for (let jasen of joukkue.jasenet.sort()) {
            let ul = document.createElement('ul');
            let jasen_li = document.createElement('li');
            jasen_li.textContent = jasen;
            ul.appendChild(jasen_li);
            joukkue_li.appendChild(ul);
        }
        ul.appendChild(joukkue_li);
    }
    paikka.appendChild(h1);
    paikka.appendChild(ul);

    
}

// Tarkistaa leimaustavan
function checkLeimaustapa() {
    let checkboxit = document.querySelectorAll('input[name="leimaustapa"]');
    for (let checkbox of checkboxit) {
        if (leimaustavat.length > 0) {
            checkbox.setCustomValidity("");
        }
        else {
            checkbox.setCustomValidity("Valitse vähintään yksi leimaustapa");
        }
    }
}

// Tarkistaa nimen
function checkNimi() {
    let nimi = document.getElementById('nimi');
    let joukkueet = haeJoukkueet(data);
    let nimet = [];
    
    for (let joukkue of joukkueet) {
        nimet.push(joukkue.nimi);
    }

    if (!nimet.includes(nimi.value.trim()) && nimi.value.trim() != "") {
        nimi.setCustomValidity("");
    }
    else {
        if (nimi.value.trim() === "") {
            nimi.setCustomValidity("Tyhjä nimi ei käy!");
            
        }
        else {
            nimi.setCustomValidity("Tuollainen Joukkue löytyy jo!");
            
        }
    }
    nimi.reportValidity();
}

// Asetetaan validiteetit
function setValidity() {
    // Tämä piti varmistaa ennen submittia. Source: https://stackoverflow.com/questions/7357192/how-to-clear-remove-or-reset-html5-form-validation-state-after-setcustomvalid
    let nimi = document.getElementById('nimi');
    nimi.addEventListener('input', function(e) {
        checkNimi();
    });

    let form = document.getElementById('joukkueen_tiedot');

    form.addEventListener("submit", function (e) {
         checkLeimaustapa();
         checkNimi();       
        // ilmoitetaan mahdollisista virheistä
         e.target.reportValidity();
         e.preventDefault(); // estetään lomakkeen lähettäminen palvelimelle
         // tulostetaan kunkin kentän nimi, arvo ja validius

         // Jos kaikki ok, tehdään tämä.
         if (e.target.checkValidity()) {
            let paikka = document.getElementById('lisatty');
            paikka.textContent = "Joukkue " + document.getElementById('nimi').value + " on lisätty" ;
            
            // Lisätään joukkue dataan
            joukkueenData();

            form.reset();
            leimaustavat = [];
            let radiobuttonit = document.querySelectorAll('input[type="radio"]');            
            radiobuttonit[0].checked = true;
        }
    });
    // Asetetaan checkboxeille eventListener
    let checkboxit = document.querySelectorAll('input[name="leimaustapa"]');
  
    checkboxit.forEach(checkbox => {
        checkbox.addEventListener("change", function(e) {
            if (e.target.checked) {
                leimaustavat.push(e.target.value);
            }
            else {
                leimaustavat = leimaustavat.filter(alkio => alkio != e.target.value);
            }
            checkLeimaustapa();
        });
    });
}

// Otetaan koppi asetetun joukkueen tiedoista
function joukkueenData() {
    let joukkue = {
        nimi: "",
        jasenet: [],
        id: -1,
        rastit: [],
        leimaustapa: []
    };

    joukkue.nimi = document.getElementById('nimi').value.trim();

    joukkue.leimaustapa = leimaustavat;

    let sarja;
    let sarjat = document.getElementsByName('sarja');
    for (let alkio of sarjat) {
        if (alkio.checked) {
            sarja = alkio.value;
        }
    }

    joukkue.id = palautaSeuraavaValidiId();

    joukkue.jasenet = ["Foo Bar", "Bar Foo"];

    lisaaJoukkue(joukkue, sarja);

}

// Lisää joukkueen jäärogaining-kisaan
function lisaaJoukkue(joukkue, tuotuSarja) {
    let kilpailu = data[2];

    for (let sarja of kilpailu.sarjat) {
        if (sarja.nimi.toString() === tuotuSarja.toString()) {
            sarja.joukkueet.push(joukkue);
        }
    }
    // Listataan joukkueet uusiksi
    luoJoukkueLista(data);

}

// Tarkistaa onko annettava id valid
function palautaSeuraavaValidiId() {
    let idt = haeJoukkueidenId(data);
    
    while (idt.includes(id)) {
        id++;
    }
    return id;
}

// Luodaan leimaustapa-form
function luoFormLeimaustapa() {
    let leimaustavat = haeLeimaustavat(data);
    let paikka = document.getElementById('leimaustapa');

    for (let leimaustapa of leimaustavat) {
        let div = document.createElement('div');
        div.className = 'checkbox';

        let input = document.createElement('input');
        input.type = 'checkbox';
        input.id = leimaustapa.toLowerCase();
        input.name = 'leimaustapa';
        input.value = leimaustapa.toLowerCase();

        let label = document.createElement('label');
        label.htmlFor = leimaustapa.toLowerCase();
        label.textContent = leimaustapa;

        div.appendChild(input);
        div.appendChild(label);

        paikka.appendChild(div);

        
        }
}

// Luodaan sarja-form
function luoFormSarja() {
    let sarjat = haeSarjat(data);

    let paikka = document.getElementById('sarja');

    for (let sarja of sarjat) {
        let div = document.createElement('div');
        div.className = 'checkbox';

        let input = document.createElement('input');
        input.type = 'radio';
        input.id = sarja.toLowerCase();
        input.name = 'sarja';
        input.value = sarja.toLowerCase();
        if (sarja === sarjat[0]) {
            input.checked = true;
        }

        let label = document.createElement('label');
        label.htmlFor = sarja.toLowerCase();
        label.textContent = sarja;

        div.appendChild(input);
        div.appendChild(label);
        paikka.appendChild(div);
        }
}


window.onload = main;

function main() {
    luoJoukkueLista(data);
    luoFormLeimaustapa();
    luoFormSarja();
    setValidity();
}
