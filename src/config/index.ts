import dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.join(process.cwd(),'.env')})

export default {
    env:process.env.NODE_ENV,
    port:process.env.PORT,
    db_url:process.env.DATABASE_URL,
    default_st_pass:process.env.DEFAULT_STD_PASS,
    bcyrpt_salt_rounds:process.env.BCRYPT_SALT_ROUNDS,
}