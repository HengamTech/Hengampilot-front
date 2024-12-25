import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import SettingsPage from "./Settings";
import userEvent from "@testing-library/user-event";

// Mock axios
jest.mock("axios");

describe("SettingsPage component", () => {
    it("renders settings page title", () => {
        render(
            <MemoryRouter>
                <SettingsPage />
            </MemoryRouter>
        );
        expect(screen.getByText("صفحه تنظیمات")).toBeInTheDocument();
    });

    it("fetches and displays categories", async () => {
        const categories = [
            { id: 1, category_name: "غذا، رستوران، کافه", icon: "🍴" },
            { id: 2, category_name: "ورزش", icon: "⚽" }
        ];

        axios.get.mockResolvedValue({ data: categories });

        render(
            <MemoryRouter>
                <SettingsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            categories.forEach(category => {
                expect(screen.getByText(category.category_name)).toBeInTheDocument();
                expect(screen.getByText(category.icon)).toBeInTheDocument();
            });
        });
    });

    it("adds a new category", async () => {
        const newCategory = { id: 3, category_name: "سفر", icon: "✈️" };

        axios.post.mockResolvedValue({ data: newCategory });

        render(
            <MemoryRouter>
                <SettingsPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("مثلاً غذای دریایی"), { target: { value: "سفر" } });
        fireEvent.change(screen.getByPlaceholderText("مثلاً 🚗"), { target: { value: "✈️" } });
        fireEvent.click(screen.getByText("اضافه کردن"));

        await waitFor(() => {
            expect(screen.getByText("سفر")).toBeInTheDocument();
            expect(screen.getByText("✈️")).toBeInTheDocument();
        });
    });

    it("deletes a category", async () => {
        const categories = [
            { id: 1, category_name: "غذا، رستوران، کافه", icon: "🍴" },
            { id: 2, category_name: "ورزش", icon: "⚽" }
        ];

        axios.get.mockResolvedValue({ data: categories });
        axios.delete.mockResolvedValue({});

        render(
            <MemoryRouter>
                <SettingsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            categories.forEach(category => {
                expect(screen.getByText(category.category_name)).toBeInTheDocument();
                expect(screen.getByText(category.icon)).toBeInTheDocument();
            });
        });

        // Use a more specific selector for the delete button
        const deleteButtons = screen.getAllByText("حذف");
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(screen.queryByText("غذا، رستوران، کافه")).not.toBeInTheDocument();
        });
    });

    it("opens and saves edited category", async () => {
        const categories = [
            { id: 1, category_name: "غذا، رستوران، کافه", icon: "🍴" },
            { id: 2, category_name: "ورزش", icon: "⚽" }
        ];

        axios.get.mockResolvedValue({ data: categories });
        axios.put.mockResolvedValue({ data: { id: 1, category_name: "غذا", icon: "🍔" } });

        render(
            <MemoryRouter>
                <SettingsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            categories.forEach(category => {
                expect(screen.getByText(category.category_name)).toBeInTheDocument();
                expect(screen.getByText(category.icon)).toBeInTheDocument();
            });
        });

        fireEvent.click(screen.getAllByText("ویرایش")[0]);

        // Wait for modal to be fully rendered and open
        await waitFor(() => screen.getByRole("dialog"));

        // Inspect the DOM to ensure the button is present
        screen.debug();

        fireEvent.change(screen.getByDisplayValue("غذا، رستوران، کافه"), { target: { value: "غذا" } });
        fireEvent.change(screen.getByDisplayValue("🍴"), { target: { value: "🍔" } });

        // Click the "ذخیره تغییرات" button
        fireEvent.click(screen.getByTestId("save-changes-button"));

        await waitFor(() => {
            expect(screen.getByText("غذا")).toBeInTheDocument();
            expect(screen.getByText("🍔")).toBeInTheDocument();
        });
    });
});
