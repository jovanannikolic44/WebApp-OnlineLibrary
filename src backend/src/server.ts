import express, { Request, json } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import  axios,{ AxiosResponse } from 'axios'


import Genre from './models/genre';
import User from './models/user';
import Book from './models/book';
import Comment from './models/comment';
import Meeting from './models/meeting';
import Status from './models/status';
import { toASCII } from 'punycode';
import { Console } from 'console';
import { Stats } from 'fs';
import user from './models/user';


const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/baza');

const connection = mongoose.connection;

connection.once('open', ()=>{
    console.log('mongo open');
})

const router = express.Router();



router.route('/login').post((req, res)=>{
    console.log('prijava server');
        
    let usernameR = req.body.username;
    let password = req.body.password;
    console.log(usernameR);
    
    // Svi korisnici sa statusom odobreno
    /*User.find({status:"odobreno"}, (err, user)=>{
        console.log(user);
    });*/
    
    User.findOne({'username':usernameR, 'password':password},
    (err,user)=>{
        if(err) {
            console.log("err"); 
            res.status(400).json({'user':'greska'});
            return;    
        }
        if(user==null){
            console.log('user not found');
            return res.status(200).json({
                'user':'not found'
            });
        }
        else {
            if(user.get("status") == "cekanje") {
                console.log('user on waiting');
                return res.status(200).json({
                    'user':'still waiting'
                })
            }
            else {
                // nakon svih provera, to znaci da je prosledjen username isti kao i username u bazi, tako da mogu da izvrsim update
                let query = { username: usernameR };
                let myNewVal = { $set: { stanjeAktivnosti:"aktivan"} };
                User.updateOne(query, myNewVal, function(err, res) {
                    if(err) {
                        console.log('err');
                        res.status(400).json({'user':'greska'});
                        return;
                    }
                    else {
                        console.log('update');
                    }
                })
                console.log('found user');
                console.log(user);
                return res.status(200).json(user);
            }
        }
    })      
});

app.use(express.static('./src/public'));

const multer = require('multer');
var fileExtension = require('file-extension')
let date : number;

const storage = multer.diskStorage({
    destination: (req:any, file:any, callback:any) => {
        console.log("ovde");
        callback(null, './src/public/');          
    },
    filename: (req:any, file:any, callback:any) => {
        date = Date.now();
        callback(null, file.fieldname + '_' + date + '.' + fileExtension(file.originalname));      
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2000000
    }
});


interface MulterRequest extends Request {
    file: any;
}

interface captchaResponse {
    success: boolean;
    'error-codes': string[];
}
let captchaKey="6Lc7bb0ZAAAAAMwaA8KF0Yt5ynhBL3ss4cphmGdD";

router.post('/registracija', upload.single('avatar'), (req:MulterRequest, res, next) => {
    
    let username = req.body.username;
    let mail = req.body.mail;

    axios.request({
        url: `https://google.com/recaptcha/api/siteverify?secret=${captchaKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`
      }).then( 
        (response: AxiosResponse<captchaResponse>)=>{   

            console.log(response.data.success);
            if(response.data.success) {
                User.findOne({'username':username}, (err, user)=>{
                    if(err) {
                        res.status(400).json({'user':'greska'});
                        return;
                    }
                    if(user==null) {
                        User.findOne({'mail':mail}, (err, user)=> {
                            if(err) {
                                res.status(400).json({'user':'greska'});
                                return;
                            }
                            //user.get("imePolja");
                            //console.log(req.body.ime);
                            if(user == null) {                  
                            // console.log(req.file);
                            console.log("FILE");
                            
                            if(req.file == null) {
                                console.log("ovde");
                                const user = new User ({           
                                    ime: req.body.ime,
                                    prezime: req.body.prezime,
                                    username: req.body.username,
                                    password: req.body.password,
                                    grad: req.body.grad,
                                    drzava: req.body.drzava,
                                    mail: req.body.mail,
                                    datumRodjenja: req.body.datumRodjenja,
                                    status: req.body.status,
                                    stanjeAktivnosti: "nije aktivan",
                                    tip: "korisnik",
                                    avatar: 'bezSlike' 
                                }); 
                                
                                user.save().then(user=>{      
                                    //console.log(user);
                                    res.status(201).json({ 
                                        'user':'ok',  
                                        message: "User registered successfully"
                                    });    
                                }).catch(err=>{         
                                    console.log(err);
                                    console.log("greska");
                                    res.status(500).json({      
                                        error: err
                                    }); 
                                }) 
                            }
                            // kada se registruje, posto mu zahtev jos nije ni odobren, korisnik ne moze biti prijavljen na sistem
                            else {   
                                console.log('a ovde');
                                const user = new User ({           
                                    ime: req.body.ime,
                                    prezime: req.body.prezime,
                                    username: req.body.username,
                                    password: req.body.password,
                                    grad: req.body.grad,
                                    drzava: req.body.drzava,
                                    mail: req.body.mail,
                                    datumRodjenja: req.body.datumRodjenja,
                                    status: req.body.status,
                                    stanjeAktivnosti: "nije aktivan",
                                    tip: "korisnik",
                                    avatar: 'http://localhost:4000/'+ req.file.filename  
                                });     
                            
                                user.save().then(user=>{      
                                    //console.log(user);
                                    res.status(201).json({ 
                                        'user':'ok',  
                                        message: "User registered successfully"
                                    });    
                                }).catch(err=>{         
                                    console.log(err);
                                    console.log("greska");
                                    res.status(500).json({      
                                        error: err
                                    }); 
                                }) 
                            }
                        }
                        else {
                            res.status(200).json({'user':'email'});
                            console.log("Email already exists");
                            return;
                            }
                        })
                    }
                    else {
                        res.status(200).json({'user':'username'});
                        console.log("Username already exists");
                        return;
                    }
                
                });
            }
            else {
                res.status(200).json("captcha err");
                return;
            }
        })
});

