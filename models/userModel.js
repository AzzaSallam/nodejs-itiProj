import mongoose from "mongoose";

const usersSchema = mongoose.Schema({
    name : {
        type : String ,
        required : [true , "name is required"] ,
        minLength : [3 , "first name min length is 3"] ,
        maxLength : [15 , "first name max length is 15"]
    } ,
    username : {
        type : String ,
        required : [true , "username is required"] ,
        unique : [true ,"username must be unique"] ,
        minLength : [5 , "username min length is 5"] ,
    } ,
    email : {
        type : String ,
        required : [true , "email is required"] ,
        unique : [true ,"email must be unique"] ,
        match : [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ , "please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],

    },
    role :{
        type : String ,
        enum : ['user' , 'admin' , 'seller'] ,
        default : 'user'
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
} , { timestamps: true }
) ;

const UserModel = mongoose.model('User' , usersSchema) ;

export default UserModel;