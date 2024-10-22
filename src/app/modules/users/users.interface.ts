// interfce > schema > model 



export type IUser = {
    id:string;
    role:string;
    password:string;
}


export type IUserFilters ={
    searchTerm? : string 
}