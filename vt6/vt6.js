// Pitää kirjaa tietorakenteesta statessa.
class App extends React.Component {
    constructor(props) {
      super(props);
      this.submitHandler = this.submitHandler.bind(this);
      this.naytaJoukkue = this.naytaJoukkue.bind(this);
        // Käytetään samaa tietorakennetta kuin viikkotehtävässä 1, mutta vain jäärogainingin joukkueita
        // tehdään tämän komponentin tilaan kopio jäärogainingin tiedoista. Tee tehtävässä vaaditut lisäykset ja muutokset tämän komponentin tilaan
        // Tämä on tehtävä näin, että saadaan oikeasti aikaan kopio eikä vain viittausta samaan tietorakenteeseen. Objekteja ja taulukoita ei voida kopioida vain sijoitusoperaattorilla
        // päivitettäessä React-komponentin tilaa on aina vanha tila kopioitava uudeksi tällä tavalla
        // kts. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
        let kilpailu = new Object();
        kilpailu.nimi = data[2].nimi;
        kilpailu.loppuaika = data[2].loppuaika;
        kilpailu.alkuaika = data[2].alkuaika;
        kilpailu.kesto = data[2].kesto;
        kilpailu.leimaustapa = Array.from( data[2].leimaustapa );
        kilpailu.rastit = Array.from( data[2].rastit );

        function kopioi_joukkue(j) {
            if (j === undefined){
              return;
            } 
                    let uusij = {};
                    uusij.nimi = j.nimi;
                    uusij.id = j.id;

                    uusij["jasenet"] = Array.from( j["jasenet"] );
                    uusij["rastit"] = Array.from( j["rastit"] );
                    uusij["leimaustapa"] = Array.from( j["leimaustapa"] );
                    return uusij;
        }
        function kopioi_sarja(s) {
                    let uusis = {};
                    uusis.nimi = s.nimi;
                    uusis.alkuaika = s.alkuaika;
                    uusis.loppuaika = s.loppuaika;
                    uusis.kesto = s.kesto;
                    uusis.joukkueet = Array.from( s.joukkueet, kopioi_joukkue);
                    return uusis;
        }

        kilpailu.sarjat = Array.from( data[2].sarjat, kopioi_sarja);

        // tuhotaan vielä alkuperäisestä tietorakenteesta rastit ja joukkueet niin
        // varmistuuu, että kopiointi on onnistunut
        for(let i in data[2].rastit) {
            delete data[2].rastit[i];
        }              
        for(let sarja of data[2].sarjat) {
            for(let i in sarja.joukkueet) {
                delete sarja.joukkueet[i];
            }       
       }
        this.state = {"kilpailu": kilpailu};
        console.log(kilpailu);
        return;
    }

    // Handleri joukkueenlisäys-formin submitille
    // formState tuo LisääJoukkue-komponentin tilan takaisin.
    submitHandler(formState) {
      let kilpailuKopio = new Object();
      // Jos tulee uusi joukkue ( tarkistetaan onko tällä jo id ) varmaan voisi tehdä järkevämminkin.
      if (!formState.id) {  
      kilpailuKopio.nimi = this.state.kilpailu.nimi;
      kilpailuKopio.loppuaika = this.state.kilpailu.loppuaika;
      kilpailuKopio.alkuaika = this.state.kilpailu.alkuaika;
      kilpailuKopio.kesto = this.state.kilpailu.kesto;
      kilpailuKopio.leimaustapa = Array.from( this.state.kilpailu.leimaustapa );
      kilpailuKopio.rastit = Array.from( this.state.kilpailu.rastit );
      kilpailuKopio.sarjat = Array.from( this.state.kilpailu.sarjat);

      let jasenet = formState.jasenet;
    
      let kirjatutJasenet = jasenet.filter((jasen) => {
         return jasen.trim() != "";
      });

      kirjatutJasenet = kirjatutJasenet.map(jasen => {
        return jasen.trim();
      });

      // Funktio hakemaan tietorakenteesta seuraavan sallitun id-arvon.
      let seuraavaSallittuId = function(kilpailu) {
        let idt = [];
        kilpailu.sarjat.forEach(sarja => {
         sarja.joukkueet.forEach(joukkue => {
           idt.push(+joukkue.id);
         });
        });
        return Math.max(... idt) + 1;
      }

      let joukkue = new Object();
      joukkue.nimi = formState.nimi;
      joukkue.jasenet = kirjatutJasenet;
      joukkue.leimaustapa = formState.leimaustapa;
      joukkue.rastit = [];
      joukkue.id = seuraavaSallittuId(kilpailuKopio);

      kilpailuKopio.sarjat.forEach(sarja => {
        if (sarja.nimi === formState.sarja) {      
          sarja.joukkueet.push(joukkue);
        }
      });
      }
      // Jos muokataan valmista joukkuetta.
      else {
        kilpailuKopio.nimi = this.state.kilpailu.nimi;
        kilpailuKopio.loppuaika = this.state.kilpailu.loppuaika;
        kilpailuKopio.alkuaika = this.state.kilpailu.alkuaika;
        kilpailuKopio.kesto = this.state.kilpailu.kesto;
        kilpailuKopio.leimaustapa = Array.from( this.state.kilpailu.leimaustapa );
        kilpailuKopio.rastit = Array.from( this.state.kilpailu.rastit );
        kilpailuKopio.sarjat = Array.from( this.state.kilpailu.sarjat);

        let jasenet = formState.jasenet;
    
        let kirjatutJasenet = jasenet.filter((jasen) => {
           return jasen.trim() != "";
        });
  
        kirjatutJasenet = kirjatutJasenet.map(jasen => {
          return jasen.trim();
        });

        let joukkue = new Object();
        joukkue.nimi = formState.nimi;
        joukkue.jasenet = kirjatutJasenet;
        joukkue.leimaustapa = formState.leimaustapa;
        joukkue.rastit = [];
        joukkue.id = formState.id;

        // Poistetaan vanha joukkue tietorakenteesta.
        // En keksinyt muutakaan keinoa, sillä sarja voi muuttua lennossa.
        kilpailuKopio.sarjat.forEach(sarja => {         
          sarja.joukkueet = sarja.joukkueet.filter(jouk => {
            return jouk.id !== joukkue.id;          
          });
        });

        // Lisätään muokattu joukkue rakenteeseen.
        kilpailuKopio.sarjat.forEach(sarja => {
          if (sarja.nimi == formState.sarja) {
            sarja.joukkueet.push(joukkue);
          }
        });
      }
      this.setState({"kilpailu": kilpailuKopio});
     }