// treba da za niz zanrova vratim niz njihovh id
router.post('/idZanr', (req, res)=>{
    let idjevi:any[]=[];
    let cnt = 0;
    let niz = req.body.zanrovi;
   
    for(let i = 0; i<niz.length; i++) {
        Genre.findOne({"zanr":niz[i]}, (err, z)=>{
            if(err) {
                return res.status(400).json({
                    error: err
                });
            }
            idjevi[i]=z.get('_id');
            console.log(idjevi[i]);
            cnt++;
            if(cnt==niz.length) {
                return res.status(200).json(idjevi);
            }
        });
    }
});

router.post('/dodajKnjigu', upload.single('urlSlike'), (req:MulterRequest, res, next) => {
    // nema sta da se proverava, dodaje se knjiga svakako, nema nista isti id itd.
    console.log('dodaj knjigu');
    console.log(req.file);
    let unetiZanrovi = req.body.zanrovi;
    console.log("uneti zanrovi");
    console.log(unetiZanrovi);
    let niz = unetiZanrovi.split(',');
    console.log(niz);
    let autori = req.body.autori;
    let nizAutora = autori.split(',');
    console.log(nizAutora);
    


    if(req.file == null) {
        console.log("ovde");
        const book = new Book ({           
            naziv: req.body.naziv,
            autori: nizAutora,
            datumIzdavanja: req.body.datumIzdavanja,
            opis: req.body.opis,
            prosecnaOcena: 0,                               // knjiga jos nije odobrena, ne moze imati prosecnu ocenu
            brStrana: req.body.brStr,
            idZanra: niz,                        
            urlSlike: "default",
            status: req.body.status, 
        }); 
        
        book.save().then(book=>{      
            //console.log(user);
            res.status(201).json({ 
                'book':'ok',  
                message: "Book added successfully"
            });    
        }).catch(err=>{         
            console.log(err);
            console.log("greska");
            res.status(500).json({      
                error: err
            }); 
        }) 
    }
    // kada se registruje, posto mu zahtev jos nije ni odobren, korisnik ne moze biti prijavljen na sistem
    else {   
        console.log("a ovde");
        const book = new Book ({           
            naziv: req.body.naziv,
            autori: nizAutora,
            datumIzdavanja: req.body.datumIzdavanja,
            opis: req.body.opis,
            prosecnaOcena: 0,                               // knjiga jos nije odobrena, ne moze imati prosecnu ocenu
            brStrana: req.body.brStr,
            idZanra: niz,
            urlSlike: 'http://localhost:4000/'+ req.file.filename,
            status: req.body.status, 
        }); 
    
        book.save().then(book=>{      
            //console.log(user);
            res.status(201).json({ 
                'user':'ok',  
                message: "Book added successfully"
            });    
        }).catch(err=>{         
            console.log(err);
            console.log("greska");
            res.status(500).json({      
                error: err
            }); 
        }) 
    }
});



router.route('/promenaLozinke').post((req, res)=> {
    console.log("server promena lozinke");
    // treba proveriti staru lozinku i ako su one iste, sve je okej
    console.log(req.body.password);     // NOVA LOZINKA 
    console.log(req.body.password1);    // STARA LOZINKA
    
    let staraLoz = req.body.password1;
    let novaLoz = req.body.password;

    // trazenje poklapanja starih lozinki
    User.findOne({'password': staraLoz, stanjeAktivnosti:'aktivan'}, (err, user)=>{
        if(err) {
            console.log("greska u promeni lozinke");
            return res.status(400).json({      
                error: err
            });
        }
        if(user == null) {
            // pogresno uneta stara lozinka
            console.log('nije dobro uneta stara lozinka');
            return res.status(200).json({
               'user':'pogresna stara lozinka'
            })
        }
        else {
            let query = { password: staraLoz };
            let myNewVal = { $set: { password: novaLoz} };
            User.updateOne(query, myNewVal, function(err, res) {
                if(err) {
                    console.log('err');
                    res.status(500).json({      
                        error: err
                    });
                }
                else {
                    console.log('update');
                }
            })
            return res.status(200).json('user');              
        }
    })

});


router.route('/sviZanrovi').get((req, res)=> {
    // vraca mi sve zanrove u sistemu
    // neke knjige mogu imati vise istih
    Genre.find({}, (err, genre)=>{
        if(err) {
            console.log("err svi zanrovi");
            return res.status(400).json({
                error: err
            });
        }
        console.log(genre);
        return res.status(200).json(genre);
    });
});

router.route('/svaDesavanja').get((req, res)=> {
    Meeting.find({
        $or: [{status:'buduce'}, {status:'aktivno'}]}, (err, meeting)=>{
        if(err) {
            console.log("err sva desavanja");
            return res.status(400).json({
                error: err
            });
        }
       // console.log(meeting);
        return res.status(200).json(meeting);
    });
});

// zasto ako ne vracam respond on se vrti i ispisuje ove sto sam pre njega ukucala, nakon nekog vremena..


