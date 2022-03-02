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

  constructor(private servis:KorisnikService, private ruter:Router) { }

  ngOnInit(): void {

    this.servis.sveKnjigeNaCekanju().subscribe(knj=>{
      console.log(knj);
      this.odobritiOveKnjige = knj;
      console.log("ODOBRITI OVE KNJIGE");
      console.log(this.odobritiOveKnjige);
    });
  }


  odobritiOveKnjige: any = [];
  flag: string = "";

  prikazMenija:boolean=false;

  prikaziPadajuciMeni() {
   
    this.prikazMenija=!this.prikazMenija;
    console.log(this.prikazMenija);
  }

  prikazKnjige(k:Knjiga) {
    console.log("pretraga knjige");
    console.log(k);
    
    this.flag = "prikazi";

    // sacuvati flag
    localStorage.setItem('flagOdobriti', JSON.stringify(this.flag));

    // sacuvati selektovanu sliku u localStorage
    localStorage.setItem('selektovanaKnjiga', JSON.stringify(k));

    // rutirati na stranicu gde se prikazuje selektovana knjiga
    this.ruter.navigate(['/prikaz-knjige']);
  }

  odobri(knjigaZaOdb) {
    console.log(knjigaZaOdb);
    console.log("id knjige koja se odobrava");
    console.log(knjigaZaOdb._id);

    let indeks: number = this.odobritiOveKnjige.indexOf(knjigaZaOdb);
    console.log(indeks);

    this.servis.odobriKnjigu(knjigaZaOdb._id).subscribe(yes=>{
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
    console.log("ul");
    console.log(ulogovan);
    this.servis.updateStatusaKorisnika(ulogovan, format).subscribe(upd => {
      console.log(upd);
    });
  }

  pocetnaStrana() {
    this.ruter.navigate(['/reg-kor']);
  }
}
