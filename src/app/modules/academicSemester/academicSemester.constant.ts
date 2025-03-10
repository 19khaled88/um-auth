import { IAcademicSemesterCode, IAcademicSemesterTitle, Month } from "./academicSemester.interface";

export const month:Month[] =["January","February", "March" , "April", "May", "June", "July", "August" , "September" , "October", "November", "December"]
export const academicSemesterMonth:Month[] =month
export const title:IAcademicSemesterTitle[] =['Autumn','Summer','Fall']
export const academicSemesterTitle:IAcademicSemesterTitle[] = title
export const code:IAcademicSemesterCode[] =['01','02','03']
export const academicSemesterCode:IAcademicSemesterCode[] = code


export const academicSemesterTitleCodeMapper:{[key:string]:string}  ={
    Autumn:'01',
    Summer:'02',
    Fall:'03'
}

export const EVENT_ACADEMIC_SEMESTER_CREATED = 'academic_semester.created'
export const EVENT_ACADEMIC_SEMESTER_UPDATED = 'academic_semester.updated'
export const EVENT_ACADEMIC_SEMESTER_DELETED = 'academic_semester.deleted'