// VODITI RACUNA DA IAKO JE AUTOR NIZ MOZE GA CITATI KAO "", A NE KAO NULL..
router.route('/pretragaKnjige').post((req, res) => {
    let nazivKnjige = req.body.nazivKnjige;
    let autorKnjige = req.body.autorKnjige;
    let zanrovi = req.body.zanrKnjige;
    let zanrId;
    
        if(zanrovi!=null) {
            // zanr je unet
            Genre.findOne({zanr: zanrovi}, (err, zanr)=>{
                if(err) {
                    res.status(400).json({
                    error: err
                    })
                }
            
                zanrId = zanr.get("_id");           // kuca zanr tekstualno, treba mi njihov id (svih zanrova), neki niz zanrId?

            if(autorKnjige && nazivKnjige) {
                // autor i naziv knjige su uneti
                Book.find({
                $or: [{"naziv":{"$regex":nazivKnjige, "$options":"i"}},
                {"autori":{"$regex":autorKnjige, "$options":"i"}},
                {"idZanra": zanrId}]}).populate('idZanra').exec((err, docs)=>{
                    if(err) {
                        console.log(err);
                        return res.status(400).json(
                        {error: err}
                        )
                    }
                    return res.json(docs);
                });
            }
            else if(autorKnjige && !nazivKnjige) {
                // autor knjige je unet (i zanr je unet)
                Book.find({
                $or: [{"autori":{"$regex":autorKnjige, "$options":"i"}},
                {"idZanra":zanrId}]}).populate('idZanra').exec((err, docs)=> {
                    if(err) {
                        console.log(err);
                        return res.status(400).json(
                            {error: err}
                        )
                    }
                    return res.json(docs);
                });
            }
            else if(!autorKnjige && nazivKnjige) {
                // uneti naziv knjige i zanr
                Book.find({
                $or: [{"naziv":{"$regex":nazivKnjige, "$options":"i"}},
                {"idZanra":zanrId}]}).populate('idZanra').exec((err, docs) =>{
                    if(err) {
                        console.log(err);
                        return res.status(400).json(
                            {error: err}
                        )
                    }
                    return res.json(docs);
                });
            }
            else if(!autorKnjige && !nazivKnjige) {
                // samo je zanr unet
                Book.find({"idZanra":zanrId}).populate('idZanra').exec((err, docs)=>{
                    if(err) {
                        console.log(err);
                        return res.status(400).json(
                            {error: err}
                        )
                    }
                    return res.json(docs);
                });
            }
            else {
                console.log("Else grana, zanr nije null");
                console.log("podaci");
                console.log(autorKnjige);
                console.log(nazivKnjige);
            }
        });
    }   // endIF
    else {
        // Zanr je null
        if(autorKnjige && nazivKnjige) {
            // autor i naziv knjige su uneti
            Book.find({
            $or: [{"naziv":{"$regex":nazivKnjige, "$options":"i"}},
            {"autori":{"$regex":autorKnjige, "$options":"i"}}]}).populate('idZanra').exec((err, docs)=>{
                if(err) {
                    console.log(err);
                    return res.status(400).json(
                    {error: err}
                    )
                }
                return res.json(docs);
            });
        }
        else if(autorKnjige && !nazivKnjige) {
            // autor knjige je unet (i zanr je unet)
            Book.find({
            $or: [{"autori":{"$regex":autorKnjige, "$options":"i"}}]}).populate('idZanra').exec((err, docs)=> {
                if(err) {
                    console.log(err);
                    return res.status(400).json(
                        {error: err}
                    )
                }
                return res.json(docs);
            });
        }
        else if(!autorKnjige && nazivKnjige) {
            // uneti naziv knjige i zanr
            Book.find({
            $or: [{"naziv":{"$regex":nazivKnjige, "$options":"i"}}]}).populate('idZanra').exec((err, docs) =>{
                if(err) {
                    console.log(err);
                    return res.status(400).json(
                        {error: err}
                    )
                }
                return res.json(docs);
            });
        }
    }
});

router.route('/sveKnjige').get((req, res) => {
    Book.find({}).populate('idZanra').exec((err, books)=>{
        if(err) {
           return res.status(400).json(
               { error: err }
            )
        }
        console.log(books);

        return res.status(200).json(books);
      
    })          // populate istraziti
});

router.route('/dohvatiKorisnike').get((req, res) => {
    User.find({}, (err, docs) => {
        if(err) {
            return res.status(400).json(
                { error: err}
            )
        }

        return res.status(200).json(docs);
    });
});


router.route('/komentariNaKnjigu').post((req, res) => {
    //console.log("Komentari na knjigu");
    let id = req.body.idSaljem;
    Comment.find({'idKnjige': id}).populate('idKor').exec((err, kom) => {
        if(err) {
            return res.status(400).json({
                error: err 
            });
        }
        return res.status(200).json(kom);
    });
});


router.route('/ovajKorisnik').post((req, res, next) => {
    let userName = req.body.usernameKor;
    User.find({'username' : userName}, (err, user)=>{
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        return res.status(200).json(user);
    });
}); 

router.route('/promeniIme').post((req, res)=> {
    console.log('promena imena');

    let username2 = req.body.usernameKor;
    let ime2 = req.body.novoIme;

    let query = {username: username2};
    let myNewVal = {$set: {ime: ime2}};
    User.updateOne(query, myNewVal, function(err, res) {
        if(err) {
            return res.status(400).json({
                error:err
            });
        }
    });
    return res.status(200).json({
        message: "Name updated successfully"
    });
});

