import { StringifyOptions } from 'querystring';

export interface Knjiga {
    urlSlike: string;
    naziv: string;
    autori: string[];
    datumIzdavanja: Date;
    zanr: string[];
    opis: string;
    prosecnaOcena: number;
    brojStrana: string;
    status: string;
}                                   
