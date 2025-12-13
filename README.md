# Learning Management System (LMS)

This is a full-stack Learning Management System (LMS) project built using Django for the backend, Django Rest Framework for the API, and React for the frontend. The project supports user authentication and role-based functionality for students, teachers, and admins.

Website Name: CODE FOR YOU

Coding Courses

Student Role:

Students are the primary users consuming content and tracking progress.
Course Enrollment: Browse available courses and enroll.
Dashboard: Personalized view showing enrolled courses, progress, upcoming deadlines, and grades.
Progress Tracking: Visual indicators (progress bars, completion percentages).
Assessments: Submit assignments, take quizzes/tests, and view feedback.
Communication: Messaging or discussion boards with teachers and peers.
Certificates: Download completion certificates (if applicable).

Teacher Role: 

Teachers manage content and interact with students.
Course Creation & Management: Add/edit course titles, descriptions, modules, and resources.
Assignment Management: Create assignments, set deadlines, grade submissions.
Quiz/Exam Builder: Create quizzes with multiple question types.
Student Tracking: View student progress, performance analytics, and attendance.
Feedback & Communication: Provide comments, grades, and announcements.
Content Moderation: Approve or update course materials.

Admin Role: 

Admins oversee the entire system and manage users.
User Management: Create, edit, or deactivate student/teacher accounts.
Role Assignment: Assign roles (student, teacher, admin).
Course Oversight: Approve courses created by teachers, manage categories.
System Settings: Configure authentication, security policies, and integrations.
Analytics Dashboard: System-wide reports (active users, course popularity, completion rates).
Content Moderation: Ensure compliance with standards and remove inappropriate content.
Platform Maintenance: Manage backups, updates, and deployment.

Implementation Notes: 

Authentication & Authorization: Use Django’s built-in authentication with role-based access control.
Frontend Views: React components tailored per role (e.g., student dashboard vs. teacher dashboard).
API Layer: Django REST Framework endpoints secured with permissions (e.g., IsAdminUser, custom role-based permissions).
Database Design:
User table with role field (student/teacher/admin).
Course table linked to teacher.
Enrollment table linking students to courses.
Progress table tracking completion.


<img width="1394" height="838" alt="image" src="https://github.com/user-attachments/assets/d8f32d53-00af-4e91-8c20-5cb72ccd4a0f" />

STUDENT DASHBOARD

<img width="1765" height="959" alt="image" src="https://github.com/user-attachments/assets/620f1606-6388-49c9-8afa-f8f127b4d06b" />

ENROLLMENT DATES
<img width="1369" height="736" alt="image" src="https://github.com/user-attachments/assets/b371a49e-3ea0-4acd-bcbd-acd2e4e6da09" />

SUBMISSION 

<img width="777" height="893" alt="image" src="https://github.com/user-attachments/assets/f52b01df-363a-4adc-802a-7b91502edbf2" />

PROFILE -showing Account Statistics
<img width="1065" height="954" alt="image" src="https://github.com/user-attachments/assets/39873ba5-2274-46de-9b27-04c1db0ac5aa" />

TEACHER DASHBOARD - to show creatng Assignments 

<img width="1240" height="941" alt="image" src="https://github.com/user-attachments/assets/25930d41-54c0-4f27-b1b0-abcd30d9305d" />



Tests have been carried out in POSTMAN 



