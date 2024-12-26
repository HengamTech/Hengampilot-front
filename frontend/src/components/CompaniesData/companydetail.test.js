import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'; // Import jest-dom matchers
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CompanyDetailPage from "./CompanyDetailPage";

// Mock axios
jest.mock("axios");

describe("CompanyDetailPage Component", () => {
    const mockCompany = {
        id: 1,
        business_name: "Company A",
        average_rank: 4.5,
        total_reviews: 10,
        profileImage: "https://via.placeholder.com/80",
        description: "This is Company A.",
    };
    const mockComments = [
        {
            id: 1,
            user: 1,
            rank: 4,
            created_at: "2022-01-01",
            review_text: "Great company!",
        },
        {
            id: 2,
            user: 2,
            rank: 5,
            created_at: "2022-01-02",
            review_text: "Excellent service!",
        },
    ];
    const mockUserDetails = {
        1: "User One",
        2: "User Two",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders company information and comments", async () => {
        axios.get.mockResolvedValueOnce({ data: mockCompany });
        axios.get.mockResolvedValueOnce({ data: mockComments });
        axios.get.mockResolvedValueOnce({ data: { username: mockUserDetails[1] } });
        axios.get.mockResolvedValueOnce({ data: { username: mockUserDetails[2] } });

        render(
            <MemoryRouter initialEntries={["/company/1"]}>
                <Routes>
                    <Route path="/company/:id" element={<CompanyDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Check loading state
        expect(screen.getByText("در حال بارگذاری...")).toBeInTheDocument();

        // Wait for the company information to appear
        expect(await screen.findByText("Company A")).toBeInTheDocument();
        expect(await screen.findByText("This is Company A.")).toBeInTheDocument();

        // Verify comments are rendered
        expect(await screen.findByText("Great company!")).toBeInTheDocument();
        expect(await screen.findByText("Excellent service!")).toBeInTheDocument();
    });

    it("displays loading spinner while fetching data", async () => {
        axios.get.mockResolvedValueOnce({ data: mockCompany });
        axios.get.mockResolvedValueOnce(new Promise(resolve => setTimeout(() => resolve({ data: mockComments }), 2000))); // Mock API with delay

        render(
            <MemoryRouter initialEntries={["/company/1"]}>
                <Routes>
                    <Route path="/company/:id" element={<CompanyDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Check that the loading spinner appears
        expect(screen.getByText("در حال بارگذاری...")).toBeInTheDocument();

        // Wait for the company information to be fetched and rendered
        expect(await screen.findByText("Company A")).toBeInTheDocument();
        expect(await screen.findByText("This is Company A.")).toBeInTheDocument();
    });

    it("handles error state correctly", async () => {
        axios.get.mockRejectedValueOnce(new Error("Network Error"));

        render(
            <MemoryRouter initialEntries={["/company/1"]}>
                <Routes>
                    <Route path="/company/:id" element={<CompanyDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Check loading state
        expect(screen.getByText("در حال بارگذاری...")).toBeInTheDocument();

        // Wait for error message
        expect(await screen.findByText("خطا در دریافت اطلاعات شرکت.")).toBeInTheDocument();
    });

    it("sorts comments correctly", async () => {
        axios.get.mockResolvedValueOnce({data: mockCompany});
        axios.get.mockResolvedValueOnce({data: mockComments});

        render(
            <MemoryRouter initialEntries={["/company/1"]}>
                <Routes>
                    <Route path="/company/:id" element={<CompanyDetailPage/>}/>
                </Routes>
            </MemoryRouter>
        );

        // Wait for company and comments to render
        expect(await screen.findByText("Company A")).toBeInTheDocument();
        expect(await screen.findByText("Great company!")).toBeInTheDocument();

    });

});

