import express from "express";
import { userRoutes } from "../app/modules/users/users.router";
import { academicSemesterRoutes } from "../app/modules/academicSemester/academicSemester.router";
import { academicFacultyRoutes } from "../app/modules/academicFaculty/route";
import { academicDepartmentRoutes } from "../app/modules/academicDepartment/route";
import { studentRoutes } from "../app/modules/student/route";
import { authRoutes } from "../app/modules/auth/route";
import { facultyRoutes } from "../app/modules/faculty/router";
import { managementDepartmentRoutes } from "../app/modules/managementDepartment/route";



const router  = express.Router();

const moduleRoutes = [
    {
        path:'/users/',
        route:userRoutes
    },
    {
        path:'/students/',
        route:studentRoutes
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
    },
    {
        path:'/auth/',
        route:authRoutes
    },
    {
        path:'/faculties/',
        route:facultyRoutes
    },
    {
        path:'/managementDepartment',
        route:managementDepartmentRoutes
    }

    
];


moduleRoutes.forEach((route)=>router.use(route.path,route.route))


// router.use('/users/',userRoutes)
// router.use('/academicSemester/',academicSemesterRoutes)


export default router;