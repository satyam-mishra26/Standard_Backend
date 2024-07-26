import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
        subscriber:{
            type: Schema.Types.ObjectId,//One Who Is Subscribing
            ref: 'User',
        },
        channel:{
            type: Schema.Types.ObjectId,//one to whom subscriber is subscribing
            ref:'User'
        }
},{
    timestamps: true
}
)


export const Subscription = mongoose.model ("Subscription",subscriptionSchema)