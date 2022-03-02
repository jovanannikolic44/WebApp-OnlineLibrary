import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { KorisnikService } from '../korisnik.service';

@Component({
  selector: 'app-izmeni-knjigu',
  templateUrl: './izmeni-knjigu.component.html',
  styleUrls: ['./izmeni-knjigu.component.css']
})
export class IzmeniKnjiguComponent implements OnInit {

  constructor(private servis:KorisnikService, private ruter:Router, public fb: FormBuilder) { }

  displayedColumns: string[] = ['Slika','Naziv', 'Autori', 'Datum', 'Opis', 'Zanr', 'BrStr'];

  ngOnInit(): void {

    this.servis.odobreneKnjige().subscribe(books=>{
      console.log(books);
      this.sveKnjige = books;
      this.knjigeNaStrani = this.sveKnjige.slice(0,5);
      console.log("knjige na strani");
      console.log(this.knjigeNaStrani);
     
    }); 
  
    this.servis.dohvatiSveZanroveUSistemu().subscribe(genre=>{
      this.sviZanrovi = genre;
    });

    this.form = this.fb.group({
      nazivKnjige: [''],
      autori: [''],
      datumIzdavanja: [null],
      urlSlike: [null],
      status: [''],
      brStrana: [''],
      zanrovi: [null],
      opis: [''],
    });
  }


  sveKnjige: any = [];
  knjigeNaStrani: any = [];
  knjigaZaIzmenu: any = null;
  flag: boolean;
  sviZanrovi: any = [];
  zanroviKnjiga: any = [];
 
  slika: File = null;
  nazivKnjige: string;
  autori: string;
  autoriStr: string[] = [];
  datumIzdavanja: Date;
  zanrovi: string[];
  brStrana: string;
  opis: string;
  message: string = "";
  form: FormGroup;

  prikazMenija:boolean=false;

  prikaziPadajuciMeni() {
   
    this.prikazMenija=!this.prikazMenija;
    console.log(this.prikazMenija);
  }

  

  uploadFile(event) {
    const file = event.target.files[0];
    this.slika = file;

    console.log(this.slika);
  
    this.form.patchValue({
      urlSlike: file
    });
    this.form.get('urlSlike').updateValueAndValidity();
    console.log("upload file deo");
    console.log(this.form.get('urlSlike').value);
    
  }

