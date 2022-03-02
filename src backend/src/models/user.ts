import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let User = new Schema({
    ime: {
        type: String
    },
    prezime: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    grad: {
        type: String
    },
    drzava: {
        type: String
    },
    mail: {
        type: String
    },
    datumRodjenja: {
        type: Date
    },
    status: {
        type: String
    },
    stanjeAktivnosti: {
        type: String
    },
    tip: {
        type: String
    },
    avatar: {
        type: String
    },
},
    {
        collection: 'users'
    });

export default mongoose.model('User', User);