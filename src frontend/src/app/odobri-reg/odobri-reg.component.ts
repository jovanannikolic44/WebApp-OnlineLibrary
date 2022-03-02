import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikService } from '../korisnik.service';

@Component({
  selector: 'app-odobri-reg',
  templateUrl: './odobri-reg.component.html',
  styleUrls: ['./odobri-reg.component.css']
})
export class OdobriRegComponent implements OnInit {

  constructor(private ruter:Router, private servis:KorisnikService) { }

  displayedColumns: string[] = ['Profilna slika', 'Ime', 'Prezime', 'Username', 'Email', 'Grad', 'Datum rodjenja', 'Odobri'];

  ngOnInit(): void {

    this.servis.korisniciCekaju().subscribe(kor=>{
      console.log(kor);
      this.sviKor = kor;

      for(let i =0; i<this.sviKor.length; i++) {
        this.datumDate = new Date(this.sviKor[i].datumRodjenja);
        this.datumString = this.datumDate.toLocaleDateString();
        this.sviKor[i].datumRodjenja = this.datumString;
      }
      this.korNaStrani = this.sviKor.slice(0, 5);
    });
  }

  onPageChange(event) {
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.sviKor.length) {
      endIndex = this.sviKor.length
    }
    this.korNaStrani = this.sviKor.slice(startIndex, endIndex);
  }

  sviKor: any = [];
  korNaStrani: any = [];
  prikazMenija:boolean=false;
  datumDate: Date = null;
  datumString: string = "";


  prikaziPadajuciMeni() {
   
    this.prikazMenija=!this.prikazMenija;
    console.log(this.prikazMenija);
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

  odobri(kor) {
    console.log(kor);
   
    console.log("id knjige koja se odobrava");
    

    let indeks: number = this.sviKor.indexOf(kor);
    console.log(indeks);
    console.log(kor.username);

    this.servis.odobriKorisnika(kor.username).subscribe(yes=>{
      console.log(yes);
      this.sviKor.splice(indeks, 1);
      window.location.reload();
    });
  }
}
