import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema ({
    userName :{
        type : String,
        require:true,
        lowercase:true,
        trim:true,
        unique:true,
        index:true
    },

    email :{
        type : String,
        require:true,
        lowercase:true,
        trim:true,
        unique:true
    },

    fullName :{
        type : String,
        require:true,
        trim:true,
        index:true
    },

    avatar :{
        type : String,
        require:true
    },

    coverImage :{
        type : String
    },

    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Videos"
        }
    ],

    password:{
        type:String,
        require:[true ,"Password is required"]
    },

    refreshToken:{
        type:String
    }



},{
    timestamps:true
})


userSchema.pre("save",  async function(next){
    if(!this.isModified("password"))  return next();

    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}


userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        userName:this.userName,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        userName:this.userName,
        fullName:this.fullName
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}



export const User = mongoose.model("User",userSchema)