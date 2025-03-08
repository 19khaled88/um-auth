import academicDepartmentEvent from "../modules/academicDepartment/events";
import academicFacultyEvent from "../modules/academicFaculty/events";
import academicSemesterEvent from "../modules/academicSemester/academicSemester.event"
import supserAdminEvents from "../modules/super-admin/events";
import userEvents from "../modules/users/events";

const subscribeToEvents =()=>{
    academicSemesterEvent();
    academicFacultyEvent();
    academicDepartmentEvent();
    supserAdminEvents();
    userEvents();
}

export default subscribeToEvents;