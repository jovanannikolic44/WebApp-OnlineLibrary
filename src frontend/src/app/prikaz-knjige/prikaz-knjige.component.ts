import { Component, OnInit } from '@angular/core';
import { Knjiga } from '../models/Knjiga';
import { KorisnikService } from '../korisnik.service';
import { Zanr } from '../models/Zanr';
import { fromEventPattern } from 'rxjs';
import { Router } from '@angular/router';
import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-prikaz-knjige',
  templateUrl: './prikaz-knjige.component.html',
  styleUrls: ['./prikaz-knjige.component.css']
})
export class PrikazKnjigeComponent implements OnInit {

  constructor(private servis:KorisnikService, private ruter:Router) { }

  displayedColumns3: string[] = ['Korisnik', 'Ocena', 'Komentar'];

  ngOnInit(): void {
    if(localStorage.getItem('selektovanaKnjiga')==null) {
      this.knjigaZaPrikaz = null;
      console.log("Nema nista u LS-u");
    }
    else {

      this.odobriti = JSON.parse(localStorage.getItem('flagOdobriti'));
      console.log("ODOBRITI");
      console.log(this.odobriti);
      // IZ REG KOR I IZ GOST MORAM U LS STAVITI NE
      this.knjigaZaPrikaz = JSON.parse(localStorage.getItem('selektovanaKnjiga'));


      this.ulogovanKorisnik = JSON.parse(localStorage.getItem('korisnikUlogovan'));
      this.servis.nadjiTip(this.ulogovanKorisnik).subscribe(tip=>{
        console.log("TIP U PRIKAZ KNJIGE");
        console.log(tip);
        this.tipUlogovanogKorisnika = tip;
        // za gosta vraca poruku da takav korisnik ne postoji u bazi
      });
     
      if(this.odobriti=="ne") {
        if(this.ulogovanKorisnik==="gost") {
          // Prosecna ocena zaokruzena na dve decimale
          this.prosecnaOcenaDveDec = this.knjigaZaPrikaz.prosecnaOcena.toFixed(2);
          console.log("LEPO PROSECNA OCENA GOST");
          console.log(this.prosecnaOcenaDveDec);
          this.knjigaZaPrikaz.prosecnaOcena = this.prosecnaOcenaDveDec;
          this.datumDate = new Date(this.knjigaZaPrikaz.datumIzdavanja);
          this.datumIzdavanja = this.datumDate.toLocaleDateString();
        }
        else {
          this.prosecnaOcenaDveDec = this.knjigaZaPrikaz.idKnjige.prosecnaOcena.toFixed(2);
          console.log("LEPO PROSECNA OCENA KORISNIK");
          console.log(this.prosecnaOcenaDveDec);
          this.knjigaZaPrikaz.idKnjige.prosecnaOcena = this.prosecnaOcenaDveDec;
          this.datumDate = new Date(this.knjigaZaPrikaz.idKnjige.datumIzdavanja);
          this.datumIzdavanja = this.datumDate.toLocaleDateString();


        }

        let length = this.knjigaZaPrikaz.idZanra.length;

        console.log("Knjiga za prikaz");
        console.log(this.knjigaZaPrikaz);
      
        for(let i = 0; i<length; i++) {
          this.nadjeniZanrovi[i] = this.knjigaZaPrikaz.idZanra[i].zanr;
          console.log("NADJENI ZANROVI");
          console.log(this.nadjeniZanrovi);
        }

        this.spojeniZanrovi = this.nadjeniZanrovi.join(',');
        console.log("SPOJENI ZANROVI");
        console.log(this.spojeniZanrovi);

        // dohvatiti komentare nad trazenom knjigom
        if(this.ulogovanKorisnik==="gost") {
          this.servis.komentariNaKnjigu(this.knjigaZaPrikaz._id).subscribe(kom => {
            this.komentari = kom;
            this.length = this.komentari.length;
            this.koment = this.komentari.slice(0,5);
          });
        }
        else {
          // ako je korisnik drugacije se pristupa id-ju, zavisi od toga kako sam prosledila knjigu u LocalStorage
          this.servis.komentariNaKnjigu(this.knjigaZaPrikaz.idKnjige._id).subscribe(kom => {
            this.komentari = kom;
            this.length = this.komentari.length;
            this.koment = this.komentari.slice(0,5);
          });
        }
      
        if(this.knjigaZaPrikaz == null) {
          // message
        this.message = "Trazena knjiga ne postoji";
        }
        else {
          this.message = "";
        }
      }

      else if(this.odobriti=="prikazi") {
        this.datumDate = new Date(this.knjigaZaPrikaz.datumIzdavanja);
        this.datumIzdavanja = this.datumDate.toLocaleDateString();

        let length = this.knjigaZaPrikaz.idZanra.length;
        for(let i = 0; i<length; i++) {
          this.nadjeniZanrovi[i] = this.knjigaZaPrikaz.idZanra[i].zanr;
          console.log("NADJENI ZANROVI");
          console.log(this.nadjeniZanrovi);
          this.spojeniZanrovi = this.nadjeniZanrovi.join(',');

          this.servis.komentariNaKnjigu(this.knjigaZaPrikaz._id).subscribe(kom => {
            this.komentari = kom;
            this.length = this.komentari.length;
            this.koment = this.komentari.slice(0,2);
          });
        }
      }
    }
  }


