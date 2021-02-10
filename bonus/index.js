class Peli extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pelilauta: [],
            vuoro: "M",
            valkoiset: 2,
            mustat: 2
        }
        this.handleLomake = this.handleLomake.bind(this);
        this.changeState = this.changeState.bind(this);
        this.aloitaPeli = this.aloitaPeli.bind(this);
        this.naytaSallitutSiirrot = this.naytaSallitutSiirrot.bind(this);
        this.laskeSallitutSiirrot = this.laskeSallitutSiirrot.bind(this);
        this.onkoSallittu = this.onkoSallittu.bind(this);
        this.onkoSeuraavaSallittu = this.onkoSeuraavaSallittu.bind(this);
        this.handleSeuraavaSiirto = this.handleSeuraavaSiirto.bind(this);
        this.kaannaRuutu = this.kaannaRuutu.bind(this);
        this.kaannaRivi = this.kaannaRivi.bind(this);
    }

    handleLomake(lomake) {
        let newState = {};
        newState.pelilauta = [];
        for (let i = 0; i < lomake.laudanKoko; i++) {
            let rivi = Array(lomake.laudanKoko).fill(0);
            newState.pelilauta.push(rivi);
        }
        newState.pelaaja1 = lomake.pelaaja1;
        newState.pelaaja2 = lomake.pelaaja2;

        // Asettaa tilan ja alustaa pelin alkuasentoon.
        this.setState(newState, this.aloitaPeli);
    }

    changeState(state) {
        this.setState(state);
    }

    aloitaPeli() {
        let peliTila = {};
        peliTila.pelilauta = this.state.pelilauta;
        let koko = peliTila.pelilauta.length;
        
        // Alustetaan pelitila oikeaksi
        peliTila.pelilauta[(koko/2) - 1][(koko/2 - 1)] = "V";
        peliTila.pelilauta[(koko/2) - 1][(koko/2)    ] = "M";
        peliTila.pelilauta[(koko/2)    ][(koko/2) -1 ] = "M";
        peliTila.pelilauta[(koko/2)    ][(koko/2)    ] = "V";

        // Näyttää sallitut siirrot
        this.setState(peliTila, this.naytaSallitutSiirrot);
    }

    naytaSallitutSiirrot() {
        let peliTila = {};
        peliTila = this.state;

        let sallitut = this.laskeSallitutSiirrot(peliTila.vuoro, peliTila.pelilauta);
        let maara = 0;

        for (let rivi = 0; rivi < peliTila.pelilauta.length; rivi++) {
            for (let sarake = 0; sarake < peliTila.pelilauta.length; sarake++) {
                if (sallitut[rivi][sarake] == "S") {
                    peliTila.pelilauta[rivi][sarake] = "S";
                    maara++;
                }
            }
        }
        if (maara == 0) {
            peliTila.vuoro == "M" ? peliTila.vuoro = "V" : peliTila.vuoro = "M";
            if (peliTila.virheet >= 1) {
                console.log("PELI OHI!");
                peliTila.vuoro = "";
                this.setState({peliTila});
            }
            else {
                console.log('ei sallittuja siirtoja');
                peliTila.virheet = 1;
                this.setState(peliTila, this.naytaSallitutSiirrot);  
            }
            
            
        }
        else {
            peliTila.virheet = 0;
            this.setState(peliTila);   
        }    
    }

    laskeSallitutSiirrot(vuoro, pelilauta) {
        let sallitut = [];
        
        // Alustetaan sallittu apupelilauta tyhjäksi
        for (let i = 0; i < this.state.pelilauta.length; i++) {
            let rivi = Array(this.state.pelilauta.length).fill(0);
            sallitut.push(rivi);
        }

        for (let rivi = 0; rivi < sallitut.length; rivi++) {
            for (let sarake = 0; sarake < sallitut.length; sarake++) {
                // Jos pelilaudalla on tyhjää.
                if (pelilauta[rivi][sarake] === 0) {
                    let pohjoinen = this.onkoSallittu(vuoro, 0, -1, rivi, sarake, pelilauta);
                    let koillinen = this.onkoSallittu(vuoro, 1, -1, rivi, sarake, pelilauta);
                    let ita = this.onkoSallittu(vuoro, 1, 0, rivi, sarake, pelilauta);
                    let kaakko = this.onkoSallittu(vuoro, 1, 1, rivi, sarake, pelilauta);
                    let etela = this.onkoSallittu(vuoro, 0, 1, rivi, sarake, pelilauta);
                    let lounas = this.onkoSallittu(vuoro, -1, 1, rivi, sarake, pelilauta);
                    let lansi = this.onkoSallittu(vuoro, -1, 0, rivi, sarake, pelilauta);
                    let luode = this.onkoSallittu(vuoro, -1, -1, rivi, sarake, pelilauta);

                    if (pohjoinen || koillinen || ita || kaakko || etela || lounas || lansi || luode) {
                        sallitut[rivi][sarake] = "S";
                    }
                }
            }
        }
        return sallitut;
    }


    // Sallittu jos drivi ja dsarake muutoksessa oleva paikka on hallussa vastakkaisella pelaajalla
    // joka on nyt vuorossa.
    onkoSallittu(vuoro, dRivi, dSarake, rivi, sarake, pelilauta) {
        let vastustaja;

        if (vuoro == 'M') {
            vastustaja = 'V';
        }
        else if (vuoro == 'V') {
            vastustaja = 'M';
        }
        else {
            console.log('NYT ON JOKU RIKKI!=!=!?!?' , vuoro);
            return false;
        }

        if (rivi + dRivi < 0 || rivi + dRivi >= this.state.pelilauta.length) {
            return false;
        }
        if (sarake + dSarake < 0 || sarake + dSarake >= this.state.pelilauta.length) {
            return false;
        }
        if (pelilauta[rivi+dRivi][sarake+dSarake] != vastustaja) {
            return false;
        }
        if (rivi + dRivi + dRivi < 0 || rivi + dRivi + dRivi >= this.state.pelilauta.length) {
            return false;
        }
        if (sarake + dSarake + dSarake < 0 || sarake + dSarake + dSarake >= this.state.pelilauta.length) {
            return false;
        }
        // Pitää käydä kurkkaamassa se tolla viivalla seuraava.
        return this.onkoSeuraavaSallittu(vuoro,dRivi,dSarake, rivi+dRivi+dRivi, sarake+dSarake+dSarake, pelilauta); 
    }

    onkoSeuraavaSallittu(vuoro,dRivi,dSarake, rivi, sarake, pelilauta) {
        if (pelilauta[rivi][sarake] == vuoro) {
            return true;
        }
        if (rivi + dRivi < 0 || rivi + dRivi >= this.state.pelilauta.length) {
            return false;
        }
        if (sarake + dSarake < 0 || sarake + dSarake >= this.state.pelilauta.length) {
            return false;
        }
        return this.onkoSeuraavaSallittu(vuoro, dRivi, dSarake, rivi+dRivi, sarake+dSarake, pelilauta);
    }

    handleSeuraavaSiirto(paikka,arvo) {
        console.log(paikka,arvo);
        let pelitila = {};
        pelitila.pelilauta = this.state.pelilauta;
        pelitila.pelilauta[paikka[0]][paikka[1]] = arvo;
        pelitila.mustat = 0;
        pelitila.valkoiset = 0;
       
        this.kaannaRuutu(this.state.vuoro, paikka[0], paikka[1], pelitila.pelilauta);

        for (let rivi = 0; rivi < pelitila.pelilauta.length; rivi++) {
            for (let sarake = 0; sarake < pelitila.pelilauta.length; sarake++) {
                if (pelitila.pelilauta[rivi][sarake] == "M") {
                    pelitila.mustat += 1;
                }
                if (pelitila.pelilauta[rivi][sarake] == "V") {
                    pelitila.valkoiset += 1;
                }     

                if (pelitila.pelilauta[rivi][sarake] == "S") {
                    pelitila.pelilauta[rivi][sarake] = 0;
                }
            }
        }

        this.setState({pelilauta: pelitila.pelilauta,
                       vuoro: this.state.vuoro == "M" ? "V" : "M",
                       mustat: pelitila.mustat,
                       valkoiset: pelitila.valkoiset}, this.naytaSallitutSiirrot);

    }

    kaannaRivi(vuoro, dRivi, dSarake, rivi, sarake, pelilauta) {
        if (rivi + dRivi < 0 || rivi + dRivi >= pelilauta.length) {
            return false;
        }
        if (sarake + dSarake < 0 || sarake + dSarake >= pelilauta.length) {
            return false;
        }
        if (pelilauta[rivi+dRivi][sarake+dSarake] === 0) {
            return false;
        }
        if (pelilauta[rivi+dRivi][sarake+dSarake] === vuoro) {
            return true;
        }
        else {
            if (this.kaannaRivi(vuoro,dRivi,dSarake, rivi+dRivi, sarake+dSarake, pelilauta)) {
                let peliTila = {};
                peliTila.pelilauta = pelilauta;
                peliTila.pelilauta[rivi+dRivi][sarake+dSarake] = vuoro;
                this.setState(peliTila);
                return true;
            }
            else {
                return false;
            }
        }
        
    }

    kaannaRuutu(vuoro, rivi, sarake, pelilauta) {
        this.kaannaRivi(vuoro, 0, -1, rivi, sarake, pelilauta);
        this.kaannaRivi(vuoro, 1, -1, rivi, sarake, pelilauta);
        this.kaannaRivi(vuoro, 1, 0, rivi, sarake, pelilauta);
        this.kaannaRivi(vuoro, 1, 1, rivi, sarake, pelilauta);
        this.kaannaRivi(vuoro, 0, 1, rivi, sarake, pelilauta);
        this.kaannaRivi(vuoro, -1, 1, rivi, sarake, pelilauta);
        this.kaannaRivi(vuoro, -1, 0, rivi, sarake, pelilauta);
        this.kaannaRivi(vuoro, -1, -1, rivi, sarake, pelilauta);
    }

    render() {
       if (this.state.vuoro == "") {
           return (
            <div>
            <h1>Othello</h1>             
            <Pelilauta pelilauta={this.state.pelilauta} handleSeuraavaSiirto={this.handleSeuraavaSiirto} vuoro={this.state.vuoro}/>
            <h2>VOITTAJA ON : {this.state.mustat > this.state.valkoiset ? this.state.pelaaja1 : this.state.pelaaja2}</h2>
            <h2>Kiitos pelistä</h2>
            <div id="pisteet">
            <h2>Pelaaja 1: {this.state.pelaaja1}</h2>
            <h2>Pisteet: {this.state.mustat}</h2>
            <h2>============</h2>
            <h2>Pelaaja 2: {this.state.pelaaja2}</h2>
            <h2>Pisteet: {this.state.valkoiset}</h2> 
            </div>             
            {/* <Lomake onSubmit={this.handleLomake}/> */}
        </div>
           )
       }
       
       if (!this.state.pelaaja1) {
           return(
            <div>
            <h1>Othello</h1>  
            <Lomake onSubmit={this.handleLomake}/>
            </div>
           )
       }

       else {
       return(
           <div>
               <h1>Othello</h1>
               <h2>{this.state.vuoro == "M" ? "Mustan vuoro:" : "Valkoisen vuoro:"}</h2>
               <p>Valitse nappula pöydän oikealta puolelta</p>             
               <Pelilauta pelilauta={this.state.pelilauta} handleSeuraavaSiirto={this.handleSeuraavaSiirto} vuoro={this.state.vuoro}/>              
                <div id="pisteet">
                <h2>Pelaaja 1: {this.state.pelaaja1}</h2>
                <h2>Pisteet: {this.state.mustat}</h2>
                <h2>============</h2>
                <h2>Pelaaja 2: {this.state.pelaaja2}</h2>
                <h2>Pisteet: {this.state.valkoiset}</h2>   
                </div>            
               {/* <Lomake onSubmit={this.handleLomake}/> */}
           </div>
       )
       }
   }
}

