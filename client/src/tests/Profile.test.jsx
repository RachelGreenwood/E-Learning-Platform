// UserProfile.test.jsx
import { render, screen } from '@testing-library/react';
import Profile from '../components/Profile/Profile';
import { useAuth0 } from '@auth0/auth0-react';

jest.mock('@auth0/auth0-react');

describe('UserProfile', () => {
  it('shows login prompt if not authenticated', () => {
    useAuth0.mockReturnValue({ isAuthenticated: false });
    render(<Profile />);
    expect(screen.getByText(/please log in/i)).toBeInTheDocument();
  });

  it('shows user name if authenticated', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Rachel Greenwood' },
    });
    render(<Profile />);
    expect(screen.getByText(/welcome, rachel greenwood/i)).toBeInTheDocument();
  });
});