router.route('/promeniPrezime').post((req, res)=> {
    let username2 = req.body.usernameKor;
    let prezime2 = req.body.novoPrezime;

    let query = {username: username2};
    let myNewVal = {$set: {prezime: prezime2}};
    User.updateOne(query, myNewVal, function(err, res) {
        if(err) {
            return res.status(400).json({
                error:err
            });
        }
    });
    return res.status(200).json({
        message: "Surname updated successfully"
    });
});

router.route('/promeniDrzavu').post((req, res)=> {
    let username2 = req.body.usernameKor;
    let drzava2 = req.body.novaDrzava;

    let query = {username: username2};
    let myNewVal = {$set: {drzava: drzava2}};
    User.updateOne(query, myNewVal, function(err, res) {
        if(err) {
            return res.status(400).json({
                error:err
            });
        }
    });
    return res.status(200).json({
        message: "Country updated successfully"
    });
});

router.route('/promeniGrad').post((req, res)=> {
    let username2 = req.body.usernameKor;
    let grad2 = req.body.novGrad;

    let query = {username: username2};
    let myNewVal = {$set: {grad: grad2}};
    User.updateOne(query, myNewVal, function(err, res) {
        if(err) {
            return res.status(400).json({
                error:err
            });
        }
    });
    return res.status(200).json({
        message: "City updated successfully"
    });
});

router.route('/promeniMail').post((req, res)=> {
    let username2 = req.body.usernameKor;
    let mail2 = req.body.novMail;

    let query = {username: username2};
    let myNewVal = {$set: {mail: mail2}};
    User.updateOne(query, myNewVal, function(err, res) {
        if(err) {
            return res.status(400).json({
                error:err
            });
        }
    });
    return res.status(200).json({
        message: "Mail updated successfully"
    });
});

router.route('/promeniDatumRodjenja').post((req, res)=> {
    let username2 = req.body.usernameKor;
    let datumRodjenja2 = req.body.novDatumRodjenja;

    let query = {username: username2};
    let myNewVal = {$set: {datumRodjenja: datumRodjenja2}};
    User.updateOne(query, myNewVal, function(err, res) {
        if(err) {
            return res.status(400).json({
                error:err
            });
        }
    });
    return res.status(200).json({
        message: "Date of birth updated successfully"
    });
});

router.post('/promeniProfilnuSliku', upload.single('avatar'), (req:MulterRequest, res, next) => {
    let username2 = req.body.username;
    let filename2 = req.file.filename;
    let user2;
    // sa query nadje ciju sliku hocu da menjam, a username je jedinstveno

    let query = {username: username2}; 
    let myNewVal = {$set: {avatar: 'http://localhost:4000/'+ filename2}};

    User.updateOne(query, myNewVal, function(err, res) {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
    });
    return res.status(200).json({
        message: "Profile picture updated successfully"
    });
});

router.route('/procitaneKnjige').post((req,res)=>{
    let username = req.body.usernameKor;
    // imam username, treba mi id
    User.findOne({'username':username}, (err, user)=>{
        if(err) {
            return res.json({
                error: err
            });
        }
        let id = user.get('_id');
        console.log(id);
        Status.find({'idKor':id, 'statusCitanja':'procitao'}).populate('idKnjige').populate('idZanra').exec((err,proc)=>{
            if(err) {
                return res.json({
                    error: err
                });
            }
            console.log("Procitane knjige server");
            console.log(proc);
            
            return res.json(proc);
        });
    });
});

router.route('/citajuSeKnjige').post((req,res)=>{
    let username = req.body.usernameKor;
    // imam username, treba mi id
    User.findOne({'username':username}, (err, user)=>{
        if(err) {
            return res.json({
                error: err
            });
        }
        let id = user.get('_id');
        Status.find({'idKor':id, 'statusCitanja':'cita'}).populate('idKnjige').exec((err,proc)=>{
            if(err) {
                return res.json({
                    error: err
                });
            }
            return res.json(proc);
        });
    });
});

router.route('/naListi').post((req,res)=>{
    let username = req.body.usernameKor;
    // imam username, treba mi id
    User.findOne({'username':username}, (err, user)=>{
        if(err) {
            return res.json({
                error: err
            });
        }
        let id = user.get('_id');
        Status.find({'idKor':id, 'statusCitanja':'naListi'}).populate('idKnjige').exec((err,proc)=>{
            if(err) {
                return res.json({
                    error: err
                });
            }
            return res.json(proc);
        });
    });
});

router.route('/koms').post((req,res)=>{
    let username = req.body.usernameKor;
    // imam username, treba mi id
    User.findOne({'username':username}, (err, user)=>{
        if(err) {
            return res.json({
                error: err
            });
        }
        let id = user.get('_id');
        Comment.find({'idKor':id}).populate('idKnjige').populate('idZanra').exec((err,proc)=>{
            if(err) {
                return res.json({
                    error: err
                });
            }
            return res.json(proc);
        });
    });
});

router.route('/status').post((req, res)=> {
    let username2 = req.body.usernameKor;
    let datum2 = req.body.datum;

    let query = {username: username2};
    let myNewVal = {$set: {stanjeAktivnosti: datum2}};
    User.updateOne(query, myNewVal, function(err, res) {
        if(err) {
            return res.status(400).json({
                error:err
            });
        }
    });
    return res.status(200).json({
        message: "State of activity updated successfully"
    });
});

