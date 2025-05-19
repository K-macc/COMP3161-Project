import random
import faker
from tzlocal import get_localzone 
import pytz
import datetime
import time


# Initialize Faker
fake = faker.Faker()

local_tz = get_localzone()

naive_dt = fake.date_time_between(start_date="-1y", end_date="now")


now = datetime.datetime.now()
two_months_later = now + datetime.timedelta(days=60)

naive_due_t = fake.date_time_between(start_date=now, end_date=two_months_later)

num = 0

# Open SQL file for writing
try:
    with open("insert_sql_queries.sql", "w") as f:
        users = []
        admin_ids = []
        lecturer_ids = []
        student_ids = []
        id_roles = []

        # Step 1: Generate Users
        for i in range(1, 11):
            user_id = "USER-" + str(i).zfill(6)
            name = fake.name()
            username = name.replace(" ", "").lower()
            password = fake.password(
                length=10,
                special_chars=True,
                digits=True,
                upper_case=True,
                lower_case=True,
            )
            role = "admin"
            admin_ids.append(
                (user_id, name, username)
            )  # also save username to use in email
            users.append((user_id, username, password, role))
            f.write(
                f"INSERT INTO User (UserID, Username, Password, Role) VALUES ('{user_id}', '{username}', '{password}', '{role}');\n"
            )
            print(f" Statement#{num}: Insert statements created for admin user")
            num += 1

        for i in range(11, 61):
            user_id = "USER-" + str(i).zfill(6)
            name = fake.name()
            username = name.replace(" ", "").lower()
            password = fake.password(
                length=10,
                special_chars=True,
                digits=True,
                upper_case=True,
                lower_case=True,
            )
            role = "lecturer"
            lecturer_ids.append((user_id, name, username))
            users.append((user_id, username, password, role))
            f.write(
                f"INSERT INTO User (UserID, Username, Password, Role) VALUES ('{user_id}', '{username}', '{password}', '{role}');\n"
            )
            print(f" Statement#{num}: Insert statements created for lecturer user")
            num += 1

        for i in range(61, 100061):
            user_id = "USER-" + str(i).zfill(6)
            name = fake.name()
            username = name.replace(" ", "").lower()
            password = fake.password(
                length=10,
                special_chars=True,
                digits=True,
                upper_case=True,
                lower_case=True,
            )
            role = "student"
            student_ids.append((user_id, name, username))
            users.append((user_id, username, password, role))
            f.write(
                f"INSERT INTO User (UserID, Username, Password, Role) VALUES ('{user_id}', '{username}', '{password}', '{role}');\n"
            )
            print(f" Statement#{num}: Insert statements created for student user")
            num += 1

        f.write("\n")

        # Step 2: Generate Admins
        admins = []
        for i in range(1, 11):
            admin_id = i
            admin_user_id, admin_name, admin_username = admin_ids.pop(0)
            email = f"{admin_username}@admin.uwi"
            admins.append((admin_id, admin_user_id, admin_name, email))
            f.write(
                f"INSERT INTO Admin (AdminID, UserID, AdminName, Email) VALUES ({admin_id}, '{admin_user_id}', '{admin_name}', '{email}');\n"
            )
            print(f" Statement#{num}: Insert statements created for admin")
            num += 1

        f.write("\n")

        # Step 3: Generate Lecturers
        lecturers = []
        for i in range(1, 51):
            lec_id = i
            l_user_id, lec_name, lec_username = lecturer_ids.pop(0)
            email = f"{lec_username}@uwimona.edu"
            lecturers.append((lec_id, l_user_id, lec_name, email))
            f.write(
                f"INSERT INTO Lecturer (LecturerID, UserID, LecturerName, Email) VALUES ({lec_id}, '{l_user_id}', '{lec_name}', '{email}');\n"
            )
            print(f" Statement#{num}: Insert statements created for lecturer")
            num += 1

        f.write("\n")

        # Step 4: Generate Students
        students = []
        for i in range(1, 100001):
            student_id = int("620" + (str(i).zfill(6)))
            s_user_id, student_name, student_username = student_ids.pop(0)
            email = f"{student_username}@mymona.uwi.edu"
            students.append((student_id, s_user_id, student_name, email))
            f.write(
                f"INSERT INTO Student (StudentID, UserID, StudentName, Email) VALUES ({student_id}, '{s_user_id}', '{student_name}', '{email}');\n"
            )
            print(f" Statement#{num}: Insert statements created for student")
            num += 1

        f.write("\n")

        # Step 5: Generate Courses
        courses = []
        course_ids = []
        departments = {
            "Biology": "BIOL",
            "Chemistry": "CHEM",
            "Computer Science": "COMP",
            "History": "HIST",
            "Law": "LAW",
            "Mathematics": "MATH",
            "Media": "MDIA",
            "Physics": "PHYS",
            "Psycology": "PSYC",
            "Sociology": "SOCI",
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
            "Plant Physiology",
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
            "Cosmology",
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
            "Mathematical Modelling",
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
            "Embedded Systems",
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
            "Materials Chemistry",
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
            "Human Rights Law",
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
            "New Media Technologies",
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
            "Cultural Psychology",
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
            "Qualitative Research Methods",
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
            "Environmental History",
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

            for i in range(1, 21):
                course_name = switch(abbreviation)
                # Generate a random course name
                course_id = f"{abbreviation}{random.randint(1000, 3999)}"  # Create a course code
                if course_id in course_ids:
                    course_id = f"{abbreviation}{random.randint(1000, 3999)}"
                course_ids.append(course_id)
                courses.append((course_id, course_name))
                f.write(
                    f"INSERT INTO Course (CourseID, CourseName) VALUES ('{course_id}', '{course_name}');\n"
                )
                print(f" Statement#{num}: Insert statements created for course")
                num += 1

        f.write("\n")

        # Step 6: Assign courses to student
        enrollments = []
        for student in students:
            student_id = student[0]
            num_courses = random.randint(3, 6)
            enrolled_courses = random.sample(
                [course[1] for course in courses], num_courses
            )
            for course in courses:
                course_id, name = course
                if name in enrolled_courses:
                    enrollments.append((student_id, course_id))
                    f.write(
                        f"INSERT INTO Enrols (StudentID, CourseID) VALUES ({student_id}, '{course_id}');\n"
                    )
                    print(f" Statement#{num}: Insert statements created for enrols")
                    num += 1

        # Step 7: Assign minimum number of students to a course
        course_student = {course_id: 0 for course_id in course_ids}
        for student_id, course_id in enrollments:
            course_student[course_id] += 1

        for course_id, num_students in course_student.items():
            while num_students < 10:
                student_id = random.choice([student[0] for student in students])
                if (student_id, course_id) not in enrollments:
                    enrollments.append((student_id, course_id))
                    f.write(
                        f"INSERT INTO Enrols (StudentID, CourseID) VALUES ({student_id}, '{course_id}');\n"
                    )
                    num_students += 1
                    print(f" Statement#{num}: Insert statements created for enrols")
                    num += 1

        f.write("\n")

        # Step 8: Assign courses to lecturers
        teaches = []
        assigned_courses = set()
        for lecturer in lecturers:
            lec_id = lecturer[0]
            available_courses = [
                course for course in courses if course[1] not in assigned_courses
            ]  # Get unassigned courses only
            if not available_courses:
                break  # No more courses left to assign
            num_courses = min(
                random.randint(1, 5), len(available_courses)
            )  # Assign a random number of courses, up to the number of available courses
            selected_courses = random.sample(available_courses, num_courses)
            for course in selected_courses:
                course_id, name = course
                teaches.append((lec_id, course_id))
                assigned_courses.add(name)
                f.write(
                    f"INSERT INTO Teaches (LecturerID, CourseID) VALUES ({lec_id}, '{course_id}');\n"
                )
                print(f" Statement#{num}: Insert statements created for teaches")
                num += 1

        f.write("\n")

        # Step 9: Generate Section Info
        section_info = []
        section_id = 1
        for course in courses:
            course_id = course[0]
            for i in range(1, 6):
                lec_slide = fake.text(max_nb_chars=20)
                files = fake.file_name(extension="pdf")
                links = fake.url()
                section_info.append((section_id, course_id, lec_slide, files, links))
                f.write(
                    f"INSERT INTO Section (SectionID, CourseID, LectureSlides, Files, Links) VALUES ({section_id}, '{course_id}', '{lec_slide}', '{files}', '{links}');\n"
                )
                section_id += 1
                print(f" Statement#{num}: Insert statements created for section")
                num += 1

        f.write("\n")

        # Step 10: Generate Discussion Forum
        discussion_forum = []
        forum_id = 1
        for course in courses:
            course_id = course[0]
            for i in range(1, 4):
                subject = fake.sentence(nb_words=10)
                date = naive_dt.replace(tzinfo=datetime.timezone.utc).astimezone(local_tz)
                discussion_forum.append((forum_id, course_id, subject, date))
                f.write(
                    f"INSERT INTO DiscussionForum (ForumID, CourseID, Subject, DateCreated) VALUES ({forum_id}, '{course_id}', '{subject}', '{date}');\n"
                )
                forum_id += 1
                print(
                    f" Statement#{num}: Insert statements created for discussion forum"
                )
                num += 1

        f.write("\n")

        # Step 11: Generate Discussion Thread
        discussion_thread = []
        thread_id = 1
        for forum in discussion_forum:
            forum_id = forum[0]
            for i in range(1, 5):
                title = fake.sentence(nb_words=7)
                post = fake.text(max_nb_chars=50)
                date = naive_dt.replace(tzinfo=datetime.timezone.utc).astimezone(local_tz)
                discussion_thread.append((thread_id, forum_id, title, post, date))
                f.write(
                    f"INSERT INTO DiscussionThread (ThreadID, ForumID, Title, Post, CreationDate) VALUES ({thread_id}, {forum_id}, '{title}', '{post}', '{date}');\n"
                )
                thread_id += 1
                print(
                    f" Statement#{num}: Insert statements created for discussion thread"
                )
                num += 1

        f.write("\n")

        # Step 12: Generate Reply
        replies = []
        reply_id = 1

        for thread in discussion_thread:
            thread_id = thread[0]
            thread_reply_ids = []

            # Create first 3 base replies (not replying to anyone)
            for i in range(3):
                reply = fake.text(max_nb_chars=50)
                replies.append((reply_id, thread_id, reply, None))
                thread_reply_ids.append(reply_id)
                f.write(
                    f"INSERT INTO Reply (ReplyID, ThreadID, Reply, ReplyTo) VALUES ({reply_id}, {thread_id}, '{reply}', NULL);\n"
                )
                print(f" Statement#{num}: Insert statements created for base reply")
                reply_id += 1
                num += 1

            # Create next 3 replies, each replying to one of the first 3
            for i in range(3):
                reply = fake.text(max_nb_chars=50)
                reply_to = random.choice(
                    thread_reply_ids
                )  # reply to one of the first 3 replies in this thread
                replies.append((reply_id, thread_id, reply, reply_to))
                thread_reply_ids.append(reply_id)
                f.write(
                    f"INSERT INTO Reply (ReplyID, ThreadID, Reply, ReplyTo) VALUES ({reply_id}, {thread_id}, '{reply}', {reply_to});\n"
                )
                print(f" Statement#{num}: Insert statements created for threaded reply")
                reply_id += 1
                num += 1

        f.write("\n")

        # Step 13: Generate Calendar Event
        calendar_events = []
        event_id = 1
        for course in courses:
            course_id = course[0]

            # Choose 2–4 unique days for this course (in the past year)
            num_days = random.randint(2, 4)
            event_days = [
                fake.date_time_between(start_date="-1y", end_date="now").date()
                for _ in range(num_days)
            ]

            for event_day in event_days:
                events_today = random.randint(1, 4)

                for _ in range(events_today):
                    # Create naive datetime with a random time
                    random_time = datetime.time(
                        hour=random.randint(8, 18), minute=random.choice([0, 15, 30, 45])
                    )
                    
                    date = datetime.datetime.combine(event_day, random_time)

                    # Generate event details
                    event_name = fake.text(max_nb_chars=20).replace("'", "''")
                    event_description = fake.text(max_nb_chars=40).replace("'", "''")

                    calendar_events.append(
                        (event_id, course_id, event_name, event_description, date)
                    )

                    f.write(
                        f"INSERT INTO CalendarEvent (CalendarID, CourseID, EventTitle, EventDescription, EventDate) "
                        f"VALUES ({event_id}, '{course_id}', '{event_name}', '{event_description}', '{date}');\n"
                    )

                    print(f" Statement#{num}: Insert statements created for calendar event")
                    event_id += 1
                    num += 1

        f.write("\n")

        # Step 14: Generate Assignment
        assignments = []
        assignment_id = 1
        for course in courses:
            course_id = course[0]
            for i in range(1, 4):
                assignment_name = fake.text(max_nb_chars=20)
                due_date = naive_dt.replace(tzinfo=datetime.timezone.utc).astimezone(local_tz)
                assignment_file = f"{fake.word()}.pdf"
                assignment_link = fake.url()

                assignments.append(
                    (
                        assignment_id,
                        assignment_name,
                        due_date,
                        assignment_file,
                        assignment_link,
                        course_id,
                    )
                )
                f.write(
                    f"INSERT INTO Assignment (AssignmentID, AssignmentName, DueDate, AssignmentFile, AssignmentLink, CourseID) "
                    f"VALUES ({assignment_id}, '{assignment_name}', '{due_date}', '{assignment_file}', '{assignment_link}', '{course_id}');\n"
                )

                assignment_id += 1

                print(f" Statement#{num}: Insert statements created for assignment")
                num += 1

        f.write("\n")

        # Step 15: Generate Assignment Submission
        assignment_submissions = []
        submission_id = 1
        for student_id, course_id in enrollments:
            course_assignments = [x for x in assignments if x[5] == course_id]
            assign_no = random.randint(0, 2)
            assign = course_assignments[assign_no]
            assignment_id = assign[0]

            submission_file = f"{fake.word()}_submission.pdf"
            submission_link = fake.url()

            assignment_submissions.append(
                (
                    submission_id,
                    student_id,
                    assignment_id,
                    submission_file,
                    submission_link,
                )
            )
            f.write(
                f"INSERT INTO Submits (SubmissionID, SubmissionFile, SubmissionLink, StudentID, AssignmentID) "
                f"VALUES ({submission_id}, '{submission_file}', '{submission_link}', {student_id}, {assignment_id});\n"
            )
            submission_id += 1
            print(f" Statement#{num}: Insert statements created for submits")
            num += 1

        f.write("\n")

        # Step 16: Generate Assignment Grade
        assignment_grades = []
        for submission in assignment_submissions:
            student_id = submission[1]
            assignment_id = submission[2]
            grade = random.randint(45, 100)
            assignment_grades.append((assignment_id, student_id, grade))
            f.write(
                f"INSERT INTO Grades (AssignmentID, StudentID, Grade) VALUES ({assignment_id}, {student_id}, {grade});\n"
            )
            print(f" Statement#{num}: Insert statements created for grades")
            num += 1

        f.write("\n")

    print("SQL file 'insert_sql_queries.sql' has been successfully generated✅.")
except IOError as e:
    print(f"An error occurred while writing to the file: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
