# Learning Management System (LMS)

This is a full-stack Learning Management System (LMS) project built using Django for the backend, Django Rest Framework for the API, and React for the frontend. The project supports user authentication and role-based functionality for students, teachers, and admins.

## Project Structure

```
lms-project
├── backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── lms_backend
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps
│   │   ├── users
│   │   ├── courses
│   │   └── core
│   └── tests
├── frontend
│   ├── package.json
│   ├── .env.example
│   ├── public
│   │   └── index.html
│   └── src
│       ├── index.jsx
│       ├── App.jsx
│       ├── api
│       ├── components
│       ├── context
│       ├── hooks
│       ├── pages
│       └── styles
├── .gitignore
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

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.