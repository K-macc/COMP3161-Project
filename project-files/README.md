# COMP3161-Project

**Note: For smooth integration of data:**
1. Create the database and the tables (run create_tables.sql in your sql environment)
2. Run insert_sql_queries.py to insert the statements. 
3. Run apache and sql from xampp
4. Go to react-frontend/course-management-system in your terminal and run 'npm install' 
5. In that same terminal, run 'npm run dev' and click the link that shows up (run 'npm install vite --save-dev' if it says vite isn't present)
6. Create a new terminal and navigate to the project-files folder
7. Run 'pip install flask' (If pip doesn't work you might need to download pip)
8. Run 'flask --app app --debug run'



**database username: vle_admin**

**database password: admin123**

**P.S. - You can run the report queries if you feel curious (more than likely Vedang)**

### **Roshae: Database Design & ERD (*Deadline: March 24*)**

- Update **ERD diagram** based on the project requirements.
- Convert the ERD into **normalized relational tables**. ✅
- Write **SQL scripts** to create the database and tables.✅

### **Keshawn: Data Insertion & SQL Queries (*Deadline: April 2*)**

- Insert **100,000 students, 200 courses**, and other required data while following constraints. ✅
- Write SQL **queries to insert** data efficiently (bulk inserts). ✅
- Create **views for reports** (most enrolled courses, top students, etc.). ✅

### **Vedang: Backend API Development (User & Course Management) (*Deadline: April 9*)**

- Implement **User Registration & Login**. ✅
- Implement **Course-related endpoints** (create, retrieve, register students). ✅
- Ensure **admin-only restrictions** for course creation. ✅

### **Brianna: Backend API Development (Features & Functionality) (*Deadline: April 12*)**

- Implement **calendar events** (create, retrieve for courses/students). ✅
- Implement **forums & discussion threads** (support replies). ✅
- Implement **course content upload & retrieval** (handle files, links, slides). ✅

### **Jada: Assignments, Reports & Postman Collection (*Deadline: April 16*)**

- Implement **assignment submission, grading, and final average calculation**.
- Develop SQL **queries for reports** (e.g., students with 5+ courses, top 10 students).
- Create and test the **Postman collection** to verify all API endpoints work properly.

### **Roshae: (Bonus) (*Deadline: April 20*)**
- JWT Authentication and Authorization
