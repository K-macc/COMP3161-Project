CREATE DATABASE IF NOT EXISTS OURVLE;
USE OURVLE;

CREATE TABLE User (
    UserID VARCHAR(255) PRIMARY KEY,
    Username VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role ENUM('admin', 'lecturer', 'student') NOT NULL
);

CREATE TABLE Admin (
    AdminID INT PRIMARY KEY,
    UserID VARCHAR(255) UNIQUE NOT NULL,
    AdminName VARCHAR(255) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE
);


CREATE TABLE Student (
    StudentID INT PRIMARY KEY,
    UserID VARCHAR(255) UNIQUE NOT NULL,
    StudentName VARCHAR(255) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE
);

CREATE TABLE Lecturer (
    LecturerID INT PRIMARY KEY,
    UserID VARCHAR(255) UNIQUE NOT NULL,
    LecturerName VARCHAR(255) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE
);

CREATE TABLE Course (
    CourseID VARCHAR(255) PRIMARY KEY,
    CourseName VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Section (
    SectionID INT PRIMARY KEY,
    CourseID VARCHAR(255) NOT NULL,
    LectureSlides TEXT,
    Files TEXT,
    Links TEXT,
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID) ON DELETE CASCADE
);

CREATE TABLE Teaches (
    LecturerID INT NOT NULL,
    CourseID VARCHAR(255) NOT NULL,
    PRIMARY KEY (LecturerID, CourseID),
    FOREIGN KEY (LecturerID) REFERENCES Lecturer(LecturerID) ON DELETE CASCADE,
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID) ON DELETE CASCADE
);

CREATE TABLE Enrols (
    StudentID INT NOT NULL,
    CourseID VARCHAR(255) NOT NULL,
    PRIMARY KEY (StudentID, CourseID),
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID) ON DELETE CASCADE,
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID) ON DELETE CASCADE
);

CREATE TABLE DiscussionForum (
    ForumID INT PRIMARY KEY,
    CourseID VARCHAR(255) NOT NULL,
    Subject VARCHAR(255) NOT NULL,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID) ON DELETE CASCADE
);

CREATE TABLE DiscussionThread (
    ThreadID INT PRIMARY KEY,
    ForumID INT NOT NULL,
    Title VARCHAR(255) NOT NULL,
    Post TEXT NOT NULL,
    CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ForumID) REFERENCES DiscussionForum(ForumID) ON DELETE CASCADE
);

CREATE TABLE Reply (
    ReplyID INT PRIMARY KEY,
    ThreadID INT NOT NULL,
    Reply TEXT NOT NULL,
    ReplyTo INT NULL,
    FOREIGN KEY (ThreadID) REFERENCES DiscussionThread(ThreadID) ON DELETE CASCADE,
    FOREIGN KEY (ReplyTo) REFERENCES Reply(ReplyID) ON DELETE CASCADE
);

CREATE TABLE CalendarEvent (
    CalendarID INT PRIMARY KEY,
    CourseID VARCHAR(255) NOT NULL,
    EventTitle VARCHAR(255) NOT NULL,
    EventDescription TEXT NOT NULL,
    EventDate DATE NOT NULL,
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID) ON DELETE CASCADE
);

CREATE TABLE Assignment (
    AssignmentID INT PRIMARY KEY,
    AssignmentName VARCHAR(255) NOT NULL,
    CourseID VARCHAR(255) NOT NULL,
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID) ON DELETE CASCADE
);

CREATE TABLE Submits (
    SubmissionID INT PRIMARY KEY,
    StudentID INT NOT NULL,
    AssignmentID INT NOT NULL,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID) ON DELETE CASCADE,
    FOREIGN KEY (AssignmentID) REFERENCES Assignment(AssignmentID) ON DELETE CASCADE
);

CREATE TABLE Grades (
    AssignmentID INT NOT NULL,
    StudentID INT NOT NULL,
    Grade INT NOT NULL,
    PRIMARY KEY (AssignmentID, StudentID),
    FOREIGN KEY (AssignmentID) REFERENCES Assignment(AssignmentID) ON DELETE CASCADE,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID) ON DELETE CASCADE
);

CREATE USER IF NOT EXISTS 'vle_admin'@'localhost' IDENTIFIED BY 'admin123';

GRANT ALL PRIVILEGES ON OURVLE.* TO 'vle_admin'@'localhost';

FLUSH PRIVILEGES;

-- All courses that have 50 or more students
SELECT CourseID, COUNT(*) AS No_of_Students
FROM Enrols
GROUP BY CourseID
HAVING COUNT(*) >= 50;


-- All students that do 5 or more courses
SELECT StudentName, COUNT(CourseID) AS No_of_Courses
FROM Student
JOIN Enrols ON Student.StudentID = Enrols.StudentID
GROUP BY Student.StudentID 
HAVING No_of_Courses >= 5;


-- All lecturers that teach 3 or more courses
SELECT LecturerName, COUNT(CourseID) AS No_of_Courses
FROM Lecturer
JOIN Teaches ON Lecturer.LecturerID = Teaches.LecturerID
GROUP BY Lecturer.LecturerID
HAVING No_of_Courses >= 3;


-- The 10 most enrolled courses
SELECT CourseID, COUNT(*) AS No_of_Students
FROM Enrols
GROUP BY CourseID
ORDER BY No_of_Students DESC
LIMIT 10;


-- The top 10 students with the highest overall averages
SELECT StudentName, ROUND(AVG(Grade),2) AS Avg_Grade
FROM Student
JOIN Grades ON Student.StudentID = Grades.StudentID
GROUP BY Student.StudentID
ORDER BY Avg_Grade DESC
LIMIT 10;
