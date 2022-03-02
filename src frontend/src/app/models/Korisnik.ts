export interface Korisnik {
    ime: string;
    prezime: string;
    username: string;
    password: string;
    grad: string;
    drzava: string;
    mail: string;
    datumRodjenja: Date;
    avatar: string,                 // url do slike, on se u bazi i cuva pod imenom avatar, a u delu za registraciju
    status: string;                 // u servisu se postavlja na file koji je prosledjen putem input polja
    stanjeAktivnosti: string;       // nakon toga se na serveru file cita iz req, to jest staza do fajla, ime fajla, ekstenzija...
    tip: string;
}                                   