router.route('/azurirajProcitane').post((req, res)=> {
    console.log("zove funkciju");
    let idKorisnika = req.body.idKor;
    let idKnj = req.body.idKnjige;
    let brStr = req.body.brStrana;
    let zanrovi = req.body.zanrovi;                 // zanrovi ako je potrebno dodati knjigu
    console.log(idKorisnika);
    console.log(idKnj);
    console.log(brStr);
    console.log(zanrovi);

    Status.findOne({"idKor":idKorisnika, "idKnjige":idKnj, "statusCitanja":"procitao"}, (err, proc)=>{
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        if(proc==null) {
            // ako ne postoji u procitanim
            Status.findOne({"idKor":idKorisnika, "idKnjige":idKnj, "statusCitanja":"cita"}, (err, cit)=>{
                if(err) {
                    return res.status(400).json({
                        error: err
                    });
                }
                if(cit==null) {
                    console.log("cit je null");
                    Status.findOne({"idKor":idKorisnika, "idKnjige":idKnj, "statusCitanja":"naListi"}, (err, nl)=>{
                        if(err) {
                            return res.status(400).json({
                                error: err
                            });
                        }
                        if(nl==null) {
                            console.log("kreira novi");
                            // create new
                            const status = new Status ({
                                statusCitanja: "procitao",
                                idKor: idKorisnika,
                                idKnjige: idKnj,
                                idZanra: zanrovi,
                                brProcitanihStrana: brStr
                            });
                
                            status.save().then(st=>{
                                res.status(201).json({
                                    message: "New status is successfully added to the collection procitao"
                                });
                            }).catch(err=>{
                                res.status(500).json({
                                    error: err
                                });
                            });
                
                        }
                        else {
                            console.log("update na listi u procitao");
                            // update naListi u procitao
                            let query = {idKor: idKorisnika, idKnjige: idKnj, _id:nl.get('_id')};
                            let myNewVal = {$set: {statusCitanja: "procitao", brProcitanihStrana: brStr}};  
                            // prosledjen ukupan broj strana knjige           
                            
                            Status.updateOne(query, myNewVal, function(err, res) {
                                if(err) {
                                    return res.status(400).json({
                                        error:err
                                    });
                                }
                            });
                            return res.status(200).json({
                                message: "State of reading updated successfully from naListi to procitao"
                            });
                        }
                    });
                }
                else {
                    // update cita u procitao
                    console.log("update cita u procitao");
                    let query = {idKor: idKorisnika, idKnjige: idKnj, _id:cit.get('_id')};
                    let myNewVal = {$set: {statusCitanja: "procitao", brProcitanihStrana: brStr}};  
                    // prosledjen ukupan broj strana knjige           
                    
                    Status.updateOne(query, myNewVal, function(err, res) {
                        if(err) {
                            return res.status(400).json({
                                error:err
                            });
                        }
                    });
                    return res.status(200).json({
                        message: "State of reading updated successfully from cita to procitao"
                    });
                }
            });
                    
        }
        else {
            // TESTIRATI KADA SVE NAPISEM OKO OVIH PREGLEDAy
            // ako postoji u procitanim
            console.log("vec postoji u procitanim knjigama");
            Status.findOne({"idKor":idKorisnika, "idKnjige":idKnj, "statusCitanja":"cita"}, (err, trc)=>{
                console.log("nasao je ovu");
                console.log(trc);
                if(err) {
                    return res.status(400).json({
                        error: err
                    });
                }
                if(trc==null) {
                    Status.findOne({"idKor":idKorisnika, "idKnjige":idKnj, "statusCitanja":"naListi"}, (err, nal)=>{
                        if(err) {
                            return res.status(400).json({
                                error: err
                            });
                        }
                        if(nal==null) {
                            return res.status(200).json({
                                message: "You have alerady read this book so the state is the same"
                            })
                        }
                        else {
                            // ako je na listi i oznacio je da ju je procitao, a vec ju je ranije procitao
                            Status.deleteOne({"idKor":idKorisnika, "idKnjige":idKnj, "statusCitanja":"naListi"}, (err)=>{
                                if(err) {
                                    console.log("brise u cita");
                                    return res.status(400).json({
                                        error: err
                                    });
                                }
                                return res.status(200).json({
                                    message: "Successfully deleted form the list in /azurirajProcitane"
                                });
                            });
                        }
                    });
                }
                else {
                    // trenutno je cita, a ranije ju je vec procitao (ne stavljam je ponovo u procitane)
                    Status.deleteOne({"idKor":idKorisnika, "idKnjige":idKnj, "statusCitanja":"cita"}, (err)=>{
                        if(err) {
                            console.log("brise u cita");
                            return res.status(400).json({
                                error: err
                            });
                        }
                        return res.status(200).json({
                            message: "Successfully deleted form the list of current readings"
                        });
                    });
                }
            });
        }
    });
});

