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
    // cim udjem u pretragu dohvatam rezultat pretrazenih knjiga
    if(localStorage.getItem('nadjeneKnjige')==null) {
      console.log("ovde2");
      this.pretrazeneKnjige = [];
      console.log("Nema nista u LS-u");
    }
    else {
      this.pretrazeneKnjige = JSON.parse(localStorage.getItem('nadjeneKnjige'));
    
      //this.nazivKnjige = this.pretrazeneKnjige[0].naziv;
      console.log("pretrazene knjige");
      console.log(this.pretrazeneKnjige);
      
      if(this.pretrazeneKnjige.length===0) {
        // message
        console.log("ovde");
        this.message = "Trazena knjiga ne postoji";
      }
      else {
        console.log("ovde3");
        this.message = "";
      }
    }
  }

  // Ovde dolazim svakako, bilo da unesem neku knjigu koja postoji u bazi ili knjigu koja ne postoji u bazi

  pretrazeneKnjige : any = null;
  message : string = "";
  flag: string = "";

  prikazMenija:boolean=false;

  prikaziPadajuciMeni() {
   
    this.prikazMenija=!this.prikazMenija;
    console.log(this.prikazMenija);
  }

  prikazKnjige(k:Knjiga) {
    console.log("pretraga knjige");
    console.log(k);
    
    this.flag = "ne";

    // sacuvati flag
    localStorage.setItem('flagOdobriti', JSON.stringify(this.flag));
    // sacuvati selektovanu sliku u localStorage
    localStorage.setItem('selektovanaKnjiga', JSON.stringify(k));

    // rutirati na stranicu gde se prikazuje selektovana knjiga
    this.ruter.navigate(['/prikaz-knjige']);
  }
}
