import express from "express";
import { userRoutes } from "../app/modules/users/users.router";
import { academicSemesterRoutes } from "../app/modules/academicSemester/academicSemester.router";
import { academicFacultyRoutes } from "../app/modules/academicFaculty/route";
import { academicDepartmentRoutes } from "../app/modules/academicDepartment/route";



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
    {
        path:'/academicFaculty/',
        route:academicFacultyRoutes
    },
    {
        path:'/academicDepartment/',
        route:academicDepartmentRoutes
    }

    
];


moduleRoutes.forEach((route)=>router.use(route.path,route.route))


// router.use('/users/',userRoutes)
// router.use('/academicSemester/',academicSemesterRoutes)


export default router;