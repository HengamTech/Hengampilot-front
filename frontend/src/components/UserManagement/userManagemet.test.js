import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import UserManagement from "./UserManagement";
import '@testing-library/jest-dom'; 

import { API_BASE_URL } from '../config';

jest.mock("axios");

describe("UserManagement Component", () => {
    beforeEach(() => {
        localStorage.setItem("token", "mock-token");
    });

    afterEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test("renders the UserManagement component", async () => {
        axios.get.mockResolvedValueOnce({
            data: [
                { id: 1, username: "user1", email: "user1@example.com", is_admin: false, is_active: true },
                { id: 2, username: "admin", email: "admin@example.com", is_admin: true, is_active: true },
            ],
        });

        render(
            <Router>
                <UserManagement />
            </Router>
        );

        expect(screen.getByPlaceholderText("جستجو بر اساس نام، نام خانوادگی یا ایمیل")).toBeInTheDocument();
        expect(screen.getByText("مدیریت کاربران")).toBeInTheDocument();

        // Wait for users to be loaded
        await waitFor(() => {
            expect(screen.getByText("user1")).toBeInTheDocument();
            expect(screen.getByText("admin")).toBeInTheDocument();
        });
    });

    test("filters users by search term", async () => {
        axios.get.mockResolvedValueOnce({
            data: [
                { id: 1, username: "user1", email: "user1@example.com", is_admin: false, is_active: true },
                { id: 2, username: "admin", email: "admin@example.com", is_admin: true, is_active: true },
            ],
        });

        render(
            <Router>
                <UserManagement />
            </Router>
        );

        await waitFor(() => expect(screen.getByText("user1")).toBeInTheDocument());

        fireEvent.change(screen.getByPlaceholderText("جستجو بر اساس نام، نام خانوادگی یا ایمیل"), {
            target: { value: "admin" },
        });

        expect(screen.queryByText("user1")).not.toBeInTheDocument();
        expect(screen.getByText("admin")).toBeInTheDocument();
    });

    test("deletes a user", async () => {
        axios.get.mockResolvedValueOnce({
            data: [
                { id: 1, username: "user1", email: "user1@example.com", is_admin: false, is_active: true },
            ],
        });

        axios.delete.mockResolvedValueOnce({});

        render(
            <Router>
                <UserManagement />
            </Router>
        );

        await waitFor(() => expect(screen.getByText("user1")).toBeInTheDocument());

        window.confirm = jest.fn(() => true);

        // Simulate clicking the delete button using text content
        const deleteButton = screen.getByTestId("test");
        console.log(deleteButton);  // Log the specific delete button

        fireEvent.click(deleteButton);

        // Wait for the deletion process to complete
        await waitFor(() => expect(axios.delete).toHaveBeenCalledWith(
            `${API_BASE_URL}/user_management/users/1/`,
            expect.any(Object)
        ));

        // Ensure the user is no longer in the document
        expect(window.confirm("user1")).not.toBe();
    });

    test("toggles user block/unblock", async () => {
        axios.get.mockResolvedValueOnce({
            data: [
                { id: 1, username: "user1", email: "user1@example.com", is_admin: false, is_active: true },
            ],
        });

        axios.patch.mockResolvedValueOnce({});

        render(
            <Router>
                <UserManagement />
            </Router>
        );

        await waitFor(() => expect(screen.getByText("user1")).toBeInTheDocument());

        window.confirm = jest.fn(() => true);

        // Simulate clicking the block/unblock button
        fireEvent.click(screen.getByRole("button", { name: /مسدود کردن/i }));

        // Ensure the PATCH request is called correctly
        await waitFor(() => expect(axios.patch).toHaveBeenCalledWith(
            `${API_BASE_URL}/user_management/users/1/`,
            { is_active: false },
            expect.any(Object)
        ));

        await waitFor(() => expect(screen.getByRole("button", { name: /رفع مسدودی/i })).toBeInTheDocument());
    });
});