     // Tämänkin voisi järkevämmin hoitaa handeri-statemuutos -yhdistelmällä.
     // Nyt App-komponentti pitää kirjaa siitä, jos joku joukkue pitää näyttää formissa.
     naytaJoukkue(joukkue) {
        this.setState({
          naytettavaJoukkue: joukkue
        });
     }

    render () {
      let joukkueet = [];
      this.state.kilpailu.sarjat.forEach(sarja => {
        sarja.joukkueet.forEach(joukkue => {
          let kopio = {};
          kopio.nimi = joukkue.nimi;
          kopio.id = joukkue.id;
          kopio.leimaustapa = joukkue.leimaustapa;
          kopio.rastit = joukkue.rastit;
          kopio.jasenet = joukkue.jasenet;
          kopio.sarja = sarja.nimi;
          joukkueet.push(kopio);
        });
      });

      let joukkueetProps = Array.from(joukkueet);
      // Sortataan joukkueet nimien mukaan järjestykseen
      joukkueetProps.sort((joukkueA, joukkueB) => {
       return (joukkueA.nimi.toLowerCase() < joukkueB.nimi.toLowerCase()) ? -1 : 1;
      });

      let joukkue; 
      if (this.state.naytettavaJoukkue != undefined) {
        joukkue = {};
        joukkue.nimi = this.state.naytettavaJoukkue.nimi;
        joukkue.id = this.state.naytettavaJoukkue.id;
        joukkue.jasenet = this.state.naytettavaJoukkue.jasenet;
        joukkue.leimaustapa = this.state.naytettavaJoukkue.leimaustapa;
        joukkue.rastit = this.state.naytettavaJoukkue.rastit;
        joukkue.sarja = this.state.naytettavaJoukkue.sarja;
      }
      return <div className="osiot">
        <LisaaJoukkue submitHandler={this.submitHandler} joukkue={joukkue}/>
        <ListaaJoukkueet joukkueet={joukkueetProps} naytaJoukkue={this.naytaJoukkue}/>
        </div>;
    }
}

