import express from "express";
import { userRoutes } from "../app/modules/users/users.router";
import { academicSemesterRoutes } from "../app/modules/academicSemester/academicSemester.router";



const router  = express.Router();

const moduleRoutes = [
    {
        path:'/users/',
        route:userRoutes
    },
    {
        path:'/academicSemester/',
        route:academicSemesterRoutes
    },
];


moduleRoutes.forEach((route)=>router.use(route.path,route.route))


// router.use('/users/',userRoutes)
// router.use('/academicSemester/',academicSemesterRoutes)


export default router;