  onPageChange4(event) {
    console.log("Page event");
    console.log(event);
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.komentari.length) {
      // ako je endIndex veci od duzine celog mog niza sa podacima
      endIndex = this.komentari.length
    }
    this.koment = this.komentari.slice(startIndex, endIndex);
  }
  
  onPageChange5(event) {
    console.log("Page event");
    console.log(event);
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.komentari.length) {
      // ako je endIndex veci od duzine celog mog niza sa podacima
      endIndex = this.komentari.length
    }
    this.koment = this.komentari.slice(startIndex, endIndex);
  }


  prosecnaOcenaDveDec : string = "";

  koment: any = [];
  tipUlogovanogKorisnika: any = [];
  odobriti: string = "";
  knjigaZaPrikaz: any = null;
  datumIzdavanja: String = "";
  datumDate: Date = null;
  nadjeniZanrovi: string[] = [];
  komentari: any = "";
  length: number = 0;
  ulogovanKorisnik: any = [];
  message: string = "";
  statusCitanja: boolean = false;
  statusCitanjaTrCita: boolean = false;
  brProcitanihStrana: string = "";
  stigaoJeDo: any = [];
  naListu: boolean = false;
  saListe: boolean = false;
  textAreaVal: string = "";
  prosecnaOcena: string = "";
  spojeniZanrovi: string = "";

  prikazMenija:boolean=false;

  prikaziPadajuciMeni() {
   
    this.prikazMenija=!this.prikazMenija;
    console.log(this.prikazMenija);
  }

  logOut() {
    console.log("zove log out");
    this.ruter.navigate(['/login']);
    let datum = Date.now();
    let datumDate = new Date(datum);
    let format = datumDate.toLocaleString();
    this.servis.updateStatusaKorisnika(this.ulogovanKorisnik, format).subscribe(upd => {
      console.log(upd);
    });
  }

  nazad() {
    console.log(this.knjigaZaPrikaz.idKor);
    this.ruter.navigate(['/reg-kor']);
  }

  citanje() {
    this.message2 = "";
    // dohvata cekiran status (true ili false)
    let elem = <HTMLInputElement> document.getElementById("naL");
    this.statusCitanja = elem.checked;
    console.log("zove za azuriranje procitao");

    if(this.statusCitanja == false) {
      console.log("Status je false");
      // nije dirao checkbox, pa ne treba nista ni da menjam
    }
    else if(this.statusCitanja == true) {
      
      this.servis.dohvatiId(this.ulogovanKorisnik).subscribe(korId=>{
        this.servis.azurirajProcitane(korId, this.knjigaZaPrikaz.idKnjige._id, this.knjigaZaPrikaz.idKnjige.brStrana, 
          this.knjigaZaPrikaz.idZanra).subscribe(statusi=>{
            console.log(statusi);
        });
      });
    }
  }

  citanje2() {
    this.message2 = "";
    let elem = <HTMLInputElement> document.getElementById("saL");
    this.statusCitanjaTrCita = elem.checked;

    // treba dohvatiti i broj procitanih strana

    if(this.statusCitanjaTrCita == false) {
      console.log("Status je false");
    }
    else {
      // Kada uradim nazad vrati null za idKnjige.. 
      console.log("broj pr str front");
      console.log(this.brProcitanihStrana);
      this.servis.dohvatiId(this.ulogovanKorisnik).subscribe(korId=>{
        this.servis.azurirajTrCitam(korId, this.knjigaZaPrikaz.idKnjige._id, this.knjigaZaPrikaz.idZanra).subscribe(azu=>{
          console.log("nakon azuriranja");
          console.log(azu);
          this.servis.stigaoJeDoStrane(this.knjigaZaPrikaz.idKnjige._id, korId).subscribe(st=>{
            console.log("nakon stigaoJeDo");
            console.log(st);
            this.stigaoJeDo = st;
          });
        });
      });
    }
    // samo postavlja na true, da bi mogao da prikaze formu za unos broja strana*/
  }

  realFunc() {
    this.message2 = "";
    console.log("pozvana");
    // dohvatam broj procitanih strana
    let elem = <HTMLInputElement> document.getElementById("tekst");
    this.brProcitanihStrana = elem.value;

    console.log("broj procitanih strana koji se prosledjuje serveru");
    console.log(this.brProcitanihStrana);
    console.log("stigao je do");
    console.log(this.stigaoJeDo);
    this.servis.dohvatiId(this.ulogovanKorisnik).subscribe(korId=>{
      this.servis.azurirajBrProc(korId, this.knjigaZaPrikaz.idKnjige._id, this.brProcitanihStrana).subscribe(statusi=>{
          console.log(statusi);
          this.stigaoJeDo = this.brProcitanihStrana;
      });
    });
  }

  staviNaListu() {
    this.message2 = "";
    let elem = <HTMLInputElement> document.getElementById("cekboks");
    this.naListu = elem.checked;

    if(this.naListu == true) {
      this.servis.dohvatiId(this.ulogovanKorisnik).subscribe(korId=>{
        this.servis.dodajNaListu(korId, this.knjigaZaPrikaz.idKnjige._id, 
          this.knjigaZaPrikaz.idZanra).subscribe(st=>{
            console.log(st);
        });
      });
    }
  }

  obrisiSaListe() {
    this.message2 = "";
    //this.servis.dohvatiId(this.ulogovanKorisnik).subscribe(korId=>{
    console.log("obrisi sa liste");
    let elem = <HTMLInputElement> document.getElementById("cekboks2");
    this.saListe = elem.checked;

    if(this.saListe==true) {
      this.servis.dohvatiId(this.ulogovanKorisnik).subscribe(korId=>{
        this.servis.obrisiSaListe(korId, this.knjigaZaPrikaz.idKnjige._id).subscribe(st=>{
            console.log(st);
        });
      });
    }
  }

  cnt: number = 0;
  arrayOfChars: string[] = [];       // sadrzi komentar kao string
  comment: string = "";
  message2: string = "";
  flag: boolean = false;


  textA() {
    // hvata svaki karakter. Jedna rec je dok ne dodje space
    // Svaki put kada se pritisne space, pravi se nov element niza (jer se split radi po space)
    // Broj reci odgovara broju elemenata niza
    // Funkcija za proveru duzine reci

    let elem2 = <HTMLInputElement> document.getElementById("TA");
    this.arrayOfChars = elem2.value.split(' ');
    this.cnt = this.arrayOfChars.length;
    if(this.cnt > 1001) {
      console.log("Uneto je 1000 reci");
    }
    else {
      this.cnt++;
    }
  }

  // ovo sve sme da radi SAMO ULOGOVANI KORISNIK
  unesiKom() {
    this.message2 = "";
    // pod uslovom da SME da unese komentar
    let polaKnjige = this.knjigaZaPrikaz.idKnjige.brStrana/2;
    this.servis.dohvatiId(this.ulogovanKorisnik).subscribe(korId=>{
    this.servis.stigaoJeDoStrane(this.knjigaZaPrikaz.idKnjige._id, korId).subscribe(st=>{
      // console.log(st);
        this.stigaoJeDo = st;
        console.log("Stigao je dovde (do strane):");
        console.log(this.stigaoJeDo);

        // ako ju je nekada ranije procitao, a cita je opet trenutno, on bi smeo da komentarise..
        // ako se nalazi u nizu procitanih
        let procitaneKnjige = JSON.parse(localStorage.getItem('procitane'));
        
        for(let m = 0; m<procitaneKnjige.length; m++) {
          if(this.knjigaZaPrikaz.idKnjige._id == procitaneKnjige[m].idKnjige._id) {
            this.flag = true;
            // vec ju je ranije procitao
            console.log("flag na true");
          }
        }
    
       
        if(this.stigaoJeDo >= polaKnjige || this.flag) {
          // moze da ostavi komentar
          // dohvata komentar kao string
          let elem = <HTMLInputElement> document.getElementById("TA");
          this.comment = elem.value;
        // console.log(this.comment);
          
          // ako ne unese ni ocenu ni komentar i pritisne unesi, ne radi nista sa tim!
          if(this.comment=="" && this.selectedNumber==undefined) {
            this.message2 = "Niste uneli komentar ni ocenu";
            return;
          }
          else if(this.comment!="" && this.selectedNumber==undefined) {
            // nije uneo ocenu
            this.selectedNumber = 0;        // nema ocene
          }
          else if(this.comment=="" && this.selectedNumber) {
            // nije uneo komentar
            this.comment = "Nema komentara";
          }

          console.log("SALJEM SA SERVER");
          console.log(this.knjigaZaPrikaz.idKnjige._id);
          console.log(this.comment);
          console.log(this.selectedNumber);
          console.log(this.knjigaZaPrikaz.idZanra);
          this.servis.dodajKomentare(this.knjigaZaPrikaz.idKnjige._id, korId, this.comment, this.selectedNumber,
            this.knjigaZaPrikaz.idZanra).subscribe(s=>{
            this.komentari = s;
            console.log("this.komentari");          // dodaj komentare nema populate idKor
            console.log(s);

            this.servis.dohvatiKnjigu(this.knjigaZaPrikaz.idKnjige).subscribe(k=>{
              //console.log("k");
              //console.log(k);
              let newSmth : any = k;
              //console.log(newSmth.prosecnaOcena);
              this.knjigaZaPrikaz.idKnjige.prosecnaOcena = newSmth.prosecnaOcena;
              //console.log(this.knjigaZaPrikaz.idKnjige.prosecnaOcena);

              // POSTO NIJE OBICNA TABELA
              window.location.reload();

              // cuva se promena u LS zbog refresh
              localStorage.setItem('selektovanaKnjiga', JSON.stringify(this.knjigaZaPrikaz));
            });
          });
      }
      else {
        this.message2 = "Niste procitali dovoljno knjige da biste ostavili komentar";
      }
    });
  });
}

  message3: string = "";

  // ZVEZDICE
  zvezde: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedNumber: number;

  izbrojZvezde(obelezeno) {
    this.selectedNumber = obelezeno;
    //console.log("Broj zvezdica", this.selectedNumber);
  }

  izmeniKomentar(p) {
    console.log(p);
    console.log(this.comment);
    console.log(this.selectedNumber);
    // Ako klikne izmeni komentar, a nije ga on ostavio, onda ne moze da ga menja
    // 1. idKor ne moze da menja komentar od idKor2
    // 2. Cim je ostavio komentar znaci da je tu knjigu procitao i moze da ga izmeni, ne treba provera toga
    // 3. moze da menja ocenu ili tekst komentara
  }

  naProfil(komKor) {
    console.log("profil");
    console.log(komKor.idKor);
    // ako idem kliknem na svoj komentar idem na svoj profil gde mogu da menjam sifre
    if(komKor.idKor.username == this.ulogovanKorisnik) {
      this.ruter.navigate(['/reg-kor']);
    }
    else {
      // ako idem na tudji profil
      localStorage.setItem('naProfilIdem', JSON.stringify(komKor.idKor));
      this.ruter.navigate(['/profili']);
    }

  }

  nazadNaOdb() {
    this.ruter.navigate(['/odobri-knjigu']);
  }

  nazadNaIzm() {
    this.ruter.navigate(['/izmeniK']);
  }
}
