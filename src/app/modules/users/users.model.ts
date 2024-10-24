import {Model, Schema,model} from 'mongoose'; 
import { IUser } from './users.interface';
import { UserModel } from '../../../interfaces/common';

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
    }
},
{
    timestamps:true,
    toJSON:{
        virtuals:true
    }
})

export const User = model<IUser,UserModel>('User',userSchema);