class Pelilauta extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let rivit = [];

        for (let i = 0; i < this.props.pelilauta.length; i++) {          
            let rivi = [];
            for (let j = 0; j < this.props.pelilauta.length; j++) {
                if (this.props.pelilauta[i][j] == "S") {
                    rivi.push(<RuutuDroppable key={(i,j)} arvo={this.props.pelilauta[i][j]} paikka={[i,j]} handleSeuraavaSiirto={this.props.handleSeuraavaSiirto}/>);
                }
                else {
                    rivi.push(<Ruutu key={(i,j)} arvo={this.props.pelilauta[i][j]} paikka={[i,j]}/>);
                }
            }
            rivit.push(rivi);
        }

        let ruudut = rivit.map((rivi,i) => {
            return <div key={i} className="pelilauta-rivi">
                {rivi}
            </div>
        })

        return(
            <div>
            <div className="container">           
            <div className="pelilauta">  
            {ruudut}
            </div>
            <div id="nappulat">
                <div id="eka">
                <p>Pelivuorossa:</p>
                </div>
                <div id="toka">
                <RuutuDraggable arvo="M" draggable="true" vuoro={this.props.vuoro}/>
                <RuutuDraggable arvo="V" draggable="true" vuoro={this.props.vuoro}/>
                </div>
               
            </div>
            </div>
            </div>
        )     
    }
}

