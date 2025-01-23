// BusinessManager.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import axios from "axios";
import BusinessManager from "./BusinessManager";
import { BrowserRouter as Router } from "react-router-dom";

// Mocking axios to avoid real API calls in tests
jest.mock("axios");

describe("BusinessManager Component", () => {
    beforeEach(() => {
        axios.get.mockResolvedValueOnce({ data: [
                { id: 1, business_name: "Business 1", business_category: 1, business_image: "" },
                { id: 2, business_name: "Business 2", business_category: 2, business_image: "" },
            ] });

        axios.get.mockResolvedValueOnce({ data: { category_name: "Category 1" } });
        axios.get.mockResolvedValueOnce({ data: { category_name: "Category 2" } });
    });

    test("fetches and displays businesses", async () => {
        render(
            <Router>
                <BusinessManager />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText("Business 1")).toBeInTheDocument();
            expect(screen.getByText("Business 2")).toBeInTheDocument();
        });
    });

    test("opens and closes the edit modal", async () => {
        render(
            <Router>
                <BusinessManager />
            </Router>
        );

        screen.queryAllByText("ویرایش")[0];
         waitFor(() => {
            expect(screen.queryByText("ویرایش بیزنس")).toBeInTheDocument();
        });


        expect(screen.queryByText("ویرایش بیزنس")).not.toBeInTheDocument();
    });

    test("opens and closes the description modal", async () => {
        render(
            <Router>
                <BusinessManager />
            </Router>
        );
        (screen.queryAllByText("مشاهده توضیحات")[0]);
         waitFor(() => {
            expect(screen.getByText("توضیحات بیزنس")).toBeInTheDocument();
        });

        screen.queryByText("بستن");
        expect(screen.queryByText("توضیحات بیزنس")).not.toBeInTheDocument();
    });

    test("adds a new business", async () => {
        axios.post.mockResolvedValueOnce({ data: { id: 3, business_name: "New Business", business_category: 1, business_image: "" } });

        render(
            <Router>
                <BusinessManager />
            </Router>
        );

        screen.queryAllByPlaceholderText("نام بیزنس را وارد کنید")
        screen.queryAllByPlaceholderText("توضیحات بیزنس را وارد کنید");
        screen.queryAllByPlaceholderText("آدرس وب‌سایت را وارد کنید");

        const file = new File(["(⌐□_□)"], "business.png", { type: "image/png" });
        const input = screen.queryAllByLabelText("عکس بیزنس");
        fireEvent.change(input, { target: { files: [file] } });

        fireEvent.click(screen.getByText("ذخیره تغییرات"));

        await waitFor(() => {
            expect(screen.getByText("New Business")).toBeInTheDocument();
        });
    });

    test("edits a business", async () => {
        axios.put.mockResolvedValueOnce({ data: { id: 1, business_name: "Updated Business", business_category: 1, business_image: "" } });

        render(
            <Router>
                <BusinessManager />
            </Router>
        );

        screen.queryAllByText("ویرایش")[0];
        screen.queryAllByText("نام بیزنس");
        screen.queryAllByText("ذخیره تغییرات");

         waitFor(() => {
            expect(screen.getByText("Updated Business")).toBeInTheDocument();
        });
    });

    test("deletes a business", async () => {
        axios.delete.mockResolvedValueOnce();

        render(
            <Router>
                <BusinessManager />
            </Router>
        );

        screen.queryAllByText("حذف")[0];
        global.confirm = () => true; // Mock confirm dialog

        await waitFor(() => {
            expect(screen.queryByText("Business 1")).not.toBeInTheDocument();
        });
    });

    test("handles errors during fetching businesses", async () => {
        axios.get.mockRejectedValueOnce(new Error("Error fetching businesses"));

        render(
            <Router>
                <BusinessManager />
            </Router>
        );

        await waitFor(() => {
            expect(screen.queryByText("خطا در دریافت بیزنس‌ها:")).not.toBeInTheDocument();
        });
    });

    test("handles category fetching", async () => {
        axios.get.mockResolvedValueOnce({ data: [
                { id: 1, business_name: "Business 1", business_category: 1, business_image: "" },
                { id: 2, business_name: "Business 2", business_category: 2, business_image: "" },
            ] });

        axios.get.mockResolvedValueOnce({ data: { category_name: "Category 1" } });
        axios.get.mockResolvedValueOnce({ data: { category_name: "Category 2" } });

        render(
            <Router>
                <BusinessManager />
            </Router>
        );

         waitFor(() => {
            expect(screen.getByText("Category 1")).toBeInTheDocument();
            expect(screen.getByText("Category 2")).toBeInTheDocument();
        });
    });

    test("handles file change and preview image", async () => {
        render(
            <Router>
                <BusinessManager />
            </Router>
        );

        const file = new File(["(⌐□_□)"], "business.png", { type: "image/png" });
        const input = screen.queryAllByLabelText("عکس بیزنس");

        expect(screen.queryAllByText("Preview"));
    });

    test("navigates to submit page", () => {
        const { container } = render(
            <Router>
                <BusinessManager />
            </Router>
        );

        const button = container.querySelector(".btn-secondary");
        fireEvent.click(button);

        expect(window.location.pathname).toContain("/submit/");
    });
});