## Project Structure
```
lms-project/
├── backend/
│ ├── manage.py # Django management script
│ ├── requirements.txt # Python dependencies
│ ├── db.sqlite3 # SQLite database
│ ├── lms_backend/
│ │ ├── settings.py # Django configuration
│ │ ├── urls.py # Main URL routing
│ │ └── wsgi.py # WSGI application
│ └── apps/
│ ├── users/ # User authentication & profiles
│ │ ├── models.py # Custom User model with roles
│ │ ├── serializers.py # DRF serializers
│ │ ├── views.py # API views
│ │ ├── permissions.py # Custom permissions
│ │ └── urls.py # User endpoints
│ ├── courses/ # Course management
│ │ ├── models.py # Course and Enrollment models
│ │ ├── serializers.py # Course serialization
│ │ ├── views.py # Course ViewSets
│ │ └── urls.py # Course endpoints
│ ├── assignments/ # Assignment & submission system
│ │ ├── models.py # Assignment and Submission models
│ │ ├── serializers.py # Assignment serialization
│ │ ├── views.py # Assignment ViewSets
│ │ └── urls.py # Assignment endpoints
│ └── core/
│ ├── permissions.py # Shared permission classes
│ └── utils.py # Utility functions
├── frontend/
│ ├── package.json # Node dependencies
│ ├── public/
│ │ └── index.html # HTML template
│ └── src/
│ ├── index.jsx # React entry point
│ ├── App.jsx # Root component
│ ├── api/
│ │ ├── axios.js # Axios instance with interceptors
│ │ ├── auth.js # Authentication API calls
│ │ ├── courses.js # Course API calls
│ │ ├── assignments.js # Assignment API calls
│ │ ├── submissions.js # Submission API calls
│ │ └── enrollments.js # Enrollment API calls
│ ├── components/
│ │ ├── auth/ # Login and registration forms
│ │ ├── courses/ # Course components
│ │ ├── assignments/ # Assignment components
│ │ ├── submissions/ # Submission components
│ │ ├── common/ # Reusable components (Navbar, Toast, etc.)
│ │ └── ProtectedRoute.jsx # Route protection
│ ├── context/
│ │ ├── AuthContext.jsx # Authentication state
│ │ └── ToastContext.jsx # Notification system
│ ├── hooks/
│ │ └── useAuth.js # Authentication hook
│ ├── pages/
│ │ ├── Home.jsx # Landing page
│ │ ├── StudentDashboard.jsx # Student dashboard
│ │ ├── TeacherDashboard.jsx # Teacher dashboard
│ │ ├── AdminDashboard.jsx # Admin dashboard
│ │ ├── AssignmentDetail.jsx # Assignment details
│ │ ├── SubmissionDetail.jsx # Submission details
│ │ └── Profile.jsx # User profile
│ └── styles/ # CSS files
└── README.md
```

## Features

- **User Authentication**: Users can register, log in, and manage their profiles.
- **Role-Based Access**: Different functionalities are available based on user roles (students, teachers, admins).
- **Course Management**: Teachers can create and manage courses, while students can enroll and participate in courses.
- **RESTful API**: The backend provides a RESTful API for the frontend to interact with.

## Technologies Used

- **Backend**: Django, Django Rest Framework
- **Frontend**: React
- **Database**: SQLite
- **Environment Management**: Python virtual environments

## Setup Instructions

### Backend

1. Navigate to the `backend` directory.
2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```
4. Set up the environment variables by copying `.env.example` to `.env` and configuring it.
5. Run migrations:
   ```
   python manage.py migrate
   ```
6. Create a superuser:
   ```
   python manage.py createsuperuser
   ```
7. Start the development server:
   ```
   python manage.py runserver
   ```

### Frontend

1. Navigate to the `frontend` directory.
2. Install the required packages:
   ```
   npm install
   ```
3. Start the React development server:
   ```
   npm start
   ```

## Usage

- Access the application at `http://localhost:3000` for the frontend.
- The backend API can be accessed at `http://localhost:8000/api/`.

---

## 🌐 Production Deployment

This application is deployed and live at:

