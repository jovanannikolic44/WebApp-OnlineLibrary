import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikService } from '../korisnik.service';

@Component({
  selector: 'app-promena-lozinke',
  templateUrl: './promena-lozinke.component.html',
  styleUrls: ['./promena-lozinke.component.css']
})
export class PromenaLozinkeComponent implements OnInit {

  constructor(private ruter: Router, private servis: KorisnikService) { }

  ngOnInit(): void {
  }

  staraL: string = "";
  novaLP: string = "";
  novaLD: string = "";
  message: string = "";


  potvrda() {
    console.log(this.staraL);
    console.log(this.novaLP);
    console.log(this.novaLD);
    if (this.staraL == "" || this.novaLP == "" || this.novaLD == "" || this.staraL == null || this.novaLP == null || this.novaLD == null) {
      this.message = "Niste popunili sva polja";
    }
    else {
      if (this.novaLP === this.novaLD) {
        // OK
        let lozinkaRegex = /^(([a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&]).{7,})$/;
        if (!lozinkaRegex.test(this.novaLP)) {
          this.message = "Nova lozinka je u losem formatu";
        }
        else {
          this.servis.promeniLozinku(this.staraL, this.novaLD).subscribe(user => {
            if (user['user'] == 'pogresna stara lozinka') {
              this.message = "Pogresna stara lozinka";
            }
            else {
              this.message = "Uspesno promenjena lozinka";
              this.ruter.navigate(['/login']);
            }
          })
        }
      }
      else {
        this.message = "Niste uneli iste nove lozinke";
      }
    }
  }
}