class Ruutu extends React.Component {
    constructor(props) {
        super(props);
        this.handleDragStart = this.handleDragStart.bind(this);
    }

    handleDragStart(e, arvo) {
        e.preventDefault();
        e.dataTransfer.setData('arvo', arvo);
    }

    render() {
        let kuva = "";
        if (this.props.arvo == "M") {
            kuva = <img draggable="false" height="40" width="40" src="icons8-filled-circle-50.png"></img>;
        }
        if (this.props.arvo == "V") {
            kuva = <img draggable="false" height="40" width="40" src="icons8-circle-50.png"></img>
        }        

        let luokka = "";
        if (this.props.draggable == "true") {
            luokka = "pelilauta-ruutu-siirrettava";
        }
        else {
            luokka = "pelilauta-ruutu";
        }
        if (this.props.arvo == "S") {
            luokka = "pelilauta-ruutu-sallittu";
        }
        

        return(
            <div className={luokka} 
                 draggable="false"
                 onDragStart = {(e) => this.handleDragStart(e, this.props.arvo)}>{kuva}</div>
        )
    }
}

class RuutuDraggable extends React.Component {
    constructor(props) {
        super(props);
        this.handleDragStart = this.handleDragStart.bind(this);
    }

    handleDragStart(e) {
        e.dataTransfer.setData('arvo', this.props.arvo);       
    }