  izmeni() {

    // ako zanr nije unet ne treba da proverama njegov length
    if(this.zanrovi) {
      console.log("usao jer je unet zanr");
      let lengthOfZanrovi = this.zanrovi.length;
      if(lengthOfZanrovi>3) {
        this.message="Dozvoljeno je uneti maksimalno tri zanra";
        return;
      }
    }
      this.message="";
      console.log("else");

      // moze izabrati samo postojecu knjigu tako da tu nema ogranicenja
      // ovo se poziva nakon sto je izabrao
      // ne mora uneti sva polja, menjaju se samo ona koja je uneo

      console.log(this.nazivKnjige);
      console.log(this.autori);
      console.log(this.brStrana);
      console.log(this.datumIzdavanja);
      console.log(this.slika);
      console.log(this.zanrovi);
      console.log(this.opis);
      console.log(this.knjigaZaIzmenu);
      console.log(this.knjigaZaIzmenu._id);

      let idKnjige = this.knjigaZaIzmenu._id;
      // dohvatam indeks knjige za izmenu
      let indeks: number = this.sveKnjige.indexOf(this.knjigaZaIzmenu);

      // ako je unet naziv knjige radi se update njega
      if(this.nazivKnjige) {
        // ako zeli da promeni ime
        this.servis.promeniNazivKnjige(idKnjige, this.nazivKnjige).subscribe(ime => {
          console.log('gotovo1');
          console.log(ime);
          let nazivKnj :any = ime;
          this.sveKnjige[indeks].naziv = nazivKnj.naziv;
          this.nazivKnjige = "";
        });
      }
      if(this.autori) {
        // saljem kao string, na serveru pretvaram u niz stringova
        this.servis.promeniAutore(idKnjige, this.autori).subscribe(autori => {
          console.log('gotovo2');
          console.log(autori);
          let nazivKnj :any = autori;
          this.sveKnjige[indeks].autori = nazivKnj.autori;
          this.autori = "";
        });
      }
      if(this.opis) {
        this.servis.promeniOpis(idKnjige, this.opis).subscribe(opis => {
          console.log('gotovo3');
          console.log(opis);
          let nazivKnj :any = opis;
          this.sveKnjige[indeks].opis = nazivKnj.opis;
          this.opis = "";
        });
      }
      if(this.brStrana) {
        this.servis.promeniBrStr(idKnjige, this.brStrana).subscribe(brstr => {
          console.log('gotovo4');
          console.log(brstr);
          let nazivKnj :any = brstr;
          this.sveKnjige[indeks].brStrana = nazivKnj.brStrana;
          this.brStrana = "";
        });
      }
      if(this.zanrovi) {
          this.servis.idZanr(this.zanrovi).subscribe(z=>{
            console.log(z);     // dohvata id-jeve zanrova, i njih prosledjujem
            this.servis.promeniZanrove(idKnjige, z).subscribe(knj=>{
                console.log("nakon poziva servisa");
                console.log(knj);
                let nazivKnj:any = knj;
                console.log("zanr");
                console.log(this.zanrovi);
                this.sveKnjige[indeks].idZanra = nazivKnj.idZanra;
                this.zanrovi = [];
            });
          });
      }
      if(this.datumIzdavanja) {
        this.servis.promeniDatumIzdavanja(idKnjige, this.datumIzdavanja).subscribe(datum => {
          console.log('gotovo6');
          console.log(datum);
          let nazivKnj:any = datum;
          this.sveKnjige[indeks].datumIzdavanja = nazivKnj.datumIzdavanja;
          this.datumIzdavanja = null;
        });
      }
      if(this.slika) {
        console.log("slika front");
        console.log(this.form.value.urlSlike);
        this.servis.promeniNaslovnuStranu(idKnjige, this.form.value.urlSlike).subscribe(slika => {
          console.log('gotovo7');
          console.log(slika);
          console.log("nasovna strana");
          console.log(this.form.value.urlSlike);
          let nazivKnj:any = slika;
          this.sveKnjige[indeks].urlSlike = nazivKnj.urlSlike;
          this.slika = null;
        });
      }
  }

      // dohvati id knjige koju zelim da menjam

      // ovde imam niz stringova, this.autori je string
      /*this.autoriStr = this.autori.split(',');
      this.status = "cekanje";
      


      // OGRANICENJA AKO NEKA POLJA NISU UNETA

      this.servis.idZanr(this.zanrovi).subscribe(z=>{
        console.log(z);
        this.servis.dodajKnjigu(this.nazivKnjige, this.autoriStr, this.datumIzdavanja, z, this.brStrana, this.opis, 
          this.form.value.urlSlike, this.status).subscribe(knj=>{
            console.log("nakon poziva servisa");
            console.log(knj);
        });
      });*/

  


  
  pocetnaStrana() {
    this.ruter.navigate(['/reg-kor']);
  }

  logOut() {
    this.ruter.navigate(['/login']);
    let datum = Date.now();
    let datumDate = new Date(datum);
    let format = datumDate.toLocaleString();
    let ulogovan = JSON.parse(localStorage.getItem('korisnikUlogovan'));
    console.log(ulogovan);
    this.servis.updateStatusaKorisnika(ulogovan, format).subscribe(upd => {
      console.log(upd);
    });
  }

  f(izmenaSeDesava) {
    console.log("funkcija");

    console.log(izmenaSeDesava);
    this.knjigaZaIzmenu = izmenaSeDesava;
    this.flag = true;
  }

  flag2: string = "";

  prikazKnjige(k) {
    console.log("pretraga knjige");
    console.log(k);
    
    this.flag2 = "prikazi";

    // sacuvati flag
    localStorage.setItem('flagOdobriti', JSON.stringify(this.flag2));

    // sacuvati selektovanu sliku u localStorage
    localStorage.setItem('selektovanaKnjiga', JSON.stringify(k));

    // rutirati na stranicu gde se prikazuje selektovana knjiga
    this.ruter.navigate(['/prikaz-knjige']);
  }
}