router.route('/azurirajTrCitam').post((req, res)=> {
    console.log("funkcija trenutno citam");

    let idKorisnika = req.body.idKor;
    let idKnj = req.body.idKnjige;
    let zanrovi = req.body.zanrovi;                 // zanrovi ako je potrebno dodati knjigu

    
    console.log("id KNJIGE");
    console.log(idKnj);
    // Ako imam iste knjige u trenutno citam i u naListi, onda ne radim nista. Neka na listi ostane ta knjiga (videti da li je
    // ovo okej.. ili treba da se obrise sa naListi)
    Status.findOne({"idKor":idKorisnika, "idKnjige":idKnj, "statusCitanja":"cita"}, (err, naList)=>{
        if(err){
            return res.status(400).json({
                error: err
            });
        }
        console.log("nadjen nakon prvog find");
        console.log(naList);
        if(naList==null) {
            console.log("usao ovde jer je null");
            Status.findOne({"idKor":idKorisnika, "idKnjige":idKnj, "statusCitanja":"naListi"}, (err, cita)=>{
                if(err) {
                    return res.status(400).json({
                        error: err
                    });
                }
                console.log("ovde bi treblo da nadje knjigu");
                console.log(cita);
                if(cita==null) {
                    // knjiga je ili procitana ili je ni nema, pa se odmah oznacava kao da se trenutno cita (nije nikada bila na listi)
                    // create
                    const status = new Status ({
                        statusCitanja: "cita",
                        idKor: idKorisnika,
                        idKnjige: idKnj,
                        idZanra: zanrovi,
                        brProcitanihStrana: "0"
                    });
        
                    status.save().then(st=>{
                        res.status(201).json({
                            message: "New status is successfully added to the collection cita"
                        });
                    }).catch(err=>{
                        res.status(500).json({
                            error: err
                        });
                    });
                }
                else {
                    // ako je na listi i trenutno je citam ide u listu onih koje trenutno citam
                    // update sa naListi u cita
                    let query = {idKor: idKorisnika, idKnjige: idKnj, _id:cita.get('_id')};

                    // tek je poceo sa citanjem
                    let myNewVal = {$set: {statusCitanja: "cita", brProcitanihStrana: "0"}};             

                    Status.updateOne(query, myNewVal, function(err, res) {
                        if(err) {
                            return res.status(400).json({
                                error:err
                            });
                        }
                    });
                    return res.status(200).json({
                        message: "State of reading updated successfully  from naListi to cita"
                    });
                }
            });
        }
        else {
            // ako trenutno cita i ja pritisnem dugme, onda poruka
            // update strana reaguje na promenu u unosu, a ovo se desava pre toga
            return res.status(200).json({
                message: "You are already reading this book. You can only change number of pages"
            });
        }
    });
    
});



router.route('/stigaoJeDoStrane').post((req, res)=> {
   
    let idKorisnika = req.body.idKor;
    let idKnj = req.body.idKnjige;
    console.log("poziv stigao je do strane");
    console.log("IdKor");
    console.log(idKorisnika);
    console.log("idKnj");
    console.log(idKnj);

    Status.findOne({'idKor':idKorisnika, 'idKnjige':idKnj, "statusCitanja":"cita"}, (err, st)=>{
        if(err) {
            return res.status(400).json({
                error: err
            });
        }

        console.log(st);            
        if(st != null) {
            let brProc = st.get('brProcitanihStrana');
            return res.status(200).json(brProc);
        }
        else {
            return res.status(200).json({
                message: "Could not find any book that is currenty being read"
            });
        }
    });
});


router.route('/azurirajBrProc').post((req, res)=>{
    let idKorisnika = req.body.idKor;
    let idKnj = req.body.idKnjige;
    let brStr = req.body.brStrana;
    
    Status.findOne({"idKor":idKorisnika, 'idKnjige':idKnj, 'statusCitanja':'cita'}, (err, st)=>{
        // azurira se broj strana procitane knjige, kada se desi promena u input-u na frontu
        if(err) {
            return res.status(400).json({
                error: err
            });
        }

        let query = {idKor: idKorisnika, idKnjige: idKnj, _id:st.get('_id')};

        let myNewVal = {$set: {brProcitanihStrana: brStr}};             

        Status.updateOne(query, myNewVal, function(err, res) {
            if(err) {
                return res.status(400).json({
                    error:err
                });
            }
        });
        return res.status(200).json({
            message: "Number of pages updated successfully"
        });
    });
});


router.route('/dodajNaListu').post((req, res)=> {
    let idKorisnika = req.body.idKor;
    let idKnj = req.body.idKnjige;
    let brStr = "0";
    let zanrovi = req.body.zanrovi;                 // zanrovi ako je potrebno dodati knjigu

    Status.findOne({"idKor":idKorisnika, "idKnjige":idKnj, "statusCitanja":"naListi"}, (err, nl)=>{
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        if(nl==null) {
            // ako knjiga koju zelim da dodam NIJE na listi, uvek je dodajem
            const status = new Status ({
                statusCitanja: "naListi",
                idKor: idKorisnika,
                idKnjige: idKnj,
                idZanra: zanrovi,
                brProcitanihStrana: brStr
            });

            status.save().then(st=>{
                res.status(201).json({
                    message: "New status is successfully added to the collection naListi"
                });
            }).catch(err=>{
                res.status(500).json({
                    error: err
                });
            });

        }
        else {
            // ako knjiga vec jeste na listi, necu je ponovo dodavati
            return res.status(200).json({
                message: "The book is already on the list"
            });
        }
    });
});

router.route('/obrisiSaListe').post((req, res)=>{
    let idKorisnika = req.body.idKor;
    let idKnj = req.body.idKnjige;
    
console.log(idKorisnika);
console.log(idKnj);
    Status.findOne({"idKor":idKorisnika, "idKnjige":idKnj, "statusCitanja":"naListi"}, (err, book)=>{
        console.log("Book");
            console.log(book);
        if(err) {
            return res.json({
                error: err
            });
        }
        if(book == null) {
            return res.status(200).json({
                message: "The book does not exist on the list"
            });
        }
        else {
            // brisem sa liste, zato stanje aktivnosti mora biti na listi
            Status.deleteOne({"idKor":idKorisnika, "idKnjige":idKnj, "_id":book.get('_id'),
            "statusCitanja":"naListi"}, (err)=>{
                if(err) {
                    console.log("brise u obrisi sa liste");
                    return res.status(400).json({
                        error: err
                    });
                }
                return res.status(200).json({
                    message: "Successfully deleted form the list"
                });
            });
        }
    });
});

