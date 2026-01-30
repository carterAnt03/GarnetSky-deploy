/**
 * NavBar Component Unit Tests
 *
 * Tests the navigation bar rendering and link structure
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from '../../app/src/components/NavBar';

// Mock the AuthContext
vi.mock('../../app/src/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    logOut: vi.fn(),
  }),
}));

// Helper to render NavBar with router context
const renderNavBar = () => {
  return render(
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>
  );
};

describe('NavBar Component', () => {
  it('renders the brand name', () => {
    renderNavBar();
    expect(screen.getByText('GarnetSky Recipes')).toBeInTheDocument();
  });

  it('renders all navigation tabs when logged out', () => {
    renderNavBar();

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('shows Login and Sign Up links when user is not logged in', () => {
    renderNavBar();

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('has correct link destinations', () => {
    renderNavBar();

    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Search').closest('a')).toHaveAttribute('href', '/search');
    expect(screen.getByText('Login').closest('a')).toHaveAttribute('href', '/login');
  });
});

describe('NavBar Component - Logged In User', () => {
  it('shows username and logout button when user is logged in', async () => {
    // Re-mock with a logged-in user
    vi.doMock('../../app/src/context/AuthContext', () => ({
      useAuth: () => ({
        user: { username: 'testuser' },
        logOut: vi.fn(),
      }),
    }));

    // Clear module cache and re-import
    vi.resetModules();
    const { render: renderFresh, screen: screenFresh } = await import('@testing-library/react');
    const { BrowserRouter: BrowserRouterFresh } = await import('react-router-dom');
    const NavBarFresh = (await import('../../app/src/components/NavBar')).default;

    renderFresh(
      <BrowserRouterFresh>
        <NavBarFresh />
      </BrowserRouterFresh>
    );

    expect(screenFresh.getByText(/Hi, testuser/)).toBeInTheDocument();
    expect(screenFresh.getByText('Log Out')).toBeInTheDocument();
  });
});
