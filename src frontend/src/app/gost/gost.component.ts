import { Component, OnInit } from '@angular/core';
import { Router, RouteReuseStrategy } from '@angular/router';
import { KorisnikService } from '../korisnik.service';
import { PromenaLozinkeComponent } from '../promena-lozinke/promena-lozinke.component';
import { Knjiga } from '../models/Knjiga';

@Component({
  selector: 'app-gost',
  templateUrl: './gost.component.html',
  styleUrls: ['./gost.component.css']
})
export class GostComponent implements OnInit {
  prikazMenija: boolean;
  constructor(private ruter: Router, private servis: KorisnikService) { }

  displayedColumns3: string[] = ['Naziv desavanja', 'Status', 'Pocetak', 'Kraj'];

  ngOnInit(): void {
    this.prikazMenija = false;
    this.servis.dohvatiSveZanroveUSistemu().subscribe(zanr => {
      this.sviZanrovi = zanr;
    });

    this.servis.dohvatiSvaJavnaDesavanjaUSistemu().subscribe(desavanja => {
      this.javnaDesavanja = desavanja;

      length = this.javnaDesavanja.length;
      for (let i = 0; i < length; i++) {
        this.dateDesavanja[i] = new Date(this.javnaDesavanja[i].pocetak);
        this.dateKrajDesavanja[i] = new Date(this.javnaDesavanja[i].kraj);

        this.pocetakDesavanja[i] = this.dateDesavanja[i].toLocaleString();
        this.javnaDesavanja[i].pocetak = this.pocetakDesavanja[i];
        this.krajDesavanja[i] = this.dateKrajDesavanja[i].toLocaleString();
        this.javnaDesavanja[i].kraj = this.krajDesavanja[i];
      }

      console.log(this.javnaDesavanja);
    });
  }

  pocetakDesavanja: string[] = [];
  dateDesavanja: Date[] = [];
  krajDesavanja: string[] = [];
  dateKrajDesavanja: Date[] = [];
  javnaDesavanja: any = [];


  sviZanrovi: string[] = null;
  imeKnjige: string = "";
  autorKnjige: string[] = null;
  izabranZanr: string[] = null;
  message: string = "";
  nadjeneKnjige: any;

  prikaziPadajuciMeni() {

    this.prikazMenija = !this.prikazMenija;
    console.log(this.prikazMenija);
  }
  pretrazi() {
    if ((this.imeKnjige == "" || this.imeKnjige == null) && this.izabranZanr == null && (this.autorKnjige == null)) {
      console.log('nije nista izabrano');
      this.message = "Niste nista izabrali za pretragu";
    }
    else {
      this.message = "";

      this.servis.pretrazeneKnjige(this.imeKnjige, this.izabranZanr, this.autorKnjige).subscribe(knjige => {
        this.nadjeneKnjige = knjige;

        localStorage.setItem('nadjeneKnjige', JSON.stringify(this.nadjeneKnjige));
        let stringNeki = "gost";
        localStorage.setItem('korisnikUlogovan', JSON.stringify(stringNeki));

        this.ruter.navigate(['/pretraga']);
      });
    }
  }
}
