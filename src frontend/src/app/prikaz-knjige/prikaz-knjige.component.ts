import { Component, OnInit } from '@angular/core';
import { Knjiga } from '../models/Knjiga';
import { KorisnikService } from '../korisnik.service';
import { Zanr } from '../models/Zanr';
import { fromEventPattern } from 'rxjs';
import { Router } from '@angular/router';
import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-prikaz-knjige',
  templateUrl: './prikaz-knjige.component.html',
  styleUrls: ['./prikaz-knjige.component.css']
})
export class PrikazKnjigeComponent implements OnInit {

  constructor(private servis: KorisnikService, private ruter: Router) { }

  displayedColumns3: string[] = ['Korisnik', 'Ocena', 'Komentar'];

  ngOnInit(): void {
    if (localStorage.getItem('selektovanaKnjiga') == null) {
      this.knjigaZaPrikaz = null;
      console.log("Nema nista u LS-u");
    }
    else {

      this.odobriti = JSON.parse(localStorage.getItem('flagOdobriti'));
      this.knjigaZaPrikaz = JSON.parse(localStorage.getItem('selektovanaKnjiga'));


      this.ulogovanKorisnik = JSON.parse(localStorage.getItem('korisnikUlogovan'));
      this.servis.nadjiTip(this.ulogovanKorisnik).subscribe(tip => {
        this.tipUlogovanogKorisnika = tip;
      });

      if (this.odobriti == "ne") {
        if (this.ulogovanKorisnik === "gost") {
          this.prosecnaOcenaDveDec = this.knjigaZaPrikaz.prosecnaOcena.toFixed(2);
          this.knjigaZaPrikaz.prosecnaOcena = this.prosecnaOcenaDveDec;
          this.datumDate = new Date(this.knjigaZaPrikaz.datumIzdavanja);
          this.datumIzdavanja = this.datumDate.toLocaleDateString();
        }
        else {
          this.prosecnaOcenaDveDec = this.knjigaZaPrikaz.idKnjige.prosecnaOcena.toFixed(2);
          this.knjigaZaPrikaz.idKnjige.prosecnaOcena = this.prosecnaOcenaDveDec;
          this.datumDate = new Date(this.knjigaZaPrikaz.idKnjige.datumIzdavanja);
          this.datumIzdavanja = this.datumDate.toLocaleDateString();


        }

        let length = this.knjigaZaPrikaz.idZanra.length;

        for (let i = 0; i < length; i++) {
          this.nadjeniZanrovi[i] = this.knjigaZaPrikaz.idZanra[i].zanr;
        }

        this.spojeniZanrovi = this.nadjeniZanrovi.join(',');

        if (this.ulogovanKorisnik === "gost") {
          this.servis.komentariNaKnjigu(this.knjigaZaPrikaz._id).subscribe(kom => {
            this.komentari = kom;
            this.length = this.komentari.length;
            this.koment = this.komentari.slice(0, 5);
          });
        }
        else {
          this.servis.komentariNaKnjigu(this.knjigaZaPrikaz.idKnjige._id).subscribe(kom => {
            this.komentari = kom;
            this.length = this.komentari.length;
            this.koment = this.komentari.slice(0, 5);
          });
        }

        if (this.knjigaZaPrikaz == null) {
          // message
          this.message = "Trazena knjiga ne postoji";
        }
        else {
          this.message = "";
        }
      }

      else if (this.odobriti == "prikazi") {
        this.datumDate = new Date(this.knjigaZaPrikaz.datumIzdavanja);
        this.datumIzdavanja = this.datumDate.toLocaleDateString();

        let length = this.knjigaZaPrikaz.idZanra.length;
        for (let i = 0; i < length; i++) {
          this.nadjeniZanrovi[i] = this.knjigaZaPrikaz.idZanra[i].zanr;

          this.spojeniZanrovi = this.nadjeniZanrovi.join(',');

          this.servis.komentariNaKnjigu(this.knjigaZaPrikaz._id).subscribe(kom => {
            this.komentari = kom;
            this.length = this.komentari.length;
            this.koment = this.komentari.slice(0, 2);
          });
        }
      }
    }
  }


