import random
import faker
import datetime


# Initialize Faker
fake = faker.Faker()




# Open SQL file for writing
with open("C:/Users/Umesh/Desktop/COMP3161-Project/COMP3161-Project/insert_sql_queries.sql", "w") as f:

   
    #Step 1: Generate User IDs
    users = []
    admin_ids = []
    lecturer_ids = []
    student_ids = []
    id_roles = []
    for i in range(1, 11):
        user_id = "USER-" + str(i).zfill(6)
        username = fake.user_name()
        password = fake.password(length = 10, special_chars = True, digits = True, upper_case = True, lower_case = True)
        role = "admin"
        admin_ids.append(user_id)
        users.append((user_id, username, password, role))
        f.write(f"INSERT INTO User (UserID, Username, Password, Role) VALUES ('{user_id}', '{username}', '{password}', '{role}');\n")
    for i in range(11, 61):
        user_id = "USER-" + str(i).zfill(6)
        username = fake.user_name()
        password = fake.password(length = 10, special_chars = True, digits = True, upper_case = True, lower_case = True)
        role = "lecturer"
        lecturer_ids.append(user_id)
        users.append((user_id, username, password, role))
        f.write(f"INSERT INTO User (UserID, Username, Password, Role) VALUES ('{user_id}', '{username}', '{password}', '{role}');\n")
    for i in range(61, 100061):
        user_id = "USER-" + str(i).zfill(6)
        username = fake.user_name()
        password = fake.password(length = 10, special_chars = True, digits = True, upper_case = True, lower_case = True)
        role = "student"
        student_ids.append(user_id)
        users.append((user_id, username, password, role))
        f.write(f"INSERT INTO User (UserID, Username, Password, Role) VALUES ('{user_id}', '{username}', '{password}', '{role}');\n")
    
        
        f.write("\n")
        
    
    #Step 2: Generate Admins
    admins = []
    for i in range(1, 11):
        admin_id = i
        admin_user_id = admin_ids[0]
        admin_ids.remove(admin_user_id)
        admin_name = fake.name()
        admins.append((admin_id, admin_user_id, admin_name))
        f.write(f"INSERT INTO Admin (AdminID, UserID, AdminName) VALUES ({admin_id}, '{admin_user_id}', '{admin_name}');\n")
        
        f.write("\n")
        
    # Step 3: Generate Lecturers
    lecturers = []
    for i in range(1, 51):
        lec_id = i
        lec_name = fake.name()
        l_user_id = lecturer_ids[0]
        lecturer_ids.remove(l_user_id)
        lecturers.append((lec_id, l_user_id, lec_name))
        f.write(f"INSERT INTO Lecturer (LecturerID, UserID, LecturerName) VALUES ({lec_id}, '{l_user_id}', '{lec_name}');\n")

    f.write("\n")
     
    # Step 4: Generate Students
    students = []
    for i in range(1,100001):
        student_id = int("620" + (str(i).zfill(6)))
        student_name = fake.name()
        s_user_id = student_ids[0]
        student_ids.remove(s_user_id)
        students.append((student_id, s_user_id, student_name))
        f.write(f"INSERT INTO Student (StudentID, UserID, StudentName) VALUES ({student_id}, '{s_user_id}', '{student_name}');\n")
        
        f.write("\n")
        
        
        
    # Step 5: Generate Courses 
    courses = []
    course_ids = []
    departments = {
        "Biology":"BIOL",
        "Chemistry":"CHEM",
        "Computer Science":"COMP",
        "Mathematics":"MATH",
        "Physics":"PHYS",
        "Law":"LAW",
        "Media":"MDIA",
        "Psycology":"PSYC",
        "Sociology":"SOCI",
        "History":"HIST"
    }
    
    
    biology_courses = [
    "Introduction to Biology",
    "Cell Biology",
    "Genetics",
    "Human Anatomy and Physiology",
    "Ecology",
    "Molecular Biology",
    "Microbiology",
    "Biochemistry",
    "Botany",
    "Zoology",
    "Evolutionary Biology",
    "Immunology",
    "Neuroscience",
    "Developmental Biology",
    "Marine Biology",
    "Environmental Biology",
    "Bioinformatics",
    "Parasitology",
    "Comparative Anatomy",
    "Plant Physiology"
    ]
    
    physics_courses = [
    "Classical Mechanics", 
    "Quantum Physics", 
    "Electromagnetism", 
    "Thermodynamics", 
    "Solid State Physics", 
    "Fluid Mechanics", 
    "Particle Physics", 
    "Nuclear Physics", 
    "Astrophysics", 
    "Relativity",
    "Optics",
    "Statistical Mechanics",
    "Computational Physics",
    "Plasma Physics",
    "Biophysics",
    "Condensed Matter Physics",
    "Mathematical Physics",
    "General Physics Laboratory",
    "Quantum Field Theory",
    "Cosmology"
    ]
    
    math_courses = [
    "Calculus I",
    "Linear Algebra",
    "Discrete Mathematics",
    "Probability and Statistics",
    "Abstract Algebra",
    "Real Analysis",
    "Differential Equations",
    "Mathematical Logic",
    "Number Theory",
    "Time Series",
    "Multivariable Calculus",
    "Topology",
    "Complex Analysis",
    "Graph Theory",
    "Optimization",
    "Numerical Methods",
    "Game Theory",
    "Functional Analysis",
    "Partial Differential Equations",
    "Mathematical Modelling"
    ]


    cs_courses = [
    "Introduction to Computer Science",
    "Data Structures and Algorithms",
    "Operating Systems",
    "Database Management Systems",
    "Artificial Intelligence",
    "Machine Learning",
    "Computer Networks",
    "Cybersecurity",
    "Software Engineering",
    "Web Development",
    "Computer Graphics",
    "Human-Computer Interaction",
    "Cloud Computing",
    "Parallel and Distributed Computing",
    "Blockchain Technology",
    "Computer Vision",
    "Internet of Things (IoT)",
    "Natural Language Processing",
    "Quantum Computing",
    "Embedded Systems"
    ]



    chemistry_courses = [
    "Organic Chemistry", 
    "Physical Chemistry", 
    "Inorganic Chemistry", 
    "Bioinorganic Chemistry", 
    "Analytical Chemistry", 
    "Chemical Engineering", 
    "Environmental Chemistry", 
    "Pharmacology", 
    "Medicinal Chemistry", 
    "Chemical Thermodynamics",
    "Quantum Chemistry",
    "Polymer Chemistry",
    "Industrial Chemistry",
    "Forensic Chemistry",
    "Computational Chemistry",
    "Nanotechnology in Chemistry",
    "Spectroscopy and Instrumentation",
    "Green Chemistry",
    "Radiochemistry",
    "Materials Chemistry"
    ]
    
    law_courses = [
    "Introduction to Law",
    "Constitutional Law",
    "Criminal Law",
    "Civil Procedure",
    "Contract Law",
    "Tort Law",
    "Family Law",
    "Property Law",
    "International Law",
    "Legal Research and Writing",
    "Administrative Law",
    "Labor and Employment Law",
    "Intellectual Property Law",
    "Environmental Law",
    "Corporate Law",
    "Tax Law",
    "Real Estate Law",
    "Evidence Law",
    "Dispute Resolution and Negotiation",
    "Human Rights Law"
    ]

    
    media_courses = [
    "Introduction to Media Studies",
    "Digital Media Production",
    "Media Writing and Reporting",
    "Media Ethics",
    "Journalism in the Digital Age",
    "Broadcast Journalism",
    "Television Production",
    "Social Media and Society",
    "Film Studies",
    "Digital Storytelling",
    "Media Law and Regulation",
    "Communication Theory",
    "Public Relations Strategies",
    "Media Criticism and Analysis",
    "Advertising and Media",
    "Media and Cultural Studies",
    "Media Management",
    "Interactive Media and Design",
    "Documentary Filmmaking",
    "New Media Technologies"
    ]


    
    psychology_courses = [
    "Introduction to Psychology",
    "Cognitive Psychology",
    "Developmental Psychology",
    "Abnormal Psychology",
    "Clinical Psychology",
    "Social Psychology",
    "Neuroscience and Behavior",
    "Personality Theories",
    "Forensic Psychology",
    "Health Psychology",
    "Educational Psychology",
    "Positive Psychology",
    "Industrial-Organizational Psychology",
    "Psychological Research Methods",
    "Psychology of Learning",
    "Psychological Statistics",
    "Human Sexuality",
    "Counseling and Psychotherapy",
    "Addiction Psychology",
    "Cultural Psychology"
    ]
    
    sociology_courses = [
    "Introduction to Sociology",
    "Social Theory",
    "Sociology of Gender",
    "Race and Ethnicity",
    "Social Stratification",
    "Urban Sociology",
    "Globalization and Society",
    "Environmental Sociology",
    "Political Sociology",
    "Sociology of Education",
    "Medical Sociology",
    "Criminology",
    "Deviance and Social Control",
    "Family Sociology",
    "Work and Organizations",
    "Cultural Sociology",
    "Sociology of Religion",
    "Sociology of Media",
    "Quantitative Research Methods",
    "Qualitative Research Methods"
    ]
    
    history_courses = [
    "World History",
    "Ancient Civilizations",
    "Medieval History",
    "Modern European History",
    "History of the United States",
    "History of Latin America",
    "African History",
    "Asian History",
    "Middle Eastern History",
    "History of Warfare",
    "Economic History",
    "Political History",
    "Social History",
    "History of Science and Technology",
    "Cold War History",
    "History of Revolutions",
    "Colonial and Postcolonial History",
    "Historiography",
    "Art and Cultural History",
    "Environmental History"
    ]


    def switch(option):
        if option == "COMP":
            choice = random.choice(cs_courses)
            cs_courses.remove(choice)
            return choice
        elif option == "BIOL":
            choice = random.choice(biology_courses)
            biology_courses.remove(choice)
            return choice
        elif option == "CHEM":
            choice = random.choice(chemistry_courses)
            chemistry_courses.remove(choice)
            return choice
        elif option == "PHYS":
            choice = random.choice(physics_courses)
            physics_courses.remove(choice)
            return choice
        elif option == "MATH":
            choice = random.choice(math_courses)
            math_courses.remove(choice)
            return choice
        elif option == "LAW":
            choice = random.choice(law_courses)
            law_courses.remove(choice)
            return choice
        elif option == "MDIA":
            choice = random.choice(media_courses)
            media_courses.remove(choice)
            return choice
        elif option == "PSYC":
            choice = random.choice(psychology_courses)
            psychology_courses.remove(choice)
            return choice
        elif option == "SOCI":
            choice = random.choice(sociology_courses)
            sociology_courses.remove(choice)
            return choice
        else:
            choice = random.choice(history_courses)
            history_courses.remove(choice)
            return choice


    for department in departments.keys():
        abbreviation = departments[department]  # Get abbreviation
        for i in range(1,21):
            course_name = switch(abbreviation)
            # Generate a random course name
            course_id = f"{abbreviation}{random.randint(1000, 3999)}"  # Create a course code
            if course_id in course_ids:
                course_id = f"{abbreviation}{random.randint(1000, 3999)}"
            course_ids.append(course_id)
            courses.append((course_id, course_name))
            f.write(f"INSERT INTO Course (CourseID, CourseName) VALUES ('{course_id}', '{course_name}');\n")
        

    f.write("\n")

    # Step 6: Assign courses to student
    enrollments = []
    for student in students:
        student_id = student[0]
        num_courses = random.randint(3,6)
        enrolled_courses = random.sample([course[1] for course in courses], num_courses)
        for course in courses:
            course_id, name = course
            if name in enrolled_courses:
                enrollments.append((student_id,course_id))
                f.write(f"INSERT INTO Enrols (StudentID, CourseID) VALUES ({student_id}, '{course_id}');\n")
                
                
    #Step 7: Assign minimum number of students to a course            
    course_student = {course_id: 0 for course_id in course_ids}
    for student_id, course_id in enrollments:
        course_student[course_id] += 1
        
    for course_id, num_students in course_student.items():
        while num_students < 10:
            student_id = random.choice([student[0] for student in students])
            if (student_id,course_id) not in enrollments:
                f.write(f"INSERT INTO Enrols (StudentID, CourseID) VALUES ({student_id}, '{course_id}');\n")
                num_students += 1
                
    f.write("\n")
       
       
    # Step 8: Assign courses to lecturers     
    teaches = []
    for lecturer in lecturers:
        lec_id = lecturer[0]
        num_courses = random.randint(1,5)
        enrolled_courses = random.sample([course[1] for course in courses], num_courses)
        for course in courses:
            course_id, name = course
            if name in enrolled_courses:
                teaches.append((lec_id,course_id))
                f.write(f"INSERT INTO Teaches (LecturerID, CourseID) VALUES ({lec_id}, '{course_id}');\n")
        
    f.write("\n")
    
   
    #Step 9: Generate Section Info
    section_info = []
    section_id = 1
    for course in courses:
        course_id = course[0]
        for i in range(1,6):
            lec_slide = fake.text(max_nb_chars = 20)
            files = fake.file_name(extension = "pdf")
            links = fake.url()
            section_info.append((section_id, course_id, lec_slide, files, links))
            f.write(f"INSERT INTO Section (SectionID, CourseID, LectureSlides, Files, Links) VALUES ({section_id}, '{course_id}', '{lec_slide}', '{files}', '{links}');\n")
            section_id += 1
            
    f.write("\n")
    
    
    #Step 10: Generate Discussion Forum
    discussion_forum = []
    forum_id = 1
    for course in courses:
        course_id = course[0]
        for i in range(1,4):
            subject = fake.sentence(nb_words = 10)
            date = datetime.datetime.fromtimestamp(fake.date_time_between(start_date = '-1y', end_date = 'now').timestamp())
            discussion_forum.append((forum_id, course_id, subject, date))
            f.write(f"INSERT INTO DiscussionForum (ForumID, CourseID, Subject, DateCreated) VALUES ({forum_id}, '{course_id}', '{subject}', '{date}');\n")
            forum_id += 1
                        
    f.write("\n")
    
    
    #Step 11: Generate Discussion Thread
    discussion_thread = []
    thread_id = 1
    for forum in discussion_forum:
        forum_id = forum[0]
        for i in range(1,5):
            title = fake.sentence(nb_words = 7)
            post = fake.text(max_nb_chars = 50)
            date = datetime.datetime.fromtimestamp(fake.date_time_between(start_date = '-1y', end_date = 'now').timestamp())
            discussion_thread.append((thread_id, forum_id, title, post, date))
            f.write(f"INSERT INTO DiscussionThread (ThreadID, ForumID, Title, Post, CreationDate) VALUES ({thread_id}, {forum_id}, '{title}', '{post}', '{date}');\n")
            thread_id += 1
            
    f.write("\n")
    
    
    #Step 12: Generate Reply
    replies = []
    reply_ids = [None]
    reply_id = 1
    for thread in discussion_thread:
        thread_id = thread[0]
        for i in range(1,4):
            reply = fake.text(max_nb_chars = 50)
            if replies == []:
                reply_to = None
                replies.append((reply_id, thread_id, reply, reply_to))
            else:
                reply = fake.text(max_nb_chars = 50)
                reply_to = random.choice(reply_ids)
                replies.append((reply_id, thread_id, reply, reply_to))
            reply_ids.append(reply_id)
            if reply_to is None:
                f.write(f"INSERT INTO Reply (ReplyID, ThreadID, Reply, ReplyTo) VALUES ({reply_id}, {thread_id}, '{reply}', NULL);\n")
            else:
                f.write(f"INSERT INTO Reply (ReplyID, ThreadID, Reply, ReplyTo) VALUES ({reply_id}, {thread_id}, '{reply}', {reply_to});\n")
            reply_id += 1
            
    f.write("\n")
    
    
    #Step 13: Generate Calendar Event
    calendar_events = []
    event_id = 1
    for course in courses:
        course_id = course[0]
        for i in range(1,4):
            event_name = fake.text(max_nb_chars = 20)
            event_description = fake.text(max_nb_chars = 40)
            date = datetime.datetime.fromtimestamp(fake.date_time_between(start_date = '-1y', end_date = 'now').timestamp())
            calendar_events.append((event_id, course_id, event_name, event_description, date))
            f.write(f"INSERT INTO CalendarEvent (CalendarID, CourseID, EventTitle, EventDescription, EventDate) VALUES ({event_id}, '{course_id}', '{event_name}', '{event_description}', '{date}');\n")
            event_id += 1
            
    f.write("\n")
    
    
    #Step 14: Generate Assignment
    assignments = []
    assignment_id = 1
    for course in courses:
        course_id = course[0]
        for i in range(1,4):
            assignment_name = fake.text(max_nb_chars = 20)
            assignments.append((assignment_id, course_id, assignment_name))
            f.write(f"INSERT INTO Assignment (AssignmentID, AssignmentName, CourseID) VALUES ({assignment_id}, '{assignment_name}', '{course_id}');\n")
            assignment_id += 1
            
    f.write("\n")
    
    
    #Step 15: Generate Assignment Submission
    assignment_submissions = []
    submission_id = 1
    for student_id, course_id in enrollments:
        course_assignments = [x for x in assignments if x[1] == course_id]
        assign_no = random.randint(0,2)
        assign = course_assignments[assign_no]
        assignment_id = assign[0]
        assignment_submissions.append((submission_id, student_id, assignment_id))
        f.write(f"INSERT INTO Submits (SubmissionID, StudentID, AssignmentID) VALUES ({submission_id}, {student_id}, {assignment_id});\n")
        submission_id += 1
            
    f.write("\n")
    
    
    #Step 16: Generate Assignment Grade
    assignment_grades = []
    for submission in assignment_submissions:
        student_id = submission[1]
        assignment_id = submission[2]
        grade = random.randint(45,100)
        assignment_grades.append((assignment_id, student_id, grade))
        f.write(f"INSERT INTO Grades (AssignmentID, StudentID, Grade) VALUES ({assignment_id}, {student_id}, {grade});\n")

    f.write("\n")

print("SQL file 'insert_sql_queries.sql' has been successfully generated.")
