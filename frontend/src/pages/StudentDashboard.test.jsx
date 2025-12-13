import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock axios BEFORE importing
jest.mock('axios');

// Create mock function first, then use it in the mock
const mockGet = jest.fn();
const mockPost = jest.fn();

// Mock API client
jest.mock('../api/axios', () => ({
  __esModule: true,
  default: {
    get: (...args) => mockGet(...args),
    post: (...args) => mockPost(...args),
  },
}));

import StudentDashboard from './StudentDashboard';
import { AuthContext } from '../context/AuthContext';

const mockUser = {
  id: 1,
  username: 'testStudent',
  role: 'student',
};

describe('StudentDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    mockGet.mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: mockUser }}>
          <StudentDashboard />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText(/loading your dashboard/i)).toBeInTheDocument();
  });

  test('displays enrollments after loading', async () => {
    const mockEnrollments = [
      {
        id: 1,
        course: {
          id: 1,
          title: 'Math 101',
          description: 'Introduction to Mathematics',
        },
      },
    ];

    const mockAssignments = [];

    mockGet.mockImplementation((url) => {
      if (url.includes('enrollments')) {
        return Promise.resolve({ data: mockEnrollments });
      }
      if (url.includes('assignments')) {
        return Promise.resolve({ data: mockAssignments });
      }
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: mockUser }}>
          <StudentDashboard />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Math 101')).toBeInTheDocument();
    });
  });

  test('displays error message on fetch failure', async () => {
    mockGet.mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: mockUser }}>
          <StudentDashboard />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });
});