import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
//import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { KorisnikService } from '../korisnik.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { Knjiga } from '../models/Knjiga';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-reg-kor',
  templateUrl: './reg-kor.component.html',
  styleUrls: ['./reg-kor.component.css']
})

export class RegKorComponent implements OnInit {
  
  displayedColumns: string[] = ['Naziv knjige', 'Autori'];
  displayedColumns2: string[] = ['Naziv knjige', 'Autori', 'Ocena', 'Komentar'];
  displayedColumns3: string[] = ['Naziv desavanja', 'Status', 'Pocetak', 'Kraj'];

  constructor(private ruter:Router, private servis:KorisnikService) {}

  ngOnInit(): void {
    // dovuci podatke i korisniku iz baze, o onom koji je ulogovan => zapamtiti u LS ko se ulogovao
    this.username = JSON.parse(localStorage.getItem('korisnikUlogovan'));
    console.log("ulogovan kor");
    console.log(this.username);
    this.servis.dohvatiOvogKorisnika(this.username).subscribe(kor => {
      // uvek gledam profil jednog korisnika u jednom trenutku..
      this.korisnik = kor;
      this.datumDate = new Date(this.korisnik[0].datumRodjenja);
      this.datumString = this.datumDate.toLocaleDateString();
    });

    // sada deo sa procitanim knjigama
    this.servis.dohvatiProcitaneKnjige(this.username).subscribe(knjige=>{
      this.procitaneKnjige = knjige;
      if(this.procitaneKnjige.length!=0)
        this.pieChart();
      
      console.log("Chart spremna");
      console.log(this.chartSpremna);
      
      console.log("procitane knjige");
      console.log(knjige);

  
      localStorage.setItem('procitane', JSON.stringify(this.procitaneKnjige));
      // this procitaneKnjige su one koje treba da se prikazu
      // idemo 5 knjiga po strani, 5 - 10 - 15
      // znaci onda ovako:
      this.proc = this.procitaneKnjige.slice(0,2);
      console.log("PROCCC");
      console.log(this.proc);
     
    });

    this.servis.dohvatiTrenutnoSeCitaju(this.username).subscribe(knjige=>{
      console.log("dohvati trenutno se citaju");
      console.log(knjige);
      this.trenutnoSeCitaju = knjige;
      // console.log(this.trenutnoSeCitaju);
      this.trc = this.trenutnoSeCitaju.slice(0,2);
  
    });

    this.servis.dohvatiNaListi(this.username).subscribe(knjige=>{
      this.naListi = knjige;
      // console.log(this.naListi);
      this.lista = this.naListi.slice(0,2);
    });

    // svi komentari ovog korisnika
    this.servis.dohvatiSveKomentare(this.username).subscribe(kom=>{
      this.komentari = kom;
      console.log(this.komentari);
      this.koment = this.komentari.slice(0,2);
    });

    // tip ulogovanog korisnika -> korisnik, moderator ili admin
    this.servis.nadjiTip(this.username).subscribe(tip=> {
      console.log(tip);
      this.tipKorisnika = ""+tip;
      console.log("TIP KORISNIKA");
      console.log(this.tipKorisnika);
    });

    // javna desavanja
    this.servis.dohvatiSvaJavnaDesavanjaUSistemu().subscribe(desavanja=> {  
      this.javnaDesavanja = desavanja;  

      length = this.javnaDesavanja.length;
      for(let i = 0; i<length; i++) {
        this.dateDesavanja[i] = new Date(this.javnaDesavanja[i].pocetak);
        //console.log(this.dateDesavanja);
        this.dateKrajDesavanja[i] = new Date(this.javnaDesavanja[i].kraj);

        this.pocetakDesavanja[i] = this.dateDesavanja[i].toLocaleString();
        this.javnaDesavanja[i].pocetak = this.pocetakDesavanja[i];
        //console.log(this.pocetakDesavanja);
        this.krajDesavanja[i] = this.dateKrajDesavanja[i].toLocaleString();
        this.javnaDesavanja[i].kraj = this.krajDesavanja[i];
      }
    
      console.log(this.javnaDesavanja); 
    });
  }

  
  onPageChange(event) {
    console.log("Page event");
    console.log(event);
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.procitaneKnjige.length) {
      // ako je endIndex veci od duzine celog mog niza sa podacima
      endIndex = this.procitaneKnjige.length
    }
    this.proc = this.procitaneKnjige.slice(startIndex, endIndex);
  }

  onPageChange2(event) {
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.trenutnoSeCitaju.length) {
      // ako je endIndex veci od duzine celog mog niza sa podacima
      endIndex = this.trenutnoSeCitaju.length
    }
    this.trc = this.trenutnoSeCitaju.slice(startIndex, endIndex);
  }

  onPageChange3(event) {
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.naListi.length) {
      // ako je endIndex veci od duzine celog mog niza sa podacima
      endIndex = this.naListi.length
    }
    this.lista = this.naListi.slice(startIndex, endIndex);
  }

  onPageChange4(event) {
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.komentari.length) {
      // ako je endIndex veci od duzine celog mog niza sa podacima
      endIndex = this.komentari.length
    }
    this.koment = this.komentari.slice(startIndex, endIndex);
  }



  pocetakDesavanja: string[]=[];
  dateDesavanja: Date[] = [];
  krajDesavanja: string[] = [];
  dateKrajDesavanja: Date[] = [];
  javnaDesavanja: any = [];

  
  tipKorisnika: string = "";
  korisnik: any = [];
  username: string = "";            // ulogovan korisnik
  datumString: string = "";
  datumDate: Date = null;
  procitaneKnjige: any = [];
  trenutnoSeCitaju: any = [];
  naListi: any = [];
  chartPodaci: any[] = [];
  chartOpcije: any;
  chartLabele: any[] = [];
  komentari: any = [];
  chartSpremna: boolean = false;
  sviZanroviProcitanihKnjiga: string[] = [];
  sviZanrovi: any = [];
  cnt : number[] = [];
  z: any = null;
  ime: string[] = [];
  procenti: any[] = [];
  proc: any = [];
  trc: any = [];
  lista: any = [];
  koment: any = [];

 
  prikazMenija:boolean=false;

  prikaziPadajuciMeni() {
   
    this.prikazMenija=!this.prikazMenija;
    console.log(this.prikazMenija);
  }



  promeniLozinku() {
    this.ruter.navigate(['/promena-lozinke']);
  }

  logOut() {
    this.ruter.navigate(['/login']);
    let datum = Date.now();
    let datumDate = new Date(datum);
    let format = datumDate.toLocaleString();
    this.servis.updateStatusaKorisnika(this.username, format).subscribe(upd => {
      console.log(upd);
    });
  }

  izmeni() {
    this.ruter.navigate(['/izmena']);
  }

  flag: string = "";

  func(knjiga: any){
    // prodjem kroz sve nizove knjiga dok ne nadjem poklapanje id-jeva prosledjene knjige i knjige koja je
    // u nizu, i prosledim tu u nizu, zbog toga sto je uradjen populate zanra
    // Knjige iz komentara su linkovi

    let length1 = this.komentari.length;
    for(let i = 0; i<length1; i++) {
      if(this.komentari[i].idKnjige._id == knjiga.idKnjige._id) {
        // prosledjujem samo this.komentari[i], a ne this.komentari[i].idKnjige, jer u this.komentari[i].idZanra imam
        // nazive zanrova koje treba da ispisem, pa u prikaz-knjige pristupam ili idKnjige ili idZanra u zavisnosti
        // sta mi treba
        this.flag = "ne";

        // sacuvati flag
        localStorage.setItem('flagOdobriti', JSON.stringify(this.flag));
        localStorage.setItem('selektovanaKnjiga', JSON.stringify(this.komentari[i]));
        this.ruter.navigate(['/prikaz-knjige']);
      }
    }
  }
 

  pieChart() {

    console.log("ulazi u pie chart");

    console.log("Sve procitane knjige ovog korisnika");
    console.log(this.procitaneKnjige);

    let length = this.procitaneKnjige.length;
    let s = 0;
    
    for(let i = 0; i<length; i++) {
      let length2 = this.procitaneKnjige[i].idZanra.length;
      for(let j = 0; j<length2; j++) {
        this.sviZanroviProcitanihKnjiga[s] = this.procitaneKnjige[i].idZanra[j].zanr;
        s++;
      }
    }
   
    for(let y = 0; y<this.sviZanroviProcitanihKnjiga.length; y++) {
      console.log(this.sviZanroviProcitanihKnjiga[y]);
    
    }

   
    this.servis.dohvatiSveZanroveUSistemu().subscribe(zanrovi=>{
      
      this.z = zanrovi;
      console.log("zanrovi");
      console.log(this.z);
      for(let p = 0; p<zanrovi.length; p++) {
        this.sviZanrovi[p] = this.z[p].zanr;
      }

      for(let k = 0; k<this.sviZanrovi.length; k++) {
        this.cnt[k]=0;
        this.ime[k]="";
      
        // cnt je velicine svih zanrova, u slucaju da je korisnik citao iz svih zanrova. Ne moze preci taj broj
        // jer za iste zanrove se cnt uvecava
      }
     

      for(let i = 0; i<this.sviZanrovi.length; i++) {
        for(let j = 0; j<this.sviZanroviProcitanihKnjiga.length; j++) {
          if(this.sviZanroviProcitanihKnjiga[j]==this.sviZanrovi[i]){
            this.cnt[i]++;
            this.ime[i] = this.sviZanrovi[i];
          }
        }
      }

      for(let r = 0; r<this.sviZanrovi.length; r++) {
        this.procenti[r] = (this.cnt[r]/this.sviZanroviProcitanihKnjiga.length)*100;
      }
      
      // filtriram nizove od blanko karaktera

      let procenti2 = this.procenti.filter(function (el) {
        return el != "";
      });

      let ime2 = this.ime.filter(function (el) {
        return el != "";
      });

  
      // prikaz procenata na dve decimale
  
      let procenti3 = [];
      for(let q = 0; q<procenti2.length; q++) {
        procenti3[q] = procenti2[q].toFixed(2);
      }
   
      // chart
      this.chartOpcije = {
        responsive: true
      };
      this.chartPodaci = [
        { data: procenti3 }
      ];
      this.chartLabele = ime2;
      this.chartSpremna = true;
      console.log("izlazi iz pie chart");
    });
  }



  dodaj() {
    this.ruter.navigate(['/dodaj-knjigu']);
  }


  // moderator 
  odobri() {
    this.ruter.navigate(['/odobri-knjigu']);
  }

  // admin
  odobriKor() {
    this.ruter.navigate(['/odobri-reg']);
  }

  privilegije() {
    this.ruter.navigate(['/promeni-tip']);
  }

  izmenaInfo() {
    this.ruter.navigate(['/izmeniK']);
  }

  // jedino sto mi izgleda kao logicno je da ne sme da doda neki zanr ako on vec postoji. Tipa ako imam triler,
  // ne moze dodati jos jedan triler..

  dodajOvajZanr: string = "";
  message: string = "";
  
  dodavanjeZanrova() {
    this.message2 = "";
    if(this.dodajOvajZanr) {
      console.log("Dodavanje zanrova");
      console.log(this.dodajOvajZanr);
      console.log("Svi zanrovi u sistemu");
      console.log(this.z);
      let vecPostoji = false;

      if(this.z.length == 0) {
        vecPostoji = false;
      }
      else {
        for(let i = 0; i<this.z.length; i++) {
          if(this.z[i].zanr == this.dodajOvajZanr) {
            vecPostoji = true;
          }
          console.log(this.z[i].zanr);
        }
      }
      if(vecPostoji==true) {
        this.message = "Vec postoji ovaj zanr";
        return;
      }
      this.message="";
      
      this.servis.dodajZanr(this.dodajOvajZanr).subscribe(za=>{
        /*
        Nece ovako
        console.log(za);
        console.log(this.z);
        console.log(this.z.length);

        this.z[this.z.length] = za;
        console.log(this.z);
        */
        this.message="Uspesno unet zanr";
        window.location.reload();
      });
    }
  }

  zanrZaBrisanje: string = "";
  message2: string = "";
  brisi : boolean = false;
  sveKnjige: any = [];
  cntB : number = 0;

  obrisiZanr(){
    this.message = "";
    console.log("Obrisi zanr");

    this.servis.dohvatiSveKnjige().subscribe(knj=>{
      console.log(knj);
      this.sveKnjige = knj;
      // posto pri ubacivanju zanrova ne dozvoljavam da ubaci dva sa istim imenom, onda je ime jedinstveno pa mogu
      // po njemu da poredim (ne moram da dohvatam id-jeve svih zanrova)
      // da li neka knjiga ima taj zanr koji hocu da obrisem?
      console.log("knjige length");
      console.log(this.sveKnjige.length);
      
      if(this.sveKnjige.length==0) {
        // ako ne postoji ni jedna knjiga u sistemu moze da brise zanr
        this.brisi = true;
      }
      else {
        for(let i = 0; i<this.sveKnjige.length; i++) {
          console.log("zanr length");
          console.log(this.sveKnjige[i].idZanra.length);
          for(let j = 0; j<this.sveKnjige[i].idZanra.length; j++) {
            if(this.sveKnjige[i].idZanra[j].zanr == this.zanrZaBrisanje) {
              // ako nadje poklapanje pri poredjenju onda ne brise
              this.brisi = false;
              break;
            }
            else {
              this.brisi = true;
            }
          }
          if(this.brisi == false) {
            break;
          }
        }
      }
      if(this.brisi == true) {
        // brisem
        console.log("brisem");
        this.servis.obrisiZanr(this.zanrZaBrisanje).subscribe(zo=>{
          console.log(zo);
          this.message2 = "Zanr je obrisan";
          window.location.reload();
        });
      } 
      else if(this.brisi == false) {
        // ne brisem
        console.log("ne brisem");
        this.message2 = "Zanr nije moguce obrisati";
      }
    });
  }
  
}


