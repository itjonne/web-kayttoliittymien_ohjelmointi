"use strict";

// Palkkien animaatioviive
const delay = 0.2;
// Pidetään kirjaa pöllöistä
let pariton = false;

// Pääohjelma
window.onload = function() {
    luoPalkit();
    luoPupu();
    luoPollo();

    let button = document.getElementById('lisaa');
    button.addEventListener('click', lisaaPollo);    
};

// Aliohjelma, joka antaa pöllölle animaation
function luoPollo() {
    let pollo = document.querySelector("img");
    pollo.style.animationName = "nelio";
}

// Lisää pöllön ruudulle
function lisaaPollo(e) {
    e.preventDefault();

    let pollo = document.querySelector("img");
    let klooni = pollo.cloneNode(true);

    if (pariton === false) {

    klooni.style.animationName = "nelioVasen";
    pariton = true;
    document.body.appendChild(klooni);
    }
    else {
        klooni.style.animationName = "nelio";
        document.body.appendChild(klooni);
        pariton = false;
    }
}

// Luo keltaiset liikkuvat palkit taustalle
function luoPalkit() {
    let svg = document.querySelector("svg");

    for (let i = 0; i < 10; i++) {
        let s = svg.children[1];
        let palkki = s.cloneNode(true);
        
        svg.appendChild(palkki);
        palkki.style.animationDelay= i * delay + "s";
    }
}

// Luodaan pupu jaettuna kahdelle eri canvakselle.
function luoPupu() {
    let canvas1 = document.getElementById('canvas1');
    let ctx1 = canvas1.getContext('2d');

    let canvas2 = document.getElementById('canvas2');
    let ctx2 = canvas2.getContext('2d');
    
    let image = new Image(); 
    image.src = 'bunny.png';

    image.onload = function() {
        for (let i = 1; i < 3; i++) {
           if ( i == 1) {
              ctx1.drawImage(image, 0, 0);
           }
           else {
              ctx2.drawImage(image, 0, 600/2, 383, 600, 0, 0, 383, 600);
           }           
        }      
    };
}
