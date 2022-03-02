import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikService } from '../korisnik.service';
import { StringifyOptions } from 'querystring';

import { HttpEvent, HttpEventType } from '@angular/common/http';
import { getLocaleTimeFormat } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css']
})
export class RegistracijaComponent implements OnInit {

  constructor(private ruter: Router, private servis: KorisnikService, public fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      ime: [''],
      prezime: [''],
      username: [''],
      sifra: [''],
      grad: [''],
      drzava: [''],
      datumRodjenja: [null],
      mail: [''],
      avatar: [null],
      status: ['']
    });
    this.captchaResponse = null;
  }

  profilnaSlika: File;
  ime: string;
  prezime: string;
  username: string;
  sifra: string;
  grad: string;
  drzava: string;
  datumRodjenja: Date;
  mail: string;
  message: string = "";
  status: string;
  form: FormGroup;
  captchaResponse;

  resolved(captchaResponse) {
    this.captchaResponse = captchaResponse;
    console.log(this.captchaResponse);
  }
  uploadFile(event) {

    const file = event.target.files[0];
    this.profilnaSlika = file;


    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity()
  }


  registrujSe() {
    this.message = "";
    let mailRegex = /^[A-Za-z0-9._-]+@[A-Za-z0-9]+[.][A-Za-z]{3,}$/;
    let lozinkaRegex = /^(([a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&]).{7,})$/;
    let validate = 0;

    if (this.ime == "" || this.prezime == "" || this.username == "" || this.sifra == "" || this.datumRodjenja == null || this.grad == ""
      || this.drzava == "" || this.mail == "" || this.captchaResponse == null) {
      this.message = "Niste popunili sva polja";
    }
    else {
      if (!lozinkaRegex.test(this.sifra)) {
        this.message = "Lozinka je u losem formatu";
      }
      else {
        if (!mailRegex.test(this.mail)) {
          this.message = "E-mail adresa je u losem formatu";
        }
        else {
          validate = 1;
        }
      }
      if (validate == 1) {
        this.status = "cekanje";
        this.servis.registracija(
          this.ime, this.prezime, this.username, this.sifra, this.grad, this.drzava, this.mail, this.datumRodjenja, this.form.value.avatar, this.status, this.captchaResponse
        ).subscribe(user => {
          if (user['user'] == 'ok') {
            this.message = "Podnet je zahtev za registraciju";
            console.log(this.message);
          } else if (user['user'] == 'username') {
            console.log("ovde u registraciji");
            this.message = "Username vec postoji";
          } else if (user['user'] == 'email') {
            this.message = "E-mail vec postoji";
          } else if (user == "captcha prob") {
            this.message = "Captcha validacija nije uspela";
          }
        })
      }
    }
  }
}