// AllReviewsPage.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import axios from "axios";
import AllReviewsPage from "./AllReviewsPage";

// Mocking axios to avoid real API calls in tests
jest.mock("axios");

describe("AllReviewsPage Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAxiosCalls();
    });

    const mockAxiosCalls = () => {
        axios.get.mockResolvedValueOnce({
            data: [
                { id: 1, business_name: "Business 1", business_category: 1, business_image: "" },
                { id: 2, business_name: "Business 2", business_category: 2, business_image: "" }
            ]
        });

        axios.get.mockResolvedValueOnce({ data: { category_name: "Category 1" } });
        axios.get.mockResolvedValueOnce({ data: { category_name: "Category 2" } });

        axios.get.mockResolvedValueOnce({
            data: [
                {
                    id: 1,
                    user: 1,
                    business_id: 1,
                    review_text: "Great service",
                    rank: 5,
                    created_at: "2022-12-12",
                    hidden: false,
                    username: "user1",
                    userimage: "user1.jpg",
                    businessName: "Business 1",
                    business_image: "business1.jpg"
                },
                {
                    id: 2,
                    user: 2,
                    business_id: 2,
                    review_text: "Good experience",
                    rank: 4,
                    created_at: "2022-12-11",
                    hidden: true,
                    username: "user2",
                    userimage: "user2.jpg",
                    businessName: "Business 2",
                    business_image: "business2.jpg"
                }
            ]
        });

        axios.get.mockResolvedValueOnce({
            data: [
                { review: 1, user: 1 },
                { review: 2, user: 2 }
            ]
        });

        axios.get.mockResolvedValueOnce({ data: { is_admin: true } });
        axios.get.mockResolvedValueOnce({ data: [] });
    };

    test("renders AllReviewsPage component", async () => {
        render(<AllReviewsPage />);

        await waitFor(() => {
            expect(screen.getByText("همه نظرات")).toBeInTheDocument();
        });
    });

    test("fetches and displays reviews", async () => {
        render(<AllReviewsPage />);

        await waitFor(() => {
            expect(screen.getByText("Great service")).toBeInTheDocument();
            expect(screen.getByText("Good experience")).toBeInTheDocument();
        });
    });

    test("opens and closes the report modal", async () => {
        render(<AllReviewsPage />);

        fireEvent.click(screen.getByRole("button", { name: /گزارش نظر/i }));
        await waitFor(() => {
            expect(screen.getByText("گزارش نظر")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("انصراف"));
        expect(screen.queryByText("گزارش نظر")).not.toBeInTheDocument();
    });

    test("filters reviews by username", async () => {
        render(<AllReviewsPage />);

        fireEvent.change(screen.getByPlaceholderText("نام کاربری"), { target: { value: "user1" } });
        fireEvent.click(screen.getByText("اعمال فیلتر"));

        await waitFor(() => {
            expect(screen.getByText("Great service")).toBeInTheDocument();
            expect(screen.queryByText("Good experience")).not.toBeInTheDocument();
        });
    });

    test("likes a review", async () => {
        render(<AllReviewsPage />);

        fireEvent.click(screen.getAllByText("👍")[0]);

        await waitFor(() => {
            expect(screen.getByText("👍 2")).toBeInTheDocument();
        });
    });

    test("opens and closes the admin reply form", async () => {
        render(<AllReviewsPage />);

        fireEvent.click(screen.getByText("پاسخ های مدیر"));

        await waitFor(() => {
            expect(screen.getByText("پاسخ های مدیر:")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("ریپلای"));

        await waitFor(() => {
            expect(screen.getByPlaceholderText("پاسخ ادمین را وارد کنید...")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("بستن"));
        expect(screen.queryByPlaceholderText("پاسخ ادمین را وارد کنید...")).not.toBeInTheDocument();
    });

    test("submits a reply", async () => {
        axios.post.mockResolvedValueOnce({});
        axios.get.mockResolvedValueOnce({ data: [{ id: 1, description: "Reply", review: 1, created_at: "2022-12-13" }] });

        render(<AllReviewsPage />);

        fireEvent.click(screen.getByText("پاسخ های مدیر"));
        fireEvent.click(screen.getByText("ریپلای"));
        fireEvent.change(screen.getByPlaceholderText("پاسخ ادمین را وارد کنید..."), { target: { value: "Reply" } });
        fireEvent.click(screen.getByText("ارسال"));

        await waitFor(() => {
            expect(screen.getByText("Reply")).toBeInTheDocument();
        });
    });
});
