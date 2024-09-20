import mongoose ,{Schema} from "mongoose";

const enquirySchema = new Schema({
    name: {type: String, required: true},
    standard:{type: String , required: true},
    medium:{type: String , required: true},
    address:{type: String , required: true},
    email:{type:String},
    phone:{type:String,required:true},
    message:{type:String,required:true},
    enquired:{type: Boolean ,default:false},
    date:{type:Date,default:Date.now}
},{
    timestamps:true
})

export const Enquiry = mongoose.model("Enquiry",enquirySchema)