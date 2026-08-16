import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { store } from "../store/store";
import { AuthPage } from "./AuthPage";
describe("AuthPage", () => { it("renders demo login form", () => { render(<Provider store={store}><MemoryRouter><AuthPage mode="login" /></MemoryRouter></Provider>); expect(screen.getByText(/Welcome back/i)).toBeInTheDocument(); expect(screen.getByDisplayValue("admin@nexaflow.demo")).toBeInTheDocument(); }); });
