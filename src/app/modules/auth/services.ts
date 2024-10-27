import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { User } from "../users/users.model";
import { IAuth, LoginResponse } from "./interface";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helper/jwtHelper";

const login = async (payload: IAuth):Promise<LoginResponse> => {
  const { id, password } = payload;

  const user = new User();

  //check user exist
  const isUserExist = await user.isUserExist(id);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // if password matched
  const isPassMatch = await user.isPasswordMatch(
    password,
    isUserExist.password || ""
  );

  if (!isPassMatch) {
    throw new ApiError(httpStatus.NOT_FOUND, "Id or password not match");
  }

  if (!config.jwt.token || !config.jwt.token_expire) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Secret code or expiry time not found"
    );
  }

  const accessToken = jwtHelpers.creatToken(
    { id: isUserExist.id, role: isUserExist.role },
    config.jwt.token as Secret,
    config.jwt.token_expire as string
  );

  const refreshToken = jwtHelpers.creatToken(
    { id: isUserExist.id, role: isUserExist.role },
    config.jwt.refresh_token as Secret,
    config.jwt.refresh_token_expire as string
  );

 
  return {
    token:accessToken,
    refresh:refreshToken,
    isNeededPassChange:isUserExist.needsPassChange !== undefined ? isUserExist.needsPassChange : false
  };
};


const refreshToken = async(token:string)=>{
    let verifiedToken = null
    const user = new User()
    try {
        verifiedToken = jwt.verify(token,config.jwt.refresh_token as Secret) as JwtPayload;
        
    } catch (error) {
        throw new ApiError(httpStatus.FORBIDDEN,'Invalid refresh token')
    }

    const {id, role} = verifiedToken;


    const isUserExist = await user.isUserExist(id)
    
    if(!isUserExist){
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }

    //generate new token
    const newAccessToken = jwtHelpers.creatToken(
        {id:isUserExist.id,role:isUserExist.role},
        config.jwt.token as Secret, config.jwt.token_expire as string
    )

    return {
        token:newAccessToken
    }
}



export const authSerivce = {
  login,
  refreshToken
};