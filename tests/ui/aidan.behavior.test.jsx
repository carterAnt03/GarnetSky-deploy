import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

let mockAuthValue;
let mockNavigate;
const mockSearchRecipes = vi.fn();
const mockCreateRecipe = vi.fn();

vi.mock('../../app/src/context/AuthContext', () => ({
  useAuth: () => mockAuthValue,
}));

vi.mock('../../app/src/services/recipeService', () => ({
  searchRecipes: (...args) => mockSearchRecipes(...args),
  createRecipe: (...args) => mockCreateRecipe(...args),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import NavBar from '../../app/src/components/NavBar';
import Search from '../../app/src/pages/Search';
import Submit from '../../app/src/pages/Submit';
import Login from '../../app/src/pages/Login';

function renderWithRouter(ui, route = '/') {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

describe('Aidan behavior tests - user flows', () => {
  beforeEach(() => {
    mockNavigate = vi.fn();
    mockAuthValue = {
      user: null,
      logOut: vi.fn(),
      logIn: vi.fn(),
      signUp: vi.fn(),
    };
    mockSearchRecipes.mockReset();
    mockCreateRecipe.mockReset();
  });

  test('NavBar shows guest navigation when logged out', () => {
    renderWithRouter(<NavBar />);
    expect(screen.getByRole('link', { name: /garnetsky recipes/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /all recipes/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /favorites/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  test('NavBar lets a logged-in user open the dropdown and log out', async () => {
    const user = userEvent.setup();
    const logoutSpy = vi.fn();
    mockAuthValue = {
      user: { id: 'u1', username: 'aidan', role: 'admin' },
      logOut: logoutSpy,
    };
    renderWithRouter(<NavBar />);
    await user.click(screen.getByRole('button', { name: /hi, aidan/i }));
    expect(screen.getByRole('link', { name: /my recipes/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /log out/i }));
    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });

  test('Search runs a query and renders matching recipes', async () => {
    const user = userEvent.setup();
    mockSearchRecipes.mockResolvedValue([{
      id: 'garlic-noodles',
      title: 'Garlic Noodles',
      desc: 'Buttery noodles with garlic.',
      tags: ['Dinner', 'Quick'],
      thumb: 'https://example.com/noodles.jpg',
    }]);
    renderWithRouter(<Search />, '/search');
    await waitFor(() => {
      expect(mockSearchRecipes).toHaveBeenCalledWith({ query: '', tag: '' });
    });
    await user.type(screen.getByPlaceholderText(/search by name, description, or tag/i), 'garlic');
    await user.click(screen.getByRole('button', { name: /^search$/i }));
    await waitFor(() => {
      expect(mockSearchRecipes).toHaveBeenLastCalledWith({ query: 'garlic', tag: '' });
    });
    expect(await screen.findByText(/garlic noodles/i)).toBeInTheDocument();
    expect(screen.getByText(/showing 1–1 of 1 recipes/i)).toBeInTheDocument();
  });

  test('Submit blocks publishing when the user is logged out', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Submit />, '/submit');
    await user.type(screen.getByPlaceholderText(/spaghetti bolognese/i), 'Late Night Pasta');
    await user.type(screen.getByPlaceholderText(/a cozy, classic spaghetti dinner/i), 'Fast pasta dinner');
    await user.click(screen.getByRole('button', { name: /publish/i }));
    expect(screen.getByText(/you must be logged in to submit a recipe/i)).toBeInTheDocument();
    expect(mockCreateRecipe).not.toHaveBeenCalled();
  });

  test('Login shows the password field error returned by the auth flow', async () => {
    const user = userEvent.setup();
    mockAuthValue = {
      user: null,
      logIn: vi.fn().mockRejectedValue(Object.assign(new Error('Incorrect password.'), {
        data: { error: { code: 'INVALID_PASSWORD' } },
      })),
    };
    renderWithRouter(<Login />, '/login');
    await user.type(screen.getByLabelText(/email or username/i), 'aidan');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByText(/incorrect password\./i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
