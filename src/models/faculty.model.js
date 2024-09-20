import mongoose ,{Schema} from "mongoose";

const facultySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    bio: {
        type : String,
        required: true
    },
    joining_date: {
        type: String,
        required: true
    },
    facultyImage: {
        type: String,
        required: true
    }

},{
    timestamps:true
})

export const Faculty = mongoose.model("Faculty",facultySchema)