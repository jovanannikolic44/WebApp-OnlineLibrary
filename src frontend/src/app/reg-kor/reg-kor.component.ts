import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
//import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { KorisnikService } from '../korisnik.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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

  constructor(private ruter: Router, private servis: KorisnikService) { }

  ngOnInit(): void {
    this.username = JSON.parse(localStorage.getItem('korisnikUlogovan'));
    this.servis.dohvatiOvogKorisnika(this.username).subscribe(kor => {
      this.korisnik = kor;
      this.datumDate = new Date(this.korisnik[0].datumRodjenja);
      this.datumString = this.datumDate.toLocaleDateString();
    });

    // Books
    this.servis.dohvatiProcitaneKnjige(this.username).subscribe(knjige => {
      this.procitaneKnjige = knjige;
      if (this.procitaneKnjige.length != 0)
        this.pieChart();

      localStorage.setItem('procitane', JSON.stringify(this.procitaneKnjige));

      this.proc = this.procitaneKnjige.slice(0, 2);
    });

    this.servis.dohvatiTrenutnoSeCitaju(this.username).subscribe(knjige => {
      this.trenutnoSeCitaju = knjige;
      this.trc = this.trenutnoSeCitaju.slice(0, 2);

    });

    this.servis.dohvatiNaListi(this.username).subscribe(knjige => {
      this.naListi = knjige;
      this.lista = this.naListi.slice(0, 2);
    });

    // Comments
    this.servis.dohvatiSveKomentare(this.username).subscribe(kom => {
      this.komentari = kom;
      this.koment = this.komentari.slice(0, 2);
    });

    this.servis.nadjiTip(this.username).subscribe(tip => {
      console.log(tip);
      this.tipKorisnika = "" + tip;
    });

    // Events
    this.servis.dohvatiSvaJavnaDesavanjaUSistemu().subscribe(desavanja => {
      this.javnaDesavanja = desavanja;

      length = this.javnaDesavanja.length;
      for (let i = 0; i < length; i++) {
        this.dateDesavanja[i] = new Date(this.javnaDesavanja[i].pocetak);
        this.dateKrajDesavanja[i] = new Date(this.javnaDesavanja[i].kraj);

        this.pocetakDesavanja[i] = this.dateDesavanja[i].toLocaleString();
        this.javnaDesavanja[i].pocetak = this.pocetakDesavanja[i];
        this.krajDesavanja[i] = this.dateKrajDesavanja[i].toLocaleString();
        this.javnaDesavanja[i].kraj = this.krajDesavanja[i];
      }

      console.log(this.javnaDesavanja);
    });
  }


  onPageChange(event) {
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.procitaneKnjige.length) {
      endIndex = this.procitaneKnjige.length
    }
    this.proc = this.procitaneKnjige.slice(startIndex, endIndex);
  }

  onPageChange2(event) {
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.trenutnoSeCitaju.length) {
      endIndex = this.trenutnoSeCitaju.length
    }
    this.trc = this.trenutnoSeCitaju.slice(startIndex, endIndex);
  }

  onPageChange3(event) {
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.naListi.length) {
      endIndex = this.naListi.length
    }
    this.lista = this.naListi.slice(startIndex, endIndex);
  }

  onPageChange4(event) {
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.komentari.length) {
      endIndex = this.komentari.length
    }
    this.koment = this.komentari.slice(startIndex, endIndex);
  }



  pocetakDesavanja: string[] = [];
  dateDesavanja: Date[] = [];
  krajDesavanja: string[] = [];
  dateKrajDesavanja: Date[] = [];
  javnaDesavanja: any = [];


  tipKorisnika: string = "";
  korisnik: any = [];
  username: string = "";
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
  cnt: number[] = [];
  z: any = null;
  ime: string[] = [];
  procenti: any[] = [];
  proc: any = [];
  trc: any = [];
  lista: any = [];
  koment: any = [];


  prikazMenija: boolean = false;

  prikaziPadajuciMeni() {

    this.prikazMenija = !this.prikazMenija;
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

  func(knjiga: any) {
    let length1 = this.komentari.length;
    for (let i = 0; i < length1; i++) {
      if (this.komentari[i].idKnjige._id == knjiga.idKnjige._id) {
        this.flag = "ne";

        // save flag
        localStorage.setItem('flagOdobriti', JSON.stringify(this.flag));
        localStorage.setItem('selektovanaKnjiga', JSON.stringify(this.komentari[i]));
        this.ruter.navigate(['/prikaz-knjige']);
      }
    }
  }


  pieChart() {
    let length = this.procitaneKnjige.length;
    let s = 0;

    for (let i = 0; i < length; i++) {
      let length2 = this.procitaneKnjige[i].idZanra.length;
      for (let j = 0; j < length2; j++) {
        this.sviZanroviProcitanihKnjiga[s] = this.procitaneKnjige[i].idZanra[j].zanr;
        s++;
      }
    }

    for (let y = 0; y < this.sviZanroviProcitanihKnjiga.length; y++) {
      console.log(this.sviZanroviProcitanihKnjiga[y]);

    }


    this.servis.dohvatiSveZanroveUSistemu().subscribe(zanrovi => {
      this.z = zanrovi;
      for (let p = 0; p < zanrovi.length; p++) {
        this.sviZanrovi[p] = this.z[p].zanr;
      }

      for (let k = 0; k < this.sviZanrovi.length; k++) {
        this.cnt[k] = 0;
        this.ime[k] = "";
      }


      for (let i = 0; i < this.sviZanrovi.length; i++) {
        for (let j = 0; j < this.sviZanroviProcitanihKnjiga.length; j++) {
          if (this.sviZanroviProcitanihKnjiga[j] == this.sviZanrovi[i]) {
            this.cnt[i]++;
            this.ime[i] = this.sviZanrovi[i];
          }
        }
      }

      for (let r = 0; r < this.sviZanrovi.length; r++) {
        this.procenti[r] = (this.cnt[r] / this.sviZanroviProcitanihKnjiga.length) * 100;
      }

      let procenti2 = this.procenti.filter(function (el) {
        return el != "";
      });

      let ime2 = this.ime.filter(function (el) {
        return el != "";
      });

      let procenti3 = [];
      for (let q = 0; q < procenti2.length; q++) {
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


  dodajOvajZanr: string = "";
  message: string = "";

  dodavanjeZanrova() {
    this.message2 = "";
    if (this.dodajOvajZanr) {
      let vecPostoji = false;

      if (this.z.length == 0) {
        vecPostoji = false;
      }
      else {
        for (let i = 0; i < this.z.length; i++) {
          if (this.z[i].zanr == this.dodajOvajZanr) {
            vecPostoji = true;
          }
          console.log(this.z[i].zanr);
        }
      }
      if (vecPostoji == true) {
        this.message = "Vec postoji ovaj zanr";
        return;
      }
      this.message = "";

      this.servis.dodajZanr(this.dodajOvajZanr).subscribe(za => {

        this.message = "Uspesno unet zanr";
        window.location.reload();
      });
    }
  }

  zanrZaBrisanje: string = "";
  message2: string = "";
  brisi: boolean = false;
  sveKnjige: any = [];
  cntB: number = 0;

  obrisiZanr() {
    this.message = "";
    console.log("Obrisi zanr");

    this.servis.dohvatiSveKnjige().subscribe(knj => {
      console.log(knj);
      this.sveKnjige = knj;

      if (this.sveKnjige.length == 0) {
        this.brisi = true;
      }
      else {
        for (let i = 0; i < this.sveKnjige.length; i++) {
          for (let j = 0; j < this.sveKnjige[i].idZanra.length; j++) {
            if (this.sveKnjige[i].idZanra[j].zanr == this.zanrZaBrisanje) {
              this.brisi = false;
              break;
            }
            else {
              this.brisi = true;
            }
          }
          if (this.brisi == false) {
            break;
          }
        }
      }
      if (this.brisi == true) {
        // Delete genre
        this.servis.obrisiZanr(this.zanrZaBrisanje).subscribe(zo => {
          console.log(zo);
          this.message2 = "Zanr je obrisan";
          window.location.reload();
        });
      }
      else if (this.brisi == false) {
        // Do not delete genre
        this.message2 = "Zanr nije moguce obrisati";
      }
    });
  }

}


