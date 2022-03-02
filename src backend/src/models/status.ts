import mongoose from 'mongoose';


const Schema = mongoose.Schema;

let Status = new Schema({
   statusCitanja: {
       type: String
   },
   idKor: {
       type: Schema.Types.ObjectId,
       ref: 'User'
   },
   idKnjige: {
       type: Schema.Types.ObjectId,
       ref: 'Book'
   },
   idZanra: [{
       type: Schema.Types.ObjectId,
       ref: 'Genre'
   }],
   brProcitanihStrana: {
       type: String
   }
});

export default mongoose.model('Status', Status);