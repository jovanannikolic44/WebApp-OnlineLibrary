export interface Korisnik {
    ime: string;
    prezime: string;
    username: string;
    password: string;
    grad: string;
    drzava: string;
    mail: string;
    datumRodjenja: Date;
    avatar: string,                 // url to the image
    status: string;
    stanjeAktivnosti: string;
    tip: string;
}                                   