- **Frontend**: [https://tiny-pegasus-f5a026.netlify.app](https://tiny-pegasus-f5a026.netlify.app)
- **Backend API**: [https://lms-project-krr3.onrender.com/api](https://lms-project-krr3.onrender.com/api)
- **Admin Panel**: [https://lms-project-krr3.onrender.com/admin](https://lms-project-krr3.onrender.com/admin)

### Deployment Architecture

The application uses a modern cloud deployment strategy:
- **Backend Hosting**: Render (Free tier with PostgreSQL database)
- **Frontend Hosting**: Netlify (Free tier with automatic CDN deployment)
- **Database**: PostgreSQL managed by Render
- **Version Control**: GitHub with automatic deployments

### Setting Up Your Own Deployment

If you want to deploy your own instance of this application, follow these comprehensive steps:

#### Prerequisites
- GitHub account
- Render account (sign up at [render.com](https://render.com))
- Netlify account (sign up at [netlify.com](https://netlify.com))

#### Backend Deployment (Render)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Render Web Service**
   - Go to Render Dashboard → "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure settings:
     - **Name**: `your-lms-backend` (or your choice)
     - **Region**: Choose closest to your users
     - **Root Directory**: `backend`
     - **Environment**: Python 3
     - **Build Command**: `chmod +x build.sh && ./build.sh`
     - **Start Command**: `gunicorn lms_backend.wsgi:application`
     - **Plan**: Free

3. **Add Environment Variables** (in Render Dashboard)
   ```
   SECRET_KEY=<generate-with-command-below>
   DEBUG=False
   ALLOWED_HOSTS=.onrender.com,.netlify.app
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   ```
   
   Generate SECRET_KEY:
   ```bash
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

4. **Deploy Backend**
   - Click "Create Web Service"
   - Wait 5-10 minutes for first deployment
   - Copy your backend URL (e.g., `https://your-app.onrender.com`)

5. **Create Superuser** (via Render Shell)
   - Go to your service → "Shell" tab
   - Run: `python manage.py createsuperuser`
   - Follow prompts to create admin account

#### Frontend Deployment (Netlify)

1. **Update Environment Configuration**
   - Ensure `frontend/.env.production` has your backend URL:
     ```
     REACT_APP_API_URL=https://your-backend.onrender.com/api
     CI=false
     GENERATE_SOURCEMAP=false
     ```

2. **Deploy to Netlify**
   - Netlify Dashboard → "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Configure build settings:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `frontend/build`

3. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes
   - Copy your frontend URL (e.g., `https://your-app.netlify.app`)

#### Connect Frontend and Backend

1. **Update Backend CORS**
   - Go to Render Dashboard → Your service → "Environment"
   - Update `CORS_ALLOWED_ORIGINS` to:
     ```
     https://your-app.netlify.app,http://localhost:3000
     ```
   - Update `ALLOWED_HOSTS` to:
     ```
     .onrender.com,.netlify.app,your-backend.onrender.com
     ```
   - Click "Save Changes" (service will auto-redeploy)

2. **Test Your Deployment**
   - Open your Netlify URL
   - Register a new account
   - Test login and core features
   - Access admin panel at `https://your-backend.onrender.com/admin/`

### Deployment Files

The following files are configured for deployment:

**Backend:**
- `backend/runtime.txt` - Specifies Python 3.11.9
- `backend/build.sh` - Build script that installs dependencies, collects static files, and runs migrations
- `backend/Procfile` - Process configuration for alternative hosting
- `backend/requirements.txt` - All Python dependencies including production packages

**Frontend:**
- `frontend/netlify.toml` - Netlify configuration with CI settings
- `frontend/.env.production` - Production environment variables

### Important Deployment Notes

**Render Free Tier Limitations:**
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds to wake up
- 750 hours/month free (sufficient for one service)
- Solution: Use a monitoring service like UptimeRobot to ping every 14 minutes

**Database Considerations:**
- Production uses PostgreSQL (local development uses SQLite)
- Local data will NOT transfer to production automatically
- Create test data in production or use Django fixtures to migrate data

**Security Best Practices:**
- Never commit `.env` files with real credentials
- Always use environment variables for sensitive data
- Keep `DEBUG=False` in production
- Use strong, unique SECRET_KEY
- Regularly update dependencies for security patches

**Monitoring and Maintenance:**
- Check Render logs for backend issues
- Check Netlify deployment logs for frontend issues
- Set up email notifications for deployment failures
- Monitor application performance and errors

### Environment Variables Reference

**Backend (Required):**
```bash
SECRET_KEY=<your-secret-key>           # Generate unique key
DEBUG=False                             # Never True in production
ALLOWED_HOSTS=<your-domains>           # Comma-separated domains
CORS_ALLOWED_ORIGINS=<frontend-urls>   # Comma-separated frontend URLs
DATABASE_URL=<auto-provided>           # Automatically set by Render
```

**Frontend (Required):**
```bash
REACT_APP_API_URL=<backend-url>/api    # Your backend API endpoint
CI=false                                # Allows warnings during build
GENERATE_SOURCEMAP=false               # Reduces build size
```

### Troubleshooting Deployment

**Backend Issues:**
- **Build fails**: Check `requirements.txt` for missing dependencies
- **ALLOWED_HOSTS error**: Add your Render domain to ALLOWED_HOSTS
- **Database errors**: Ensure migrations ran successfully in build.sh
- **CORS errors**: Verify CORS_ALLOWED_ORIGINS includes your frontend URL

**Frontend Issues:**
- **Build fails with ESLint errors**: Ensure `CI=false` in netlify.toml
- **API calls fail**: Check REACT_APP_API_URL is correct
- **404 on refresh**: Verify netlify.toml has SPA redirect rules
- **Environment variables not working**: Ensure they're in .env.production

**Connection Issues:**
- **CORS errors in browser**: Backend CORS_ALLOWED_ORIGINS must include exact frontend URL
- **Backend not responding**: May be spinning up (wait 30-60 seconds on free tier)
- **JWT token errors**: Check token storage in browser localStorage

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.