// Komponentti joka hallitsee formia joukkueen lisäämiseen/muokkaamiseen.
class LisaaJoukkue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nimi: "",
      leimaustapa: [],
      sarja: "radio1",
      jasenet: ["",""]
      }
    
      this.handleChange = this.handleChange.bind(this);
      this.handleInsert =this.handleInsert.bind(this);
      this.checkboxes = []; 
  }

  // Tämä on vähän kysymysmerkki, jos propsit muuttuu, päivitetään myös state.
  // En tiedä mikä on reactin kanssa se järkevin tapa hoitaa tämä.
  componentDidUpdate(prevProps) {
    if (this.props.joukkue !== prevProps.joukkue && !this.state.lisatty) {
      let sarjat = new Map();
      sarjat.set('2h', 'radio1');
      sarjat.set('4h', 'radio2');
      sarjat.set('8h', 'radio3');

      // Lisäillään lisää inputteja jäsenille. Taas vois tehdä fiksummin.
      let jasenet = Array.from(this.props.joukkue.jasenet);
      if (jasenet[jasenet.length -1] != "") {
        jasenet.push("");
      }
      
      this.setState({
        nimi: this.props.joukkue.nimi,
        leimaustapa: this.props.joukkue.leimaustapa,
        sarja: sarjat.get(this.props.joukkue.sarja),
        jasenet: jasenet,
        id: this.props.joukkue.id
      });
    }

    if (this.state.lisatty) {
      let newstate = {
        nimi: "",
        leimaustapa: [],
        sarja: "radio1",
        jasenet: ["",""],
        lisatty: false
        }
        this.setState(newstate);
    }  
  }

  // Handleri formin käyttöä varten, päivittää formissa tapahtuvat muutokset ruudulle.
  handleChange(e) {
        // dynaamisuuden takia pitää kikkailla erillisen objektin kautta:
        let obj = e.target;
        let arvo = obj.value;
        let kentta = obj.name;
        let type = obj.type;
        let checked = obj.checked;
        let validity = obj.validity;
        let newstate = {}; 

        if ( validity.badInput || validity.patternMismatch || validity.rangeOverflow || validity.rangeUnderflow || validity.tooLong || validity.tooShort || validity.typeMismatch || validity.valueMissing  ) {
            obj.setCustomValidity("Kentän arvo on virheellinen");
            // Jäsenille eri systeemi (alempana), koska en osannut.
            if (kentta != "nimi") {
              let paikka = kentta[kentta.length - 1];
              newstate = this.state;
              newstate.jasenet[paikka-1] = arvo;
              this.setState(newstate);
              return;
            }

            newstate[kentta] = arvo;
            this.setState(newstate);
            return;
        }
        else {
            obj.setCustomValidity("");   
        }

        // Tekstikentät
        if ( type == "text" && arvo != "" && kentta == "nimi") {
          if (arvo.trim() == "") {
            obj.setCustomValidity("Kentän arvo on virheellinen");
            newstate[kentta] = arvo;
            this.setState(newstate);
            return;
          }
        }

        // Checkboxit
        if( type === "checkbox") {
          newstate["leimaustapa"] = this.state["leimaustapa"];
            if (checked) {
              newstate["leimaustapa"].push(arvo);           
            }
            else {
              let paikka = newstate["leimaustapa"].findIndex(alkio => {
                return alkio == arvo;
              })
              newstate["leimaustapa"].splice(paikka, 1);        
              this.setState(newstate);
                return;
            }
        }

        // Tänne jäsenten lisäyksen checki
        if (type === "text" && kentta !== "nimi") {
          newstate = this.state;  

          let paikka = kentta[kentta.length - 1];
          newstate.jasenet[paikka-1] = arvo;          
          if (newstate.jasenet.filter(jasen => {
            return jasen.trim() != "";
          }).length == newstate.jasenet.length) {
            newstate.jasenet.push("");
          }
          this.setState(newstate);
          return;
        }

       // kaikki muut kuin checkboxit menevät helposti
       if (type === 'radio') {
          newstate['sarja'] = arvo;
          this.setState(newstate);
          return;
       }

       newstate[kentta] = arvo;    
       this.setState(newstate);
  }

  // Handleri formsubmitille. Päivittää myös formin tilan tyhjäksi.
  handleInsert(e) {
    e.preventDefault();

    let newstate = {
      nimi: "",
      leimaustapa: [],
      sarja: "radio1",
      jasenet: ["",""]
      }
    let oldstate = {};
    oldstate = this.state;  
    let virhe = 0;

    if (oldstate.leimaustapa.length == 0) {
      virhe++;
    }

        if (virhe === 0) {
          if (this.state.sarja === 'radio1') {
            oldstate.sarja = "2h";
          }

          if (this.state.sarja === 'radio2') {
            oldstate.sarja = "4h";
          }

          if (this.state.sarja === 'radio3') {
            oldstate.sarja = "8h";
          }
          this.props.submitHandler(oldstate);

          if (oldstate.id) {
            newstate.lisatty = true;
            this.setState(newstate);
          }
          else {
            newstate.lisatty = false;
            this.setState(newstate);           
          }         
        }
        else {
          // Virheet on hoidettu kyllä jo formin validationilla. Tänne ei pitäisi joutua.
          console.log('VIRHE!');
        }
  }

  render() {
    function mapJasenet(jasenet, handleChange) {
      let divit = jasenet.map((jasen,i) => {
        if (i < 2) {
         return <div className="container" key={i}>
        <div className="otsikko"><label htmlFor={"jasen" + (i+1)}>Jäsen {i+1} </label></div>
        <div className="sisalto"><input onChange={handleChange} type="text" name={"jasen" + (i+1)} id={"jasen" + (i+1)} value={jasenet[i]} required="required" pattern="^(?!\s*$).+"/>
        </div>
        </div>
        }
        else {
          return <div className="container" key={i}>
          <div className="otsikko"><label htmlFor={"jasen" + (i+1)}>Jäsen {i+1} </label></div>
          <div className="sisalto"><input onChange={handleChange} type="text" name={"jasen" + (i+1)} id={"jasen" + (i+1)} value={jasenet[i]}/>
          </div>
          </div>
        }
        
      });

      return divit;
    }

    return(
      <div id="osio1">
        <h1>Lisää joukkue</h1>
        <form method="post" onSubmit={this.handleInsert} id="joukkueen_tiedot">
          <fieldset>
            <legend>Joukkueen tiedot</legend>
            <div className="container">
            <div className="otsikko"><label htmlFor="nimi">Nimi </label></div>
            <div className="sisalto"><input onChange={this.handleChange} type="text" id="nimi" name="nimi" value={this.state.nimi} required="required" />
            </div>
            </div>
            <div className="container">
            <div className="otsikko"><label>Leimaustapa </label>
            <span id="varoitus">{this.state.leimaustapa.length == 0 ? "(valitse vähintään yksi)" : ""}</span></div>
            <div className="sisalto">
            <label>GPS <input onChange={this.handleChange} type="checkbox" value="GPS" checked={this.state.leimaustapa.includes("GPS")} name="checkbox" /></label>
            <label>NFC <input onChange={this.handleChange} type="checkbox" value="NFC" checked={this.state.leimaustapa.includes("NFC")} name="checkbox" /></label>
            <label>QR <input onChange={this.handleChange} type="checkbox" value="QR" checked={this.state.leimaustapa.includes("QR")} name="checkbox" /></label>
            <label>Lomake <input onChange={this.handleChange} type="checkbox" value="Lomake" checked={this.state.leimaustapa.includes("Lomake")} name="checkbox" /></label>      
            </div>
            </div>
            <div className="container">
            <div className="otsikko"><label>Sarja </label></div>
            <div className="sisalto">
              <label>2h <input onChange={this.handleChange} type="radio" value="radio1" 
              checked={this.state.sarja === "radio1"} name="radio" /></label>
              <label>4h <input onChange={this.handleChange} type="radio" value="radio2" 
              checked={this.state.sarja === "radio2"} name="radio" /></label>
              <label>8h <input onChange={this.handleChange} type="radio" value="radio3" 
              checked={this.state.sarja === "radio3"} name="radio" /></label>
              </div>
              </div>
          </fieldset>
          <fieldset>
            <legend>Jäsenet</legend>
            {mapJasenet(this.state.jasenet, this.handleChange)}            
          </fieldset>
          <p><button type="submit">Tallenna</button></p>
        </form>
        </div>
    )
  }
}

