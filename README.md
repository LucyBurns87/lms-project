# Learning Management System (LMS)

This is a full-stack Learning Management System (LMS) project built using Django for the backend, Django Rest Framework for the API, and React for the frontend. The project supports user authentication and role-based functionality for students, teachers, and admins.

## Project Structure

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

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.
