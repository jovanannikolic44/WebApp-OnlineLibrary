import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Genre = new Schema({
   zanr: {
       type: String
   }
});

export default mongoose.model('Genre', Genre);