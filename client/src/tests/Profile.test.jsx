import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "../components/Profile/Profile.jsx";

vi.mock("@auth0/auth0-react", () => ({ useAuth0: vi.fn() }));
global.fetch = vi.fn();

describe("Profile Component", () => {
  beforeEach(() => vi.clearAllMocks());

  it("Shows username and email if authenticated", async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      getAccessTokenSilently: vi.fn().mockResolvedValue("token"),
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        profile: { username: "Test Instructor", email: "test@example.com", discipline: ["MMA"] },
      }),
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Instructor")).toBeInTheDocument();
      expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
    });
  });

  it("Shows error message if fetch fails", async () => {
    useAuth0.mockReturnValue({ isAuthenticated: true, getAccessTokenSilently: vi.fn().mockResolvedValue("token") });
    fetch.mockResolvedValueOnce({ ok: false });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load profile/i)).toBeInTheDocument();
    });
  });
});
