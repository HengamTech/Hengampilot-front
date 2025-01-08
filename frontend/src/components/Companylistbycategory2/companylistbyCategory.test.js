import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import axios from "axios";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Companylistbycategory1 from "./CompanylistbyCategory3";

jest.mock("axios");

describe("Companylistbycategory1", () => {
    const mockCompanies = [
        {
            id: 1,
            business_name: "Test Company 1",
            average_rating: 4.5,
            total_reviews: 10,
            business_image: "/test-image-1.jpg",
            is_verified: true,
            website_url: "http://test1.com"
        },
        {
            id: 2,
            business_name: "Test Company 2",
            average_rating: 3,
            total_reviews: 5,
            business_image: "/test-image-2.jpg",
            is_verified: false,
            website_url: "http://test2.com"
        },
    ];

    const renderComponent = () =>
        render(
            <MemoryRouter initialEntries={["/category/tech"]}>
                <Routes>
                    <Route path="/category/:id" element={<Companylistbycategory1 />} />
                </Routes>
            </MemoryRouter>
        );

    it("fetches and displays companies", async () => {
        axios.get.mockResolvedValueOnce({ data: mockCompanies });

        renderComponent();

        await waitFor(() => {
            console.log("Companies fetched");
            expect(screen.getByText("Test Company 1")).toBeInTheDocument();
            expect(screen.getByText("Test Company 2")).toBeInTheDocument();
        });
    });

    it("applies filters correctly", async () => {
        axios.get.mockResolvedValueOnce({ data: mockCompanies });

        renderComponent();

        await waitFor(() => {
            console.log("Before filters applied");
            expect(screen.getByText("Test Company 1")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("ستاره"));
        const stars = screen.getAllByTestId(/star-\d/); // Find all star elements by data-testid

        fireEvent.click(stars[4]); // Select 5th star (index 4)

        fireEvent.click(screen.getByTestId("applyF"));

         waitFor(() => {
            console.log("After filters applied");
            expect(screen.getByText("هیچ شرکتی با این فیلترها یافت نشد.")).toBeInTheDocument();
        });
    });

    it("handles API errors gracefully", async () => {
        axios.get.mockRejectedValueOnce(new Error("API Error"));

        renderComponent();

        await waitFor(() => {
            console.log("API Error occurred");
            console.log("Rendered DOM:", screen.debug());  // This will print the entire DOM
            expect(screen.getByText(/خطا در دریافت داده‌ها. لطفاً دوباره تلاش کنید./i)).toBeInTheDocument();
        });
    });
});
