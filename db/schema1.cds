/*namespace photoapp;
using {photoapp.common as common} from './common';

entity Students : common.Audit, common.Address {
key StudentID : Integer;
courses : Composition of many Courses
on courses.student = $self;
}

entity Courses : common.Audit {
key CourseID : Integer;
CourseName : String(100);
student : Association to one Students;
}*/