// Komponentti listaa annetut joukkueet ruudulle.
// Propseina tulee lista joukkueita.
class ListaaJoukkueet extends React.Component {
  constructor(props) {
    super(props);   
  }

  render() {
    let joukkueet = this.props.joukkueet.map((jouk,i) => {
      return <li key={i}><Joukkue joukkue={jouk} clickHandler={this.props.naytaJoukkue}/></li>
  });
    return(
      <div id="osio2">
        <h1>Joukkueet</h1>
          <ul id="joukkueLista">{joukkueet}</ul>
      </div>
    )   
  }
}

// Komponentti, joka pitää huolen yksittäisen joukkueen näyttämisestä.
// Ottaa vastaan propsina joukkue-objektin
class Joukkue extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  // Klickihandleri joukkueen nimelle.
  handleClick(e) {
    e.preventDefault();
    this.props.clickHandler(this.props.joukkue);
  }

  render() {
    let leimaustavat = this.props.joukkue.leimaustapa.map((leimaustapa, i) => {
      if (i === this.props.joukkue.leimaustapa.length - 1) {
        return <span key={i}>{leimaustapa}</span>
      }
      else {
        return <span key={i}>{leimaustapa},</span>
      }
    });
    return(
      <div>
        <a href="#osio1" onClick={this.handleClick}>{this.props.joukkue.nimi}</a>
        <p>{this.props.joukkue.sarja} ({leimaustavat})</p>
        <Jasenet jasenet={this.props.joukkue.jasenet} />
      </div>
    );
  }
}

// Komponentti joka listaa joukkueen jäsenet.
// Ottaa propsina jonkin joukkueen jäsenet ja listaa ne.
function Jasenet(props) {
  return(
    <ul>
      {props.jasenet.map((jasen,i) => {
        return <li key={i}>{jasen}</li>
      })}
    </ul>
  )
}

ReactDOM.render(
    <App />,
  document.getElementById('root')
);
