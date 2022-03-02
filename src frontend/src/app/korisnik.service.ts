import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Korisnik } from './models/Korisnik';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';
import { Knjiga } from './models/Knjiga';

@Injectable({
  providedIn: 'root'
})
export class KorisnikService {

  uri = 'http://localhost:4000';

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }


  registracija(imeKor: string, prezimeKor: string, usernameKor: string, passwordKor: string, gradKor: string, drzavaKor: string,
  email: string, datumRodjenjaKor: Date, slikaProfila: File, statusKor: string, captchaResponse: any) : Observable<any> {
    var datestr = (new Date(datumRodjenjaKor)).toUTCString();
  
    // datum se prosledjuje kao String ka serveru

    var formData: any = new FormData();
    formData.append("ime", imeKor);
    formData.append("prezime", prezimeKor);
    formData.append("username", usernameKor);
    formData.append("password", passwordKor);
    formData.append("grad", gradKor);
    formData.append("drzava", drzavaKor);
    formData.append("mail", email);
    formData.append("datumRodjenja", datestr);
    formData.append("status", statusKor);
    formData.append("captcha", captchaResponse);
    formData.append("avatar", slikaProfila);
    
  
    return this.http.post<Korisnik>(`${this.uri}/registracija`, formData);
  }

  prijava(username, password){
    const korZaPrijavu = {
      username: username,
      password: password
    };

    return this.http.post(`${this.uri}/login`, korZaPrijavu);
  }

  promeniLozinku(passwordOld, passwordNew) {
    // request koji se prosledjuje ka serveru
    const zaPromenu = {
      password1: passwordOld,
      password: passwordNew
    };

    console.log('promeniLozinku u servisu');
    return this.http.post(`${this.uri}/promenaLozinke`, zaPromenu);
  }

  dohvatiSveZanroveUSistemu() : Observable<string[]> {
    return this.http.get<string[]>(`${this.uri}/sviZanrovi`);
  }

  dohvatiSvaJavnaDesavanjaUSistemu() : Observable<string[]> {
    // dohvata sva javna AKTIVNA i BUDUCA desavanja
    return this.http.get<string[]>(`${this.uri}/svaDesavanja`);
  }

  pretrazeneKnjige(nazivKnjige: string, unetZanr: string[], autorKnjige: string[]) {
    // u req proveriti da li je nesto od toga nije uneto
    const formaRequesta = {
      nazivKnjige: nazivKnjige,            // ovo moze biti naziv knjige ili naziv autora ili njihov deo
      zanrKnjige: unetZanr,
      autorKnjige: autorKnjige
    }
    return this.http.post(`${this.uri}/pretragaKnjige`, formaRequesta);
  }

  komentariNaKnjigu(id: any) {
    console.log(id);
    const formaRequesta = {
      idSaljem: id
    }

    return this.http.post(`${this.uri}/komentariNaKnjigu`, formaRequesta);
  }
  
  dohvatiOvogKorisnika(username: string) {
    const formaRequesta = {
      usernameKor: username
    }

    return this.http.post(`${this.uri}/ovajKorisnik`, formaRequesta);
  }

  promeniIme(username: string, ime: string) {
    const formaRequesta = {
      usernameKor: username,
      novoIme: ime
    }

    return this.http.post(`${this.uri}/promeniIme`, formaRequesta);
  }

  promeniPrezime(username: string, prezime: string) {
    const formaRequesta = {
      usernameKor: username,
      novoPrezime: prezime
    }

    return this.http.post(`${this.uri}/promeniPrezime`, formaRequesta);
  }

  promeniDrzavu(username: string, drzava: string) {
    const formaRequesta = {
      usernameKor: username,
      novaDrzava: drzava
    }

    return this.http.post(`${this.uri}/promeniDrzavu`, formaRequesta);
  }

  promeniGrad(username: string, grad: string) {
    const formaRequesta = {
      usernameKor: username,
      novGrad: grad
    }

    return this.http.post(`${this.uri}/promeniGrad`, formaRequesta);
  }

  promeniMail(username: string, mail: string) {
    const formaRequesta = {
      usernameKor: username,
      novMail: mail
    }

    return this.http.post(`${this.uri}/promeniMail`, formaRequesta);
  }

  promeniDatumRodjenja(username: string, datumRodjenjaKor: Date) {
    var datestr = (new Date(datumRodjenjaKor)).toUTCString();
    const formaRequesta = {
      usernameKor: username,
      novDatumRodjenja: datestr
    }

    return this.http.post(`${this.uri}/promeniDatumRodjenja`, formaRequesta);
  }

  promeniProfilnuSliku(username: string, slika: File) {
    var formData: any = new FormData();

    formData.append("username", username);
    formData.append("avatar", slika);

    return this.http.post(`${this.uri}/promeniProfilnuSliku`, formData);
  }

  dohvatiProcitaneKnjige(username: string) {
    const formaRequesta = {
      usernameKor: username
    }

    return this.http.post(`${this.uri}/procitaneKnjige`, formaRequesta);
  }

  dohvatiTrenutnoSeCitaju(username: string) {
    const formaRequesta = {
      usernameKor: username
    }

    return this.http.post(`${this.uri}/citajuSeKnjige`, formaRequesta);
  }

  dohvatiNaListi(username: string) {
    const formaRequesta = {
      usernameKor: username
    }

    return this.http.post(`${this.uri}/naListi`, formaRequesta);
  }

  dohvatiSveKomentare(username: string) {
    const formaRequesta = {
      usernameKor: username
    }

    return this.http.post(`${this.uri}/koms`, formaRequesta);
  }

  updateStatusaKorisnika(username: string, date: string) {
    const formaRequesta = {
      usernameKor: username,
      datum: date
    }
    return this.http.post(`${this.uri}/status`, formaRequesta);
  }

  azurirajProcitane(idKorisnika, idKnj, brStr, zanr) {
    const formaRequesta = {
      idKor: idKorisnika,
      idKnjige: idKnj,
      brStrana: brStr,
      zanrovi: zanr
    }

    return this.http.post(`${this.uri}/azurirajProcitane`, formaRequesta);
  }

  azurirajTrCitam(idKorisnika, idKnj, zanr) {
    const formaRequesta = {
      idKor: idKorisnika,
      idKnjige: idKnj,
      zanrovi: zanr
    }

    return this.http.post(`${this.uri}/azurirajTrCitam`, formaRequesta);
  }

  stigaoJeDoStrane(idKnj, idKorisnika) {
    const formaRequesta = {
      idKor: idKorisnika,
      idKnjige: idKnj
    }
    return this.http.post(`${this.uri}/stigaoJeDoStrane`, formaRequesta);
  }

  dodajNaListu(idKorisnika, idKnj, zanr) {
    const formaRequesta = {
      idKor: idKorisnika,
      idKnjige: idKnj,
      zanrovi: zanr
    }
    return this.http.post(`${this.uri}/dodajNaListu`, formaRequesta);
  }

  dodajKomentare(idKnj, idKorisnika, koment, oc, zanr) {
    const formaRequesta = {
      idKor: idKorisnika,
      idKnjige: idKnj,
      zanrovi: zanr,
      komentar: koment,
      ocena: oc
    }
    return this.http.post(`${this.uri}/dodajKomentare`, formaRequesta);
  }

  dohvatiKnjigu(idKnj) {
    const formaRequesta = {
      idKnjige: idKnj
    }
    return this.http.post(`${this.uri}/dohvatiKnjigu`, formaRequesta);
  }

  dohvatiId(username) {
    const formaRequesta = {
      usernameKor: username
    }
    return this.http.post(`${this.uri}/dohvatiId`, formaRequesta);
  }

  azurirajBrProc(idKorisnika, idKnj, brStr) {
    const formaRequesta = {
      idKor: idKorisnika,
      idKnjige: idKnj,
      brStrana: brStr
    }
    return this.http.post(`${this.uri}/azurirajBrProc`, formaRequesta);
  }

  obrisiSaListe(idKorisnika, idKnj) {
    const formaRequesta = {
      idKor: idKorisnika,
      idKnjige: idKnj,
    }
    return this.http.post(`${this.uri}/obrisiSaListe`, formaRequesta);
  }

  dodajKnjigu(naziv:string, autori:string[], datumIzdavanja:Date, zanrovi:any, brStr:string, opis:string, slika:File, status:string) {
    var datestr = (new Date(datumIzdavanja)).toUTCString();
  
    console.log("zanrovi");
    console.log(zanrovi);
    var formData: any = new FormData();
    formData.append("naziv", naziv);
    formData.append("autori", autori);
    formData.append("zanrovi", zanrovi);
    formData.append("brStr", brStr);
    formData.append("opis", opis);
    formData.append("datumIzdavanja", datestr);
    formData.append("status", status);
    formData.append("urlSlike", slika);
    
  
    return this.http.post<Korisnik>(`${this.uri}/dodajKnjigu`, formData);
  }

  idZanr(zanrovi: string[]) {
    const formaRequesta = {
      zanrovi: zanrovi
    }
    return this.http.post(`${this.uri}/idZanr`, formaRequesta);
  }

  nadjiTip(username: string) {
    const formaRequesta = {
      usernameKor: username
    }
    return this.http.post(`${this.uri}/nadjiTip`, formaRequesta);
  }

  sveKnjigeNaCekanju() {
    return this.http.get(`${this.uri}/sveKnjigeNaCekanju`);
  }

  odobriKnjigu(idKnjige) {
    const formaRequesta = {
      idKnj: idKnjige
    }
    return this.http.post(`${this.uri}/odobriKnjigu`, formaRequesta);
  }

  korisniciCekaju() {
    return this.http.get(`${this.uri}/korisniciCekaju`);
  }

  odobriKorisnika(username) {
    const formaRequesta = {
      usernameKor: username
    }
    return this.http.post(`${this.uri}/odobriKorisnika`, formaRequesta);
  }

  sviSemAdmin() {
    return this.http.get(`${this.uri}/sviSemAdmin`);
  }

  menjamTip(username, trenutniTip, menjamU) {
    const formaRequesta = {
      usernameKor: username,
      trenutniTip: trenutniTip,
      menjamU: menjamU
    }
    return this.http.post(`${this.uri}/menjamTip`, formaRequesta);
  }

  odobreneKnjige() {
    return this.http.get(`${this.uri}/odobreneKnjige`);
  }

  promeniNazivKnjige(idKnj, novNaziv) {
    const formaRequesta = {
      idKnjige: idKnj,
      novNazivKnj: novNaziv
    }
    return this.http.post(`${this.uri}/promeniNazivKnjige`, formaRequesta);
  }

  promeniAutore(idKnj, autori) {
    const formaRequesta = {
      idKnjige: idKnj,
      noviAutori: autori
    }
    return this.http.post(`${this.uri}/promeniAutore`, formaRequesta);
  }

  promeniOpis(idKnj, opis) {
    const formaRequesta = {
      idKnjige: idKnj,
      novOpis: opis
    }
    return this.http.post(`${this.uri}/promeniOpis`, formaRequesta);
  }

  promeniBrStr(idKnj, brStr) {
    const formaRequesta = {
      idKnjige: idKnj,
      novBrStr: brStr
    }
    return this.http.post(`${this.uri}/promeniBrStr`, formaRequesta);
  }

  promeniZanrove(idKnj, idZ) {
    const formaRequesta = {
      idKnjige: idKnj,
      idZ: idZ
    }
    return this.http.post(`${this.uri}/promeniZanrove`, formaRequesta);
  }

  promeniDatumIzdavanja(idKnj, datum) {
    var datestr = (new Date(datum)).toUTCString();
    const formaRequesta = {
      idKnjige: idKnj,
      novDatum: datestr
    }

    return this.http.post(`${this.uri}/promeniDatumIzdavanja`, formaRequesta);
  }

  promeniNaslovnuStranu(idKnj, slika:File) {
    var formData: any = new FormData();

    formData.append("_id", idKnj);
    formData.append("urlSlike", slika);

    return this.http.post(`${this.uri}/promeniNaslovnuStranu`, formData);
  }

  dodajZanr(zanr: string) {
    const formaRequesta = {
      zanr: zanr,
    }
    return this.http.post(`${this.uri}/dodajZanr`, formaRequesta);
  }

  dohvatiSveKnjige() {
    return this.http.get(`${this.uri}/sveKnjige`);
  }

  obrisiZanr(zanr: string) {
    const formaRequesta = {
      zanr: zanr,
    }
    return this.http.post(`${this.uri}/obrisiZanr`, formaRequesta);
  }
}