router.route('/dodajKomentare').post((req, res)=> {
    console.log('dodaj komentare');
    let idKorisnika = req.body.idKor;
    let idKnj = req.body.idKnjige;
    let zanrovi = req.body.zanrovi; 
    let oc = req.body.ocena;
    let koment = req.body.komentar;

    // unosim komentare od svih korisnika, bez obzira da li ih je ranije ostavljao
    // imam posle link za izmenu postojeceg komentara

    const comment = new Comment ({
        tekstKom: koment,
        Ocena: oc,
        idKor: idKorisnika,
        idKnjige: idKnj,
        idZanra: zanrovi
    });
    comment.save().then(st=>{
  
        // dohvati azurirane komentare
        Comment.find({'idKnjige':idKnj}).populate('idKor').exec((err,knj)=>{
            if(err) {
                return res.status(400).json({
                    error: err
                });
            }
            if(oc === 0) {
                console.log("OCENA");
                console.log(oc);
                // ne treba da se azurira prosek, komentar je ubacen
                console.log(knj);
                res.status(201).json(knj);
            }
            else {
                console.log("OCENA1");
                console.log(oc);
                // ako je ocena uneta, onda se racuna prosek, ako nije, prosek ostaje isti
                let length = knj.length;
                let sum = 0;
                for(let i = 0; i<length; i++) {
                    sum+=parseInt(knj[i].get('Ocena'));
                }
                
                sum = sum/length;

                let query = {_id: idKnj};
                let myNewVal = {$set: {prosecnaOcena: sum}};             
            
                Book.updateOne(query, myNewVal, function(err, res) {
                    if(err) {
                        return res.status(400).json({
                            error:err
                        });
                    }
                });
                console.log(knj);

                return res.status(200).json(knj);
            }
        });
    }).catch(err=>{
        res.status(500).json({
            error: err
        });
    });

});

router.route('/dohvatiKnjigu').post((req, res)=> {
    let idKnj = req.body.idKnjige;

    Book.findOne({'_id':idKnj}, (err, knj)=>{
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        console.log('Knjiga koja je nadjena');
        console.log(knj);
        return res.status(200).json(knj);
    });
});

router.route('/dohvatiId').post((req, res)=>{
    let usernameKor = req.body.usernameKor;

    User.findOne({'username':usernameKor}, (err, user)=>{
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        console.log(user);
        let id = user.get('_id');
        return res.status(200).json(id);
    });
});

router.route('/nadjiTip').post((req, res)=>{
    let usernameKor = req.body.usernameKor;

    User.findOne({'username':usernameKor}, (err, user)=>{
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        
        if(user!=null) {
            let tip = user.get('tip');
            console.log(tip);
            return res.status(200).json(tip);
        }
        else {
            console.log("USER je NULL");
            return res.status(200).json({
                message: "Korisnik sa tim username ne postoji u bazi"
                // ovo je u sustini i nemoguce, jer nije mogao ni da se prijavi ako ne postoji u bazi..
            });
        }

    });
});

router.route('/sveKnjigeNaCekanju').get((req, res)=>{
    Book.find({"status":"cekanje"}).populate('idZanra').exec((err, knj)=>{
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        console.log(knj);
        return res.status(200).json(knj);
    });
});

router.route('/odobriKnjigu').post((req, res)=>{
    let idKnj = req.body.idKnj;

    console.log(idKnj);
    // update statusa sa cekanje na odobreno
    // knjiga mora postojati u bazi, jer je ova funkcija i pozvana jer postoji knjiga koja ceka da bude odobrena

    let query = { _id: idKnj, status:"cekanje"};
    let myNewVal = { $set: { status:"odobreno"} };
    Book.updateOne(query, myNewVal, function(err, knj) {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        return res.status(200).json({
            message: "Status of a book updated successfully"
        });
    });               
});

router.route('/korisniciCekaju').get((req, res)=>{
    User.find({"status":"cekanje"}).exec((err, user)=>{
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        console.log(user);
        return res.status(200).json(user);
    });
});

router.route('/odobriKorisnika').post((req, res)=>{
    let usernameKor = req.body.usernameKor;

    console.log(usernameKor);
    

    let query = { username: usernameKor, status:"cekanje"};
    let myNewVal = { $set: { status:"odobreno"} };
    User.updateOne(query, myNewVal, function(err, user) {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        return res.status(200).json({
            message: "Status of a user updated successfully"
        });
    });               
});

router.route('/sviSemAdmin').get((req, res)=>{
    User.find({
        $or: [{tip:'korisnik'}, {tip:'moderator'}]}).exec((err, user)=>{
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        console.log(user);
        return res.status(200).json(user);
    });
});

router.route('/menjamTip').post((req, res)=>{
    let usernameKor = req.body.usernameKor;
    let trenutniTip = req.body.trenutniTip;
    let menjamU = req.body.menjamU;

    console.log(usernameKor);
    

    let query = { username: usernameKor, tip: trenutniTip};
    let myNewVal = { $set: { tip: menjamU} };
    User.updateOne(query, myNewVal, function(err, user) {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        return res.status(200).json({
            message: "New type updated successfully"
        });
    });               
});