    render() {
        let kuva = "";
        if (this.props.arvo == "M") {
            kuva = <img draggable={this.props.vuoro == this.props.arvo} height="40" width="40" src="icons8-filled-circle-50.png"></img>;
        }
        if (this.props.arvo == "V") {
            kuva = <img draggable={this.props.vuoro == this.props.arvo} height="40" width="40" src="icons8-circle-50.png"></img>
        }        

        let luokka = "pelilauta-ruutu-siirrettava";
        if (this.props.arvo == this.props.vuoro) {
            luokka += "-valittu";
        }
        
        return(
            <div className={luokka} 
                 draggable={this.props.vuoro == this.props.arvo}
                 onDragStart={this.handleDragStart}>{kuva}</div>
        )
    }
}

class RuutuDroppable extends React.Component {
    constructor(props) {
        super(props);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleDragEnter = this.handleDragEnter.bind(this);
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDragEnter(e) {
        e.preventDefault();
        //console.log(e.dataTransfer);
        // Tolla voi asettaa efektin halutessaan.
        //e.dataTransfer.dropEffect = props.dropEffect;
    }

    handleDrop(e) {
        e.preventDefault();
        let droppedItem = e.dataTransfer.getData("arvo");
        this.props.handleSeuraavaSiirto(this.props.paikka, droppedItem);
    }

    render() {
        let luokka = "pelilauta-ruutu-sallittu";
          
        return(
            <div className={luokka}                  
                onDragOver={this.handleDragOver}
                onDragEnter={this.handleDragEnter}
                onDrop={this.handleDrop}></div>
        )
    }
}

class Lomake extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pelaaja1: "",
            pelaaja2: "",
            laudanKoko: 4,
            start: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleInsert = this.handleInsert.bind(this);
        this.changeState = this.changeState.bind(this);
    }

    //// Handlerit ////

    handleChange(e) {
        let target = e.target;
        let value = target.value;
        let name = target.name;
        let type = target.type;
        let newState = {};

        if (type == "text") {
            newState[name] = value;
            this.changeState(newState);
        }

        if (type == "range") {
            newState[name] = parseInt(value);
            this.changeState(newState);
        }
    }

    handleInsert(e) {
        e.preventDefault();

        let sendState = {};
        sendState.pelaaja1 = this.state.pelaaja1;
        sendState.pelaaja2 = this.state.pelaaja2;
        sendState.laudanKoko = this.state.laudanKoko;

        let newState = {};
        newState.start = true;
        this.changeState(newState);

        this.props.onSubmit(sendState);
    }

    // Tilan päivitykset //

    changeState(state) {
        this.setState(state);
    }

    render() {
        return(
            <div>
                <h1>Valitse pelaajat & pelilaudan koko</h1>
                <form method="post" onSubmit={this.handleInsert} id="lomake">
                    <fieldset>
                    <legend>Pelaajat</legend>
                    <label>Pelaaja 1: </label><input onChange={this.handleChange} type="text" name="pelaaja1" id="pelaaja1" value={this.state.pelaaja1} required="required"></input>
                    <label>Pelaaja 2: </label><input onChange={this.handleChange} type="text" name="pelaaja2" id="pelaaja2" value={this.state.pelaaja2} required="required"></input>
                    </fieldset>
                    <fieldset>
                        <legend>Laudan koko</legend>
                        <label>{this.state.laudanKoko}x{this.state.laudanKoko}</label><input list="tickmarks" onChange={this.handleChange} type="range" name="laudanKoko" id="laudanKoko" value={this.state.laudanKoko} min="4" max="16" step="2"></input>
                        <datalist id="tickmarks">
                            <option value="4"></option>
                            <option value="6"></option>
                            <option value="8"></option>
                            <option value="10"></option>
                            <option value="12"></option>
                            <option value="14"></option>
                            <option value="16"></option>                   
                        </datalist>
                    </fieldset>
                <p><button type="submit" disabled={this.state.start}>Aloita peli</button></p>    
                </form>
            </div>
            
        )
    }
}

ReactDOM.render(
    <Peli />,
    document.getElementById('root')
  );