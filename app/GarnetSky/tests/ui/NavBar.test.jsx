/**
 * NavBar Component Unit Tests
 *
 * Tests the navigation bar rendering and link structure
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "../../app/src/components/NavBar";

// Keep mock state in variables so tests can switch logged-in/logged-out cleanly.
let mockUser = null;
const mockLogOut = vi.fn();

// Mock the AuthContext hook used by NavBar
vi.mock("../../app/src/context/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    logOut: mockLogOut,
  }),
}));

const renderNavBar = () =>
  render(
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>
  );

describe("NavBar Component", () => {
  beforeEach(() => {
    mockUser = null;
    mockLogOut.mockClear();
  });

  it("renders the brand name", () => {
    renderNavBar();
    expect(screen.getByText("GarnetSky Recipes")).toBeInTheDocument();
  });

  it("renders all navigation tabs when logged out", () => {
    renderNavBar();

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("shows Login and Sign Up links when user is not logged in", () => {
    renderNavBar();

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("has correct link destinations", () => {
    renderNavBar();

    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
    expect(screen.getByText("Search").closest("a")).toHaveAttribute("href", "/search");
    expect(screen.getByText("Login").closest("a")).toHaveAttribute("href", "/login");
  });
});

describe("NavBar Component - Logged In User", () => {
  beforeEach(() => {
    mockLogOut.mockClear();
  });

  it("shows username and logout button when user is logged in", () => {
    mockUser = { username: "testuser" };

    renderNavBar();

    expect(screen.getByText(/Hi,\s*testuser/i)).toBeInTheDocument();
    expect(screen.getByText("Log Out")).toBeInTheDocument();
  });
});
