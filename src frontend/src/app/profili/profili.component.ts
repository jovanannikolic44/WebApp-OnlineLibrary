import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikService } from '../korisnik.service';

@Component({
  selector: 'app-profili',
  templateUrl: './profili.component.html',
  styleUrls: ['./profili.component.css']
})
export class ProfiliComponent implements OnInit {

  constructor(private ruter:Router, private servis:KorisnikService) { }

  displayedColumns: string[] = ['Naziv knjige', 'Autori'];
  displayedColumns2: string[] = ['Naziv knjige', 'Autori', 'Ocena', 'Komentar'];
  displayedColumns3: string[] = ['Naziv desavanja', 'Status', 'Pocetak', 'Kraj'];

  ngOnInit(): void {
    // ovo gost ne moze da vidi

    if(localStorage.getItem('naProfilIdem')==null) {
      this.korisnik = null;
      console.log("Nema nista u LS-u");
    }
    else {
      this.korisnik = JSON.parse(localStorage.getItem('naProfilIdem'));
      console.log("korisnik");
      console.log(this.korisnik);
      this.datumDate = new Date(this.korisnik.datumRodjenja);
      this.datumString = this.datumDate.toLocaleDateString();

        // sada deo sa procitanim knjigama
      this.servis.dohvatiProcitaneKnjige(this.korisnik.username).subscribe(knjige=>{
        this.procitaneKnjige = knjige;
        this.pieChart();
        this.proc = this.procitaneKnjige.slice(0,2);
      });

      this.servis.dohvatiTrenutnoSeCitaju(this.korisnik.username).subscribe(knjige=>{
        this.trenutnoSeCitaju = knjige;
        // console.log(this.trenutnoSeCitaju);
        this.trc = this.trenutnoSeCitaju.slice(0,2);
      });

      this.servis.dohvatiNaListi(this.korisnik.username).subscribe(knjige=>{
        this.naListi = knjige;
        // console.log(this.naListi);
        this.lista = this.naListi.slice(0,2);
      });

      // svi komentari ovog korisnika
      this.servis.dohvatiSveKomentare(this.korisnik.username).subscribe(kom=>{
        this.komentari = kom;
        console.log(this.komentari);
        this.koment = this.komentari.slice(0,2);
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
        this.desavanjaStr = this.javnaDesavanja.slice(0,2);
      
        console.log(this.javnaDesavanja); 
      });

    }
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

  onPageChange6(event) {
    console.log("Page event");
    console.log(event);
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.javnaDesavanja.length) {
      // ako je endIndex veci od duzine celog mog niza sa podacima
      endIndex = this.javnaDesavanja.length
    }
    this.desavanjaStr = this.javnaDesavanja.slice(startIndex, endIndex);
  }


  pocetakDesavanja: string[]=[];
  dateDesavanja: Date[] = [];
  krajDesavanja: string[] = [];
  dateKrajDesavanja: Date[] = [];
  javnaDesavanja: any = [];
  desavanjaStr: any = [];

  korisnik: any = null;
  datumDate: Date = null;
  datumString: string = "";
  procitaneKnjige: any = [];
  trenutnoSeCitaju: any = [];
  naListi: any = [];
  komentari: any = [];
  proc: any = [];
  trc: any = [];
  lista: any = [];
  koment: any = [];

  prikazMenija:boolean=false;

  prikaziPadajuciMeni() {
   
    this.prikazMenija=!this.prikazMenija;
    console.log(this.prikazMenija);
  }

  logOut() {
    this.ruter.navigate(['/login']);
    let datum = Date.now();
    let datumDate = new Date(datum);
    let format = datumDate.toLocaleString();
    let ulogovan = JSON.parse(localStorage.getItem('korisnikUlogovan'));
    console.log("ul");
    console.log(ulogovan);
    this.servis.updateStatusaKorisnika(ulogovan, format).subscribe(upd => {
      console.log(upd);
    });
  }

  mojProfil() {
    this.ruter.navigate(['/reg-kor']);
  }

  nazad() {
    this.ruter.navigate(['prikaz-knjige']);
  }

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
        localStorage.setItem('selektovanaKnjiga', JSON.stringify(this.komentari[i]));
        this.ruter.navigate(['/prikaz-knjige']);
      }
    }
  }


  chartPodaci: any[] = [];
  chartOpcije: any;
  chartLabele: any[] = [];
  sviZanroviProcitanihKnjiga: string[] = [];
  sviZanrovi: any = [];
  cnt : number[] = [];
  z: any = null;
  ime: string[] = [];
  procenti: any[] = [];
  chartSpremna: boolean = false;

  pieChart() {

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
      for(let p = 0; p<zanrovi.length; p++) {
        this.sviZanrovi[p] = this.z[p].zanr;
      }

      for(let k = 0; k<this.sviZanrovi.length; k++) {
        this.cnt[k]=0;
        this.ime[k]="";
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
    });
  }
}
