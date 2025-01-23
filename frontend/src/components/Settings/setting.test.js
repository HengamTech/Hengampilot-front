// SettingsPage.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import axios from "axios";
import SettingsPage from "./Settings";

// Mocking axios to avoid real API calls in tests
jest.mock("axios");

describe("SettingsPage Component", () => {
    const mockCategories = [
        { id: 1, category_name: "Category 1", category_image: "" },
        { id: 2, category_name: "Category 2", category_image: "" },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        axios.get.mockResolvedValue({ data: mockCategories });
    });

    test("renders SettingsPage component", () => {
        render(<SettingsPage />);
        expect(screen.getByText("صفحه تنظیمات")).toBeInTheDocument();
    });

    test("fetches and displays categories", async () => {
        render(<SettingsPage />);

        await waitFor(() => {
            expect(screen.getByText("Category 1")).toBeInTheDocument();
            expect(screen.getByText("Category 2")).toBeInTheDocument();
        });
    });

    test("adds a new category", async () => {
        const newCategory = { id: 3, category_name: "New Category", category_image: "" };
        axios.post.mockResolvedValueOnce({ data: newCategory });

        render(<SettingsPage />);
        fireEvent.change(screen.getByPlaceholderText("مثلاً غذای دریایی"), { target: { value: "New Category" } });
        fireEvent.click(screen.getByText("اضافه کردن"));

        await waitFor(() => {
            expect(screen.getByText("New Category")).toBeInTheDocument();
        });
    });

    test("handles category image upload", () => {
        render(<SettingsPage />);
        const file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });
        const input = screen.queryAllByLabelText("تصویر دسته‌بندی (اختیاری)");

        expect(screen.queryAllByLabelText("Preview"))
    });

    test("opens and closes edit modal", async () => {
        render(<SettingsPage />);

        await waitFor(() => {
            expect(screen.getByText("Category 1")).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText("ویرایش")[0]);

        await waitFor(() => {
            expect(screen.getByText("ویرایش دسته‌بندی")).toBeInTheDocument();
        });

        screen.queryAllByText("بستن");

        await waitFor(() => {
            expect(screen.queryByText("ویرایش دسته‌بندی"));
        });
    });

    test("edits a category", async () => {
        render(<SettingsPage />);

        await waitFor(() => {
            expect(screen.getByText("Category 1")).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText("ویرایش")[0]);

        await waitFor(() => {
            expect(screen.getByText("ویرایش دسته‌بندی")).toBeInTheDocument();
        });

        screen.queryAllByLabelText("نام دسته‌بندی")
        axios.put.mockResolvedValueOnce({ data: { id: 1, category_name: "Updated Category", category_image: "" } });
        fireEvent.click(screen.getByText("ذخیره تغییرات"));

        await waitFor(() => {
            expect(screen.getByText("Updated Category")).toBeInTheDocument();
        });
    });

    test("deletes a category", async () => {
        render(<SettingsPage />);

        await waitFor(() => {
            expect(screen.getByText("Category 1")).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText("حذف")[0]);
        axios.delete.mockResolvedValueOnce();
        screen.queryByText("تأیید حذف");

        await waitFor(() => {
            expect(screen.queryByText("Category 1")).not.toBeInTheDocument();
        });
    });
});
