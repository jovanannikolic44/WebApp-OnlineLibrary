import mongoose from 'mongoose';


const Schema = mongoose.Schema;

let Comment = new Schema({
   tekstKom: {
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
   Ocena : {
       type: String
   }
});

export default mongoose.model('Comment', Comment);