import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikService } from '../korisnik.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-izmena',
  templateUrl: './izmena.component.html',
  styleUrls: ['./izmena.component.css']
})
export class IzmenaComponent implements OnInit {

  constructor(private ruter: Router, private servis: KorisnikService, public fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      ime: [''],
      prezime: [''],
      grad: [''],
      drzava: [''],
      datumRodjenja: [null],
      mail: [''],
      avatar: [null],
    });
    this.prikazMenija = false;
  }

  prikazMenija: boolean;
  profilnaSlika: File = null;
  ime: string = "";
  prezime: string = "";
  grad: string = "";
  drzava: string = "";
  datumRodjenja: Date = null;
  mail: string = "";
  message: string = "";
  form: FormGroup;
  userUlogovan: string = "";
  korisnik: any;


  uploadFile(event) {
    const file = event.target.files[0];
    this.profilnaSlika = file;

    console.log(this.profilnaSlika);

    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity()

  }

  prikaziPadajuciMeni() {

    this.prikazMenija = !this.prikazMenija;
    console.log(this.prikazMenija);
  }

  logOut() {
    this.ruter.navigate(['/login']);
    let datum = Date.now();
    let datumDate = new Date(datum);
    let format = datumDate.toLocaleString();
    let ulogovan = JSON.parse(localStorage.getItem('korisnikUlogovan'));
    this.servis.updateStatusaKorisnika(ulogovan, format).subscribe(upd => {
      console.log(upd);
    });
  }

  // provera za Regex mail-a
  izmeni() {
    console.log("izmena");

    console.log(this.ime);
    console.log(this.prezime);
    console.log(this.profilnaSlika);
    console.log(this.drzava);
    console.log(this.grad);
    console.log(this.datumRodjenja);
    console.log(this.mail);


    this.userUlogovan = JSON.parse(localStorage.getItem('korisnikUlogovan'));

    if (!this.ime && !this.prezime && !this.profilnaSlika && !this.drzava && !this.grad && !this.datumRodjenja && !this.mail) {
      this.message = "Niste popunili ni jedno polje."
    }
    else {
      this.message = "";

      if (this.ime) {
        this.servis.promeniIme(this.userUlogovan, this.ime).subscribe(ime => {
          console.log(ime);
        });
      }
      if (this.prezime) {
        this.servis.promeniPrezime(this.userUlogovan, this.prezime).subscribe(prezime => {
          console.log(prezime);
        });
      }
      if (this.drzava) {
        this.servis.promeniDrzavu(this.userUlogovan, this.drzava).subscribe(drzava => {
          console.log(drzava);
        });
      }
      if (this.grad) {
        this.servis.promeniGrad(this.userUlogovan, this.grad).subscribe(grad => {
          console.log(grad);
        });
      }
      if (this.mail) {
        let mailRegex = /^[A-Za-z0-9._-]+@[A-Za-z0-9]+[.][A-Za-z]{3,}$/;
        if (!mailRegex.test(this.mail)) {
          this.message = "Nova e-mail adresa je u losem formatu";
        }
        else {
          this.servis.promeniMail(this.userUlogovan, this.mail).subscribe(mail => {
            console.log(mail);
          });
        }
      }
      if (this.datumRodjenja) {
        this.servis.promeniDatumRodjenja(this.userUlogovan, this.datumRodjenja).subscribe(datumRodjenja => {
          console.log(datumRodjenja);
        });
      }
      if (this.profilnaSlika) {
        this.servis.promeniProfilnuSliku(this.userUlogovan, this.form.value.avatar).subscribe(slika => {
          console.log(slika);
        });
      }
    }
  }
}