router.route('/odobreneKnjige').get((req, res)=>{
    Book.find({status:"odobreno"}).populate('idZanra').exec((err, book)=>{
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        console.log(book);
        return res.status(200).json(book);
    });
});

router.route('/promeniNazivKnjige').post((req, res)=>{
    let idKnj = req.body.idKnjige;
    let novNaziv = req.body.novNazivKnj;

    

    let query = { _id: idKnj};
    let myNewVal = { $set: { naziv: novNaziv} };
    Book.updateOne(query, myNewVal, function(err, user) {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        Book.findOne({_id:idKnj}, (err, book)=>{
            if(err) {
                return res.status(400).json({
                    error: err
                });
            }
            console.log(book);
            return res.status(200).json(book);
        });
    });               
});

router.route('/promeniAutore').post((req, res)=>{
    let idKnj = req.body.idKnjige;
    let autori = req.body.noviAutori;

    let nizAutora = autori.split(',');
    console.log(nizAutora);
    

    let query = { _id: idKnj};
    let myNewVal = { $set: { autori: nizAutora} };
    Book.updateOne(query, myNewVal, function(err, user) {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        Book.findOne({_id:idKnj}, (err, book)=>{
            if(err) {
                return res.status(400).json({
                    error: err
                });
            }
            console.log(book);
            return res.status(200).json(book);
        });
    });     
});

router.route('/promeniOpis').post((req, res)=>{
    let idKnj = req.body.idKnjige;
    let novopis = req.body.novOpis;

    

    let query = { _id: idKnj};
    let myNewVal = { $set: { opis: novopis} };
    Book.updateOne(query, myNewVal, function(err, user) {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        Book.findOne({_id:idKnj}, (err, book)=>{
            if(err) {
                return res.status(400).json({
                    error: err
                });
            }
            console.log(book);
            return res.status(200).json(book);
        });
    });               
});

router.route('/promeniBrStr').post((req, res)=>{
    let idKnj = req.body.idKnjige;
    let novbrstr = req.body.novBrStr;

    

    let query = { _id: idKnj};
    let myNewVal = { $set: { brStrana: novbrstr} };
    Book.updateOne(query, myNewVal, function(err, user) {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        Book.findOne({_id:idKnj}, (err, book)=>{
            if(err) {
                return res.status(400).json({
                    error: err
                });
            }
            console.log(book);
            return res.status(200).json(book);
        });
    });               
});


router.route('/promeniZanrove').post((req, res)=>{
    let idKnj = req.body.idKnjige;
    let idz = req.body.idZ;

    console.log("id zanrova");
    console.log(idz);

    let query = { _id: idKnj};
    let myNewVal = { $set: { idZanra: idz} };
    Book.updateOne(query, myNewVal, function(err, user) {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        Book.findOne({_id:idKnj}).populate('idZanra').exec((err, book)=>{
            if(err) {
                return res.status(400).json({
                    error: err
                });
            }
            console.log(book);
            return res.status(200).json(book);
        });
    });             
});

router.route('/promeniDatumIzdavanja').post((req, res)=>{
    let idKnj = req.body.idKnjige;
    let datum = req.body.novDatum;

    let query = { _id: idKnj};
    let myNewVal = { $set: { datumIzdavanja: datum} };
    Book.updateOne(query, myNewVal, function(err, user) {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        Book.findOne({_id:idKnj}, (err, book)=>{
            if(err) {
                return res.status(400).json({
                    error: err
                });
            }
            console.log(book);
            return res.status(200).json(book);
        });
    });             
});

router.post('/promeniNaslovnuStranu', upload.single('urlSlike'), (req:MulterRequest, res, next) => {
    console.log("ovde");
    let idKnj = req.body._id;
    let filename = req.file.filename;
 
    
    // sa query nadje ciju sliku hocu da menjam, a username je jedinstveno

    let query = {_id: idKnj}; 
    let myNewVal = {$set: {urlSlike: 'http://localhost:4000/'+ filename}};

    Book.updateOne(query, myNewVal, function(err, ress) {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        Book.findOne({_id:idKnj}, (err, book)=>{
            if(err) {
                return res.status(400).json({
                    error: err
                });
            }
            console.log(book);
            return res.status(200).json(book);
        });
    });
});

router.route('/dodajZanr').post((req, res)=>{
    let noviZanr = req.body.zanr;
    console.log('novi zanr');
    console.log(noviZanr);

    const zanr = new Genre ({
        zanr: noviZanr
    });

    zanr.save().then(z=>{
        Genre.find({zanr: noviZanr}, (err, genr)=>{
            if(err) {
                return res.status(400).json({
                    error: err
                });
            }
            console.log(genr);
            return res.status(200).json(genr);
        });
    }).catch(err=>{
        res.status(500).json({
            error: err
        });
    });
});

router.route('/sveKnjige').get((req, res)=>{
    Book.find({}).populate('idZanra').exec((err, book)=>{
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        console.log(book);
        return res.status(200).json(book);
    });
});

router.route('/obrisiZanr').post((req,res)=>{
    let zanrZaBrisanje = req.body.zanr;

    Genre.deleteOne({"zanr":zanrZaBrisanje}, (err)=>{
        if(err) {
            console.log("brise zanr");
            return res.status(400).json({
                error: err
            });
        }
        return res.status(200).json({
            message: "Genre has been successfully deleted"
        });
    });
});

app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
