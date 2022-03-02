import mongoose from 'mongoose';


const Schema = mongoose.Schema;

let Meeting = new Schema({
    naziv: {
        type: String
    },
    status: {
        type: String
    },
    pocetak: {
        type: Date
    },
    kraj: {
        type: Date
    }
});

export default mongoose.model('Meeting', Meeting);