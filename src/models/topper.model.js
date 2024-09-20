import mongoose ,{Schema} from "mongoose";

const topperSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    standard: {
        type: String,
        required: true
    },
    medium: {
        type : String,
        required: true
    },
    score: {
        type: String,
        required: true
    },
    topperImage: {
        type: String,
        required: true
    }

},{
    timestamps:true
})

export const Topper = mongoose.model("Topper",topperSchema)