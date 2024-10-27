import {Model, Schema,model} from 'mongoose'; 
import { IAuth } from './interface';
import { AuthtModel } from '../../../interfaces/common';

const authSchema = new Schema<IAuth,AuthtModel>(
    {
    id:{
        type:String,
        required:true,
        unique:true,
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


export const Auth = model<IAuth,AuthtModel>('Auth',authSchema);