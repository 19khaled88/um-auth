import {Model, Schema,model} from 'mongoose'; 
import { IUser, IUserMethods } from './users.interface';
import { UserModel } from '../../../interfaces/common';
import byt from 'bcrypt' 
import config from '../../../config';
const userSchema = new Schema<IUser,Record<string, unknown>,IUserMethods>(
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
        select:0,
    },
    needsPassChange:{
        type:Boolean,
        default:true
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
});






// userSchema.methods.isUserExist = async function (id: string): Promise<Partial<IUser>> {
//     const user = await User.findOne({ id });
//     return user || {};
// }


// userSchema.methods.isUserExist = async function (id: string): Promise<Partial<IUser>> {
//     const user = await User.findOne({ id });
//     if (user === null) {
//         return {}; // Return an empty object if user is null
//     }
//     return user;
// }





// create methods
userSchema.methods.isUserExist = async function(id:string):Promise<Partial<IUser> | null>{
    const user = await User.findOne({id},{id:1, password:1, role:1,needsPassChange:1}).lean()
    return user
}

userSchema.methods.isPasswordMatch = async function(givenPass:string,savedPass:string | undefined):Promise<boolean>{
    
    if(!savedPass){
        return false
    }
    return await byt.compare(givenPass, savedPass); 
}

// create hash password
userSchema.pre('save',async function(next){
    const user = this
    user.password = await byt.hash(
        user.password,
        Number(config.bcyrpt_salt_rounds)
    );
    next()
})


export const User = model<IUser,UserModel>('User',userSchema);