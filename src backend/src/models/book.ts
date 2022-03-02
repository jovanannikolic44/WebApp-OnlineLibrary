import mongoose from 'mongoose';


const Schema = mongoose.Schema;

let Book = new Schema({
    naziv: {
        type: String
    },
    autori: [{
        type: String
    }],
    datumIzdavanja: {
        type: Date
    },
    idZanra: [{
        type: Schema.Types.ObjectId,
        ref: 'Genre'
    }],
    opis: {
        type: String
    },
    prosecnaOcena: {
        type: Number
    },
    brStrana: {
        type: String
    },
    status: {
        type: String
    },
    urlSlike: {
        type: String
    },
},
    {
        collection: 'books'
    });

export default mongoose.model('Book', Book);