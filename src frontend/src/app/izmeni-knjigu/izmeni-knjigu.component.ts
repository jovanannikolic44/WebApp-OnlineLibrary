import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { KorisnikService } from '../korisnik.service';

@Component({
  selector: 'app-izmeni-knjigu',
  templateUrl: './izmeni-knjigu.component.html',
  styleUrls: ['./izmeni-knjigu.component.css']
})
export class IzmeniKnjiguComponent implements OnInit {

  constructor(private servis: KorisnikService, private ruter: Router, public fb: FormBuilder) { }

  displayedColumns: string[] = ['Slika', 'Naziv', 'Autori', 'Datum', 'Opis', 'Zanr', 'BrStr'];

  ngOnInit(): void {

    this.servis.odobreneKnjige().subscribe(books => {
      console.log(books);
      this.sveKnjige = books;
      this.knjigeNaStrani = this.sveKnjige.slice(0, 5);
      console.log(this.knjigeNaStrani);

    });

    this.servis.dohvatiSveZanroveUSistemu().subscribe(genre => {
      this.sviZanrovi = genre;
    });

    this.form = this.fb.group({
      nazivKnjige: [''],
      autori: [''],
      datumIzdavanja: [null],
      urlSlike: [null],
      status: [''],
      brStrana: [''],
      zanrovi: [null],
      opis: [''],
    });
  }


  sveKnjige: any = [];
  knjigeNaStrani: any = [];
  knjigaZaIzmenu: any = null;
  flag: boolean;
  sviZanrovi: any = [];
  zanroviKnjiga: any = [];

  slika: File = null;
  nazivKnjige: string;
  autori: string;
  autoriStr: string[] = [];
  datumIzdavanja: Date;
  zanrovi: string[];
  brStrana: string;
  opis: string;
  message: string = "";
  form: FormGroup;

  prikazMenija: boolean = false;

  prikaziPadajuciMeni() {

    this.prikazMenija = !this.prikazMenija;
    console.log(this.prikazMenija);
  }



  uploadFile(event) {
    const file = event.target.files[0];
    this.slika = file;

    console.log(this.slika);

    this.form.patchValue({
      urlSlike: file
    });
    this.form.get('urlSlike').updateValueAndValidity();
    console.log("upload file deo");
    console.log(this.form.get('urlSlike').value);

  }

  izmeni() {
    if (this.zanrovi) {
      let lengthOfZanrovi = this.zanrovi.length;
      if (lengthOfZanrovi > 3) {
        this.message = "Dozvoljeno je uneti maksimalno tri zanra";
        return;
      }
    }
    this.message = "";

    let idKnjige = this.knjigaZaIzmenu._id;

    let indeks: number = this.sveKnjige.indexOf(this.knjigaZaIzmenu);

    if (this.nazivKnjige) {
      this.servis.promeniNazivKnjige(idKnjige, this.nazivKnjige).subscribe(ime => {
        console.log(ime);
        let nazivKnj: any = ime;
        this.sveKnjige[indeks].naziv = nazivKnj.naziv;
        this.nazivKnjige = "";
      });
    }
    if (this.autori) {
      this.servis.promeniAutore(idKnjige, this.autori).subscribe(autori => {
        console.log(autori);
        let nazivKnj: any = autori;
        this.sveKnjige[indeks].autori = nazivKnj.autori;
        this.autori = "";
      });
    }
    if (this.opis) {
      this.servis.promeniOpis(idKnjige, this.opis).subscribe(opis => {
        console.log(opis);
        let nazivKnj: any = opis;
        this.sveKnjige[indeks].opis = nazivKnj.opis;
        this.opis = "";
      });
    }
    if (this.brStrana) {
      this.servis.promeniBrStr(idKnjige, this.brStrana).subscribe(brstr => {
        console.log(brstr);
        let nazivKnj: any = brstr;
        this.sveKnjige[indeks].brStrana = nazivKnj.brStrana;
        this.brStrana = "";
      });
    }
    if (this.zanrovi) {
      this.servis.idZanr(this.zanrovi).subscribe(z => {
        this.servis.promeniZanrove(idKnjige, z).subscribe(knj => {
          let nazivKnj: any = knj;
          this.sveKnjige[indeks].idZanra = nazivKnj.idZanra;
          this.zanrovi = [];
        });
      });
    }
    if (this.datumIzdavanja) {
      this.servis.promeniDatumIzdavanja(idKnjige, this.datumIzdavanja).subscribe(datum => {
        let nazivKnj: any = datum;
        this.sveKnjige[indeks].datumIzdavanja = nazivKnj.datumIzdavanja;
        this.datumIzdavanja = null;
      });
    }
    if (this.slika) {
      this.servis.promeniNaslovnuStranu(idKnjige, this.form.value.urlSlike).subscribe(slika => {
        console.log("nasovna strana");
        console.log(this.form.value.urlSlike);
        let nazivKnj: any = slika;
        this.sveKnjige[indeks].urlSlike = nazivKnj.urlSlike;
        this.slika = null;
      });
    }
  }

  pocetnaStrana() {
    this.ruter.navigate(['/reg-kor']);
  }

  logOut() {
    this.ruter.navigate(['/login']);
    let datum = Date.now();
    let datumDate = new Date(datum);
    let format = datumDate.toLocaleString();
    let ulogovan = JSON.parse(localStorage.getItem('korisnikUlogovan'));
    console.log(ulogovan);
    this.servis.updateStatusaKorisnika(ulogovan, format).subscribe(upd => {
      console.log(upd);
    });
  }

  f(izmenaSeDesava) {
    this.knjigaZaIzmenu = izmenaSeDesava;
    this.flag = true;
  }

  flag2: string = "";

  prikazKnjige(k) {
    this.flag2 = "prikazi";

    // save flag
    localStorage.setItem('flagOdobriti', JSON.stringify(this.flag2));

    // save selected image to localStorage
    localStorage.setItem('selektovanaKnjiga', JSON.stringify(k));

    // go to prikaz-knjige
    this.ruter.navigate(['/prikaz-knjige']);
  }
}
