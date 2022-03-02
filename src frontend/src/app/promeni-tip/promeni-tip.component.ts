import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikService } from '../korisnik.service';

@Component({
  selector: 'app-promeni-tip',
  templateUrl: './promeni-tip.component.html',
  styleUrls: ['./promeni-tip.component.css']
})
export class PromeniTipComponent implements OnInit {

  constructor(private ruter: Router, private servis: KorisnikService) { }

  displayedColumns: string[] = ['Profilna slika', 'Ime', 'Prezime', 'Username', 'Email', 'Tip', 'Promeni'];

  ngOnInit(): void {

    this.servis.sviSemAdmin().subscribe(users => {
      console.log(users);
      this.sviKorISaCekaju = users;
      let s = 0;
      for (let i = 0; i < this.sviKorISaCekaju.length; i++) {
        if (this.sviKorISaCekaju[i].status == "odobreno") {
          this.sviKor[s] = this.sviKorISaCekaju[i];
          s++;
        }
      }
      this.korNaStrani = this.sviKor.slice(0, 5);
    });
  }

  onPageChange(event) {
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.sviKor.length) {
      endIndex = this.sviKor.length
    }
    this.korNaStrani = this.sviKor.slice(startIndex, endIndex);
  }

  sviKorISaCekaju: any = [];
  sviKor: any = [];
  korNaStrani: any = [];

  prikazMenija: boolean = false;

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

  pocetnaStrana() {
    this.ruter.navigate(['/reg-kor']);
  }

  promeniTip(kor) {
    let username = kor.username;
    let trenutniTip = kor.tip;
    let menjamU;

    if (trenutniTip == "moderator") {
      menjamU = "korisnik";
    }
    else if (trenutniTip == "korisnik") {
      menjamU = "moderator";
    }

    let indeks: number = this.sviKor.indexOf(kor);
    this.servis.menjamTip(username, trenutniTip, menjamU).subscribe(user => {
      console.log(user);
      this.sviKor[indeks].tip = menjamU;
    });
  }
}
