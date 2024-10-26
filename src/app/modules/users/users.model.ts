import {Model, Schema,model} from 'mongoose'; 
import { IUser } from './users.interface';
import { UserModel } from '../../../interfaces/common';
import byt from 'bcrypt' 
import config from '../../../config';
const userSchema = new Schema<IUser>(
    {
    id:{
        type:String,
        required:true,
        unique:true,
    },
    role:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    student:{
        type:Schema.Types.ObjectId,
        ref:'Student'
    },
    // faculty:{
    //     type:Schema.Types.ObjectId,
    //     ref:'Faculty'
    // },
    // Admin:{
    //     type:Schema.Types.ObjectId,
    //     ref:"Admin"
    // }
},
{
    timestamps:true,
    toJSON:{
        virtuals:true
    }
})

userSchema.pre('save',async function(next){
    const user = this
    user.password = await byt.hash(
        user.password,
        Number(config.bcyrpt_salt_rounds)
    );
    next()
})

export const User = model<IUser,UserModel>('User',userSchema);