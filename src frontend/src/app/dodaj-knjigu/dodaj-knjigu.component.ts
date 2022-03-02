import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { KorisnikService } from '../korisnik.service';

@Component({
  selector: 'app-dodaj-knjigu',
  templateUrl: './dodaj-knjigu.component.html',
  styleUrls: ['./dodaj-knjigu.component.css']
})
export class DodajKnjiguComponent implements OnInit {

  constructor(private servis: KorisnikService, public fb: FormBuilder, private ruter: Router) { }

  ngOnInit(): void {
    this.prikazMenija=false;
    this.servis.dohvatiSveZanroveUSistemu().subscribe(zanr => {
      this.sviZanrovi = zanr;
      console.log(this.sviZanrovi);
    });
    this.form = this.fb.group({
      nazivKnjige: [''],
      autori: [''],
      datumIzdavanja: [null],
      mail: [''],
      urlSlike: [null],
      status: [''],
      brStrana: [''],
      zanrovi: [null],
      opis: [''],
    });
  }

  slika: File;
  nazivKnjige: string;
  autori: string;
  autoriStr: string[] = [];
  datumIzdavanja: Date;
  zanrovi: string[];
  brStrana: string;
  opis: string;
  sviZanrovi: any[];
  form: FormGroup;
  message: string = "";
  status: string = "";

  prikazMenija:boolean;

  prikaziPadajuciMeni() {
   
    this.prikazMenija=!this.prikazMenija;
    console.log(this.prikazMenija);
  }

  uploadFile(event) {
    const file = event.target.files[0];
    this.slika = file;
  
    this.form.patchValue({
      urlSlike: file
    });
    console.log('files');

    this.form.get('urlSlike').updateValueAndValidity()
    
  }

  unesi() {
   
    if(this.nazivKnjige && this.autoriStr && this.datumIzdavanja && this.zanrovi && this.brStrana && this.opis) {
      let lengthOfZanrovi = this.zanrovi.length;
      if(lengthOfZanrovi>3) {
        this.message="Dozvoljeno je uneti maksimalno tri zanra";
      }
      else {
        this.message="";

        // ovde imam niz stringova, this.autori je string
        this.autoriStr = this.autori.split(',');
        this.status = "cekanje";
        


        // OGRANICENJA AKO NEKA POLJA NISU UNETA
        // sve je obavezno, osim slike

        console.log("Sve uneto");
        this.servis.idZanr(this.zanrovi).subscribe(z=>{
          console.log(z);
          this.servis.dodajKnjigu(this.nazivKnjige, this.autoriStr, this.datumIzdavanja, z, this.brStrana, this.opis, 
            this.form.value.urlSlike, this.status).subscribe(knj=>{
              console.log("nakon poziva servisa");
              console.log(knj);
              this.message = "Knjiga je uspesno uneta";
          });
        });
      }
    }
    else {
      this.message = "Niste popunili sva polja";
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

}
