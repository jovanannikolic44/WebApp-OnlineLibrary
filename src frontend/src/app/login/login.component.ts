import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikService } from '../korisnik.service';
import { StringifyOptions } from 'querystring';
import { Korisnik } from '../models/Korisnik';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private ruter:Router, private servis: KorisnikService) { }

  ngOnInit(): void {
  }

  username: string = "";
  sifra: string = "";
  message: string = "";

  prijaviSe() {
    if(this.username == "" || this.sifra == "" || this.username == null || this.sifra == null) {
      console.log("nisu sva polja popunjena");
      this.message = "Niste popunili sva polja"
    }
    else {
      console.log('zovem servis');
      this.servis.prijava(this.username, this.sifra).subscribe((user: Korisnik)=>{
        if(user['user'] == 'not found') {
          console.log('ne postoji korisnik');
          this.message = "Pogresno uneti kredencijali"; // ili cekate
        }
        else if(user['user'] == 'still waiting') {
          console.log('jos uvek ceka da se zahtev odobri');
          this.message = "Zahtev jos uvek nije odobren"
        }
        else {
          console.log('ok prijava');
          localStorage.setItem('korisnikUlogovan', JSON.stringify(this.username));
          this.ruter.navigate(['/reg-kor']);
        }
      })
      this.message="";
    }
    console.log("ovde");
  }
}
