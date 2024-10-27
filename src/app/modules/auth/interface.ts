

export type IAuth = {
    id:string;
    password:string;
}

export type ILoginUserFilters ={
    searchTerm? : string 
}

export type LoginResponse = {
    token:string,
    refresh?:string,
    isNeededPassChange:boolean
}