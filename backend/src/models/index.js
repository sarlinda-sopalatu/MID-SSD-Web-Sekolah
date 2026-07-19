const { sequelize } = require('../config/database');
const Role = require('./Role');
const User = require('./User');
const Class = require('./Class');
const Teacher = require('./Teacher');
const Student = require('./Student');
const Subject = require('./Subject');
const AcademicYear = require('./AcademicYear');
const Semester = require('./Semester');
const TeachingJournal = require('./TeachingJournal');
const BkCase = require('./BkCase');
const BkCounselingNote = require('./BkCounselingNote');
const StudentViolation = require('./StudentViolation');
const StudentAchievement = require('./StudentAchievement');
const Schedule = require('./Schedule');
const Attendance = require('./Attendance');
const Grade = require('./Grade');
const ActivityLog = require('./ActivityLog');
const Notification = require('./Notification');

User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

Teacher.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Teacher, { foreignKey: 'user_id' });

Student.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Student, { foreignKey: 'user_id' });

Teacher.belongsTo(Subject, { foreignKey: 'subject_id' });
Subject.hasMany(Teacher, { foreignKey: 'subject_id' });

Class.belongsTo(AcademicYear, { foreignKey: 'academic_year_id' });
AcademicYear.hasMany(Class, { foreignKey: 'academic_year_id' });

Class.belongsTo(Teacher, { as: 'HomeroomTeacher', foreignKey: 'homeroom_teacher_id' });
Teacher.hasMany(Class, { as: 'HomeroomClasses', foreignKey: 'homeroom_teacher_id' });

Student.belongsTo(Class, { foreignKey: 'class_id' });
Class.hasMany(Student, { foreignKey: 'class_id' });

TeachingJournal.belongsTo(Teacher, { foreignKey: 'teacher_id' });
Teacher.hasMany(TeachingJournal, { foreignKey: 'teacher_id' });

TeachingJournal.belongsTo(Class, { foreignKey: 'class_id' });
Class.hasMany(TeachingJournal, { foreignKey: 'class_id' });

TeachingJournal.belongsTo(Subject, { foreignKey: 'subject_id' });
Subject.hasMany(TeachingJournal, { foreignKey: 'subject_id' });

BkCase.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(BkCase, { foreignKey: 'student_id' });

BkCase.belongsTo(Teacher, { as: 'Counselor', foreignKey: 'counselor_id' });
Teacher.hasMany(BkCase, { as: 'CounseledCases', foreignKey: 'counselor_id' });

BkCounselingNote.belongsTo(BkCase, { foreignKey: 'case_id' });
BkCase.hasMany(BkCounselingNote, { foreignKey: 'case_id' });

BkCounselingNote.belongsTo(Teacher, { foreignKey: 'counselor_id' });

StudentViolation.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(StudentViolation, { foreignKey: 'student_id' });

StudentViolation.belongsTo(Teacher, { as: 'Reporter', foreignKey: 'reported_by' });

StudentAchievement.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(StudentAchievement, { foreignKey: 'student_id' });

Schedule.belongsTo(Teacher, { foreignKey: 'teacher_id' });
Teacher.hasMany(Schedule, { foreignKey: 'teacher_id' });

Schedule.belongsTo(Class, { foreignKey: 'class_id' });
Class.hasMany(Schedule, { foreignKey: 'class_id' });

Schedule.belongsTo(Subject, { foreignKey: 'subject_id' });
Subject.hasMany(Schedule, { foreignKey: 'subject_id' });

Schedule.belongsTo(Semester, { foreignKey: 'semester_id' });
Semester.hasMany(Schedule, { foreignKey: 'semester_id' });

Attendance.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(Attendance, { foreignKey: 'student_id' });

Grade.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(Grade, { foreignKey: 'student_id' });

Grade.belongsTo(Subject, { foreignKey: 'subject_id' });
Subject.hasMany(Grade, { foreignKey: 'subject_id' });

Grade.belongsTo(Teacher, { foreignKey: 'teacher_id' });
Teacher.hasMany(Grade, { foreignKey: 'teacher_id' });

Grade.belongsTo(Semester, { foreignKey: 'semester_id' });
Semester.hasMany(Grade, { foreignKey: 'semester_id' });

ActivityLog.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(ActivityLog, { foreignKey: 'user_id' });

Notification.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Notification, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Role, User, Class, Teacher, Student, Subject,
  AcademicYear, Semester, TeachingJournal,
  BkCase, BkCounselingNote, StudentViolation, StudentAchievement,
  Schedule, Attendance, Grade, ActivityLog, Notification
};
