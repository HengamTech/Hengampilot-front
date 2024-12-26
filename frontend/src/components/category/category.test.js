import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import Categories from "./category";

// Mock axios
jest.mock("axios");

describe("Categories component", () => {
    it("renders category title", () => {
        render(
            <MemoryRouter>
                <Categories />
            </MemoryRouter>
        );
        expect(screen.getByText("دسته‌بندی‌ها")).toBeInTheDocument();
    });

    it("fetches and displays categories", async () => {
        const categories = [
            { id: 1, category_name: "غذا، رستوران، کافه", icon: "🍴" },
            { id: 2, category_name: "ورزش", icon: "⚽" }
        ];

        axios.get.mockResolvedValue({ data: categories });

        render(
            <MemoryRouter>
                <Categories />
            </MemoryRouter>
        );

        await waitFor(() => {
            categories.forEach(category => {
                expect(screen.getByText(category.category_name)).toBeInTheDocument();
                expect(screen.getByText(category.icon)).toBeInTheDocument();
            });
        });
    });

    it("handles fetch error", async () => {
        axios.get.mockRejectedValue(new Error("Error fetching categories"));

        render(
            <MemoryRouter>
                <Categories />
            </MemoryRouter>
        );

        // Add your own error handling test if there's error UI to check
    });
});
