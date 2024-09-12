import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"
const commentsSchema = new Schema({
     content:{
        type: String,
        required: true
     },
     video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
     },
      owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
     }


},{timestamps:true})





videoSchema.plugin(aggregatePaginate)
export const Comments = mongoose.model("Comments", commentsSchema)