  onPageChange4(event) {
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.komentari.length) {
      endIndex = this.komentari.length
    }
    this.koment = this.komentari.slice(startIndex, endIndex);
  }

  onPageChange5(event) {
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.komentari.length) {
      endIndex = this.komentari.length
    }
    this.koment = this.komentari.slice(startIndex, endIndex);
  }


  prosecnaOcenaDveDec: string = "";

  koment: any = [];
  tipUlogovanogKorisnika: any = [];
  odobriti: string = "";
  knjigaZaPrikaz: any = null;
  datumIzdavanja: String = "";
  datumDate: Date = null;
  nadjeniZanrovi: string[] = [];
  komentari: any = "";
  length: number = 0;
  ulogovanKorisnik: any = [];
  message: string = "";
  statusCitanja: boolean = false;
  statusCitanjaTrCita: boolean = false;
  brProcitanihStrana: string = "";
  stigaoJeDo: any = [];
  naListu: boolean = false;
  saListe: boolean = false;
  textAreaVal: string = "";
  prosecnaOcena: string = "";
  spojeniZanrovi: string = "";

  prikazMenija: boolean = false;

  prikaziPadajuciMeni() {

    this.prikazMenija = !this.prikazMenija;
    console.log(this.prikazMenija);
  }

  logOut() {
    this.ruter.navigate(['/login']);
    let datum = Date.now();
    let datumDate = new Date(datum);
    let format = datumDate.toLocaleString();
    this.servis.updateStatusaKorisnika(this.ulogovanKorisnik, format).subscribe(upd => {
      console.log(upd);
    });
  }

  nazad() {
    this.ruter.navigate(['/reg-kor']);
  }

  citanje() {
    this.message2 = "";
    let elem = <HTMLInputElement>document.getElementById("naL");
    this.statusCitanja = elem.checked;

    if (this.statusCitanja == false) {
      console.log("Status je false");
    }
    else if (this.statusCitanja == true) {

      this.servis.dohvatiId(this.ulogovanKorisnik).subscribe(korId => {
        this.servis.azurirajProcitane(korId, this.knjigaZaPrikaz.idKnjige._id, this.knjigaZaPrikaz.idKnjige.brStrana,
          this.knjigaZaPrikaz.idZanra).subscribe(statusi => {
            console.log(statusi);
          });
      });
    }
  }

  citanje2() {
    this.message2 = "";
    let elem = <HTMLInputElement>document.getElementById("saL");
    this.statusCitanjaTrCita = elem.checked;

    if (this.statusCitanjaTrCita == false) {
      console.log("Status je false");
    }
    else {
      this.servis.dohvatiId(this.ulogovanKorisnik).subscribe(korId => {
        this.servis.azurirajTrCitam(korId, this.knjigaZaPrikaz.idKnjige._id, this.knjigaZaPrikaz.idZanra).subscribe(azu => {

          this.servis.stigaoJeDoStrane(this.knjigaZaPrikaz.idKnjige._id, korId).subscribe(st => {

            this.stigaoJeDo = st;
          });
        });
      });
    }
  }

  realFunc() {
    this.message2 = "";
    let elem = <HTMLInputElement>document.getElementById("tekst");
    this.brProcitanihStrana = elem.value;

    this.servis.dohvatiId(this.ulogovanKorisnik).subscribe(korId => {
      this.servis.azurirajBrProc(korId, this.knjigaZaPrikaz.idKnjige._id, this.brProcitanihStrana).subscribe(statusi => {
        console.log(statusi);
        this.stigaoJeDo = this.brProcitanihStrana;
      });
    });
  }

  staviNaListu() {
    this.message2 = "";
    let elem = <HTMLInputElement>document.getElementById("cekboks");
    this.naListu = elem.checked;

    if (this.naListu == true) {
      this.servis.dohvatiId(this.ulogovanKorisnik).subscribe(korId => {
        this.servis.dodajNaListu(korId, this.knjigaZaPrikaz.idKnjige._id,
          this.knjigaZaPrikaz.idZanra).subscribe(st => {
            console.log(st);
          });
      });
    }
  }

  obrisiSaListe() {
    this.message2 = "";
    let elem = <HTMLInputElement>document.getElementById("cekboks2");
    this.saListe = elem.checked;

    if (this.saListe == true) {
      this.servis.dohvatiId(this.ulogovanKorisnik).subscribe(korId => {
        this.servis.obrisiSaListe(korId, this.knjigaZaPrikaz.idKnjige._id).subscribe(st => {
          console.log(st);
        });
      });
    }
  }

  cnt: number = 0;
  arrayOfChars: string[] = [];
  comment: string = "";
  message2: string = "";
  flag: boolean = false;


  textA() {
    let elem2 = <HTMLInputElement>document.getElementById("TA");
    this.arrayOfChars = elem2.value.split(' ');
    this.cnt = this.arrayOfChars.length;
    if (this.cnt > 1001) {
      console.log("Uneto je 1000 reci");
    }
    else {
      this.cnt++;
    }
  }

  unesiKom() {
    this.message2 = "";
    let polaKnjige = this.knjigaZaPrikaz.idKnjige.brStrana / 2;
    this.servis.dohvatiId(this.ulogovanKorisnik).subscribe(korId => {
      this.servis.stigaoJeDoStrane(this.knjigaZaPrikaz.idKnjige._id, korId).subscribe(st => {
        this.stigaoJeDo = st;

        let procitaneKnjige = JSON.parse(localStorage.getItem('procitane'));

        for (let m = 0; m < procitaneKnjige.length; m++) {
          if (this.knjigaZaPrikaz.idKnjige._id == procitaneKnjige[m].idKnjige._id) {
            this.flag = true;
          }
        }


        if (this.stigaoJeDo >= polaKnjige || this.flag) {
          let elem = <HTMLInputElement>document.getElementById("TA");
          this.comment = elem.value;

          if (this.comment == "" && this.selectedNumber == undefined) {
            this.message2 = "Niste uneli komentar ni ocenu";
            return;
          }
          else if (this.comment != "" && this.selectedNumber == undefined) {
            this.selectedNumber = 0;        // nema ocene
          }
          else if (this.comment == "" && this.selectedNumber) {
            this.comment = "Nema komentara";
          }

          this.servis.dodajKomentare(this.knjigaZaPrikaz.idKnjige._id, korId, this.comment, this.selectedNumber,
            this.knjigaZaPrikaz.idZanra).subscribe(s => {
              this.komentari = s;

              this.servis.dohvatiKnjigu(this.knjigaZaPrikaz.idKnjige).subscribe(k => {

                let newSmth: any = k;
                this.knjigaZaPrikaz.idKnjige.prosecnaOcena = newSmth.prosecnaOcena;

                window.location.reload();

                localStorage.setItem('selektovanaKnjiga', JSON.stringify(this.knjigaZaPrikaz));
              });
            });
        }
        else {
          this.message2 = "Niste procitali dovoljno knjige da biste ostavili komentar";
        }
      });
    });
  }

  message3: string = "";

  // STARS
  zvezde: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedNumber: number;

  izbrojZvezde(obelezeno) {
    this.selectedNumber = obelezeno;
  }

  izmeniKomentar(p) {
    console.log(p);
    console.log(this.comment);
    console.log(this.selectedNumber);
  }

  naProfil(komKor) {
    if (komKor.idKor.username == this.ulogovanKorisnik) {
      this.ruter.navigate(['/reg-kor']);
    }
    else {
      localStorage.setItem('naProfilIdem', JSON.stringify(komKor.idKor));
      this.ruter.navigate(['/profili']);
    }

  }

  nazadNaOdb() {
    this.ruter.navigate(['/odobri-knjigu']);
  }

  nazadNaIzm() {
    this.ruter.navigate(['/izmeniK']);
  }
}
