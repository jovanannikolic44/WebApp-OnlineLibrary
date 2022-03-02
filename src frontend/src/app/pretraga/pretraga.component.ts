import { Component, OnInit } from '@angular/core';
import { Knjiga } from '../models/Knjiga';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pretraga',
  templateUrl: './pretraga.component.html',
  styleUrls: ['./pretraga.component.css']
})
export class PretragaComponent implements OnInit {

  constructor(private ruter: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('nadjeneKnjige') == null) {
      this.pretrazeneKnjige = [];
      console.log("Nema nista u LS-u");
    }
    else {
      this.pretrazeneKnjige = JSON.parse(localStorage.getItem('nadjeneKnjige'));

      if (this.pretrazeneKnjige.length === 0) {
        this.message = "Trazena knjiga ne postoji";
      }
      else {
        this.message = "";
      }
    }
  }

  pretrazeneKnjige: any = null;
  message: string = "";
  flag: string = "";

  prikazMenija: boolean = false;

  prikaziPadajuciMeni() {

    this.prikazMenija = !this.prikazMenija;
    console.log(this.prikazMenija);
  }

  prikazKnjige(k: Knjiga) {
    this.flag = "ne";

    // save flag
    localStorage.setItem('flagOdobriti', JSON.stringify(this.flag));
    // save selected image to localStorage
    localStorage.setItem('selektovanaKnjiga', JSON.stringify(k));

    // go to prikaz-knjige
    this.ruter.navigate(['/prikaz-knjige']);
  }
}
