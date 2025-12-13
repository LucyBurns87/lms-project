import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock axios BEFORE importing components
jest.mock('axios');

// Mock LoadingSpinner
jest.mock('../common/LoadingSpinner', () => {
  return function LoadingSpinner() {
    return <div>Loading...</div>;
  };
});

// Mock API modules
jest.mock('../../api/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('../../api/assignment', () => ({
  getAssignment: jest.fn(),
}));

jest.mock('../../api/submissions', () => ({
  submitAssignment: jest.fn(),
}));

import SubmitAssignmentForm from './SubmissionForm';
import { getAssignment } from '../../api/assignment';
import { submitAssignment } from '../../api/submissions';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => mockNavigate,
}));

global.alert = jest.fn();

describe('SubmitAssignmentForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads assignment details on mount', async () => {
    const mockAssignment = {
      id: 1,
      title: 'Test Assignment',
      description: 'Test Description',
      due_date: '2025-12-31',
    };

    getAssignment.mockResolvedValue(mockAssignment);

    render(
      <BrowserRouter>
        <SubmitAssignmentForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Assignment')).toBeInTheDocument();
    });

    expect(getAssignment).toHaveBeenCalledWith('1');
  });

  test('submits form with content', async () => {
    const mockAssignment = {
      id: 1,
      title: 'Test Assignment',
      description: 'Test',
      due_date: '2025-12-31',
    };

    getAssignment.mockResolvedValue(mockAssignment);
    submitAssignment.mockResolvedValue({ id: 1 });

    render(
      <BrowserRouter>
        <SubmitAssignmentForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Assignment')).toBeInTheDocument();
    });

    // Find the textarea
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { name: 'content', value: 'My submission' } });

    const submitButton = screen.getByRole('button', { name: /submit assignment/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitAssignment).toHaveBeenCalledWith({
        assignment: 1,
        content: 'My submission',
      });
    });

    expect(global.alert).toHaveBeenCalledWith('Assignment submitted successfully!');
  });
});