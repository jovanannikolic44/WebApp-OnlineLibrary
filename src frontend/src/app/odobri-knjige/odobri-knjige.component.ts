import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikService } from '../korisnik.service';
import { Knjiga } from '../models/Knjiga';

@Component({
  selector: 'app-odobri-knjige',
  templateUrl: './odobri-knjige.component.html',
  styleUrls: ['./odobri-knjige.component.css']
})
export class OdobriKnjigeComponent implements OnInit {

  constructor(private servis: KorisnikService, private ruter: Router) { }

  ngOnInit(): void {

    this.servis.sveKnjigeNaCekanju().subscribe(knj => {
      console.log(knj);
      this.odobritiOveKnjige = knj;
    });
  }


  odobritiOveKnjige: any = [];
  flag: string = "";

  prikazMenija: boolean = false;

  prikaziPadajuciMeni() {

    this.prikazMenija = !this.prikazMenija;
    console.log(this.prikazMenija);
  }

  prikazKnjige(k: Knjiga) {
    this.flag = "prikazi";

    // save flag
    localStorage.setItem('flagOdobriti', JSON.stringify(this.flag));

    // save selected image to localStorage
    localStorage.setItem('selektovanaKnjiga', JSON.stringify(k));

    // go to prikaz-knjige
    this.ruter.navigate(['/prikaz-knjige']);
  }

  odobri(knjigaZaOdb) {
    let indeks: number = this.odobritiOveKnjige.indexOf(knjigaZaOdb);
    console.log(indeks);

    this.servis.odobriKnjigu(knjigaZaOdb._id).subscribe(yes => {
      console.log(yes);
      this.odobritiOveKnjige.splice(indeks, 1);
    });
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

  pocetnaStrana() {
    this.ruter.navigate(['/reg-kor']);
  }
}
