
import {Schema,model} from 'mongoose';


// interfce > schema > model 



export type IUser = {
    id:string;
    role:string;
    password:string;
}