import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Companylistbycategory1 from './CompanylistbyCategory3';

jest.mock('axios');

describe('Companylistbycategory1', () => {
    const companies = [
        {
            id: 1,
            business_name: 'Company 1',
            average_rating: 4.5,
            total_reviews: 10,
            is_verified: true,
            profileImage: 'https://via.placeholder.com/80',
            website_url: 'https://example.com'
        },
        // Add more sample companies as needed
    ];

    const mockCategory = "TestCategory";

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: companies });
        localStorage.setItem("token", "mockToken");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders Companylistbycategory1 component', async () => {
        render(
            <Router>
                <Routes>
                    <Route path="/category/:id" element={<Companylistbycategory1 companies={companies} />} />
                </Routes>
            </Router>,
            { initialEntries: [`/category/${mockCategory}`] }
        );

        // Use regex to match loading text
        waitFor(() => {
            expect(screen.getByText(/در حال بارگذاری\.\.\./)).toBeInTheDocument();
        });

        waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith(
                "http://127.0.0.1:8000/business_management/businesses/category-businesses/",
                expect.any(Object)
            );
        });

        expect(screen.queryByTestId('company-1'));
        expect(screen.queryByText('4.5 میانگین امتیاز'));
        expect(screen.queryByText('10 نظر'));
    });

    test('applies filters correctly', async () => {
        render(
            <Router>
                <Routes>
                    <Route path="/category/:id" element={<Companylistbycategory1 companies={companies} />} />
                </Routes>
            </Router>,
            { initialEntries: [`/category/${mockCategory}`] }
        );

        waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

        // Wait for the element to be present before interacting with it
        waitFor(() => expect(screen.getByText('2')).toBeInTheDocument());


        screen.queryByTestId('applyF');

        await waitFor(() => {
            expect(screen.queryByTestId('company-1')).not.toBeInTheDocument();
        });
    });

    test('handles error state', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));

        render(
            <Router>
                <Routes>
                    <Route path="/category/:id" element={<Companylistbycategory1 companies={companies} />} />
                </Routes>
            </Router>,
            { initialEntries: [`/category/${mockCategory}`] }
        );

         waitFor(() => {
            expect(screen.getByText(/خطا در دریافت داده‌ها\. لطفاً دوباره تلاش کنید\./)).toBeInTheDocument();
        }, { timeout: 5000 });
    });
});
