import express, { Application } from 'express';
import cors from 'cors'
import userRouters from './app/modules/users/users.router'
const app:Application = express();

app.use(cors())
//parser
app.use(express.json())
app.use(express.urlencoded({extended:true}))


//application routes
app.use('/api/v1/users/',userRouters)
app.get('/',(req,res)=>{
    res.send('Hello world')
});


export default app;