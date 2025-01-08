import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import CompanyDetailPage from './CompanyDetailPage';

jest.mock('axios');

const mockCompany = {
    business_name: "Test Company",
    business_image: "https://via.placeholder.com/80",
    description: "A description of Test Company",
    average_rating: 4.5,
    total_reviews: 10,
};

const mockComments = [
    {
        id: 1,
        review_text: "Great service!",
        rank: 4,
        user: 1,
        created_at: "2025-01-08",
    },
];

const mockUserDetails = {
    1: {
        userId: "testuser",
        userimage: "https://via.placeholder.com/50",
    },
};

const mockVotes = {
    1: [1],
};

describe('CompanyDetailPage', () => {
    beforeEach(() => {
        axios.get.mockReset();
        axios.post.mockReset();
    });

    test('should render company details correctly', async () => {
        axios.get.mockResolvedValueOnce({ data: mockCompany });

        render(
            <MemoryRouter initialEntries={['/company/1']}>
                <Routes>
                    <Route path="company/:id" element={<CompanyDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(axios.get).toHaveBeenCalledWith("http://127.0.0.1:8000/business_management/businesses/1/"));

        expect(screen.getByText(/Test Company/)).toBeInTheDocument();
        expect(screen.getByText(/A description of Test Company/)).toBeInTheDocument();
        expect(screen.getByText(/4.5 میانگین امتیاز/)).toBeInTheDocument();
    });

    test('should show loading message while data is being fetched', () => {
        axios.get.mockResolvedValueOnce({ data: {} });

        render(
            <MemoryRouter initialEntries={['/company/1']}>
                <Routes>
                    <Route path="company/:id" element={<CompanyDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/در حال بارگذاری.../)).toBeInTheDocument();
    });

    test('should handle errors during data fetching', async () => {
        axios.get.mockRejectedValueOnce(new Error("Network error"));

        render(
            <MemoryRouter initialEntries={['/company/1']}>
                <Routes>
                    <Route path="company/:id" element={<CompanyDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText("خطا در دریافت اطلاعات شرکت.")).toBeInTheDocument());
    });

    test('should render comments and allow liking a review', async () => {
        axios.get.mockResolvedValueOnce({ data: mockCompany })
            .mockResolvedValueOnce({ data: mockComments })
            .mockResolvedValueOnce({ data: mockUserDetails });

        axios.post.mockResolvedValueOnce({});

        render(
            <MemoryRouter initialEntries={['/company/1']}>
                <Routes>
                    <Route path="company/:id" element={<CompanyDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3)); // Ensure all API calls were made

        expect(screen.getByText(/Great service!/)).toBeInTheDocument();

        const likeButton = screen.getByText('👍 1');
        fireEvent.click(likeButton);

        await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:8000/review_rating/votes/',
            expect.objectContaining({
                review: 1,
                user: expect.any(String),
            })
        ));
    });

    test('should handle report submission correctly', async () => {
        axios.get.mockResolvedValueOnce({ data: mockCompany })
            .mockResolvedValueOnce({ data: mockComments })
            .mockResolvedValueOnce({ data: mockUserDetails });

        axios.post.mockResolvedValueOnce({});

        render(
            <MemoryRouter initialEntries={['/company/1']}>
                <Routes>
                    <Route path="company/:id" element={<CompanyDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));

        const reportButton = screen.getByRole('button', { name: /گزارش نظر/i });
        fireEvent.click(reportButton);

        const reasonSelect = screen.getByRole('combobox');
        const reasonText = screen.getByPlaceholderText('توضیح دلیل');
        const submitButton = screen.getByRole('button', { name: /ارسال گزارش/i });

        fireEvent.change(reasonSelect, { target: { value: 'violence' } });
        fireEvent.change(reasonText, { target: { value: 'Inappropriate content' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:8000/review_rating/reports/',
            expect.objectContaining({
                reason_select: 'violence',
                reason: 'Inappropriate content',
                review_id: 1,
            })
        ));

        expect(screen.getByText(/گزارش شما با موفقیت ارسال شد./)).toBeInTheDocument();
    });

    test('should allow admin to submit a reply', async () => {
        axios.get.mockResolvedValueOnce({ data: mockCompany })
            .mockResolvedValueOnce({ data: mockComments })
            .mockResolvedValueOnce({ data: mockUserDetails })
            .mockResolvedValueOnce({ data: [{ review: 1, description: "Admin reply" }] });

        axios.post.mockResolvedValueOnce({});

        render(
            <MemoryRouter initialEntries={['/company/1']}>
                <Routes>
                    <Route path="company/:id" element={<CompanyDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));

        const replyButton = screen.getByRole('button', { name: /ریپلای/i });
        fireEvent.click(replyButton);

        const replyTextarea = screen.getByPlaceholderText('پاسخ ادمین را وارد کنید...');
        fireEvent.change(replyTextarea, { target: { value: 'This is an admin reply.' } });

        const submitReplyButton = screen.getByRole('button', { name: /ارسال/i });
        fireEvent.click(submitReplyButton);

        await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:8000/review_rating/review_responses/',
            expect.objectContaining({
                description: 'This is an admin reply.',
                review: 1,
            })
        ));

        expect(screen.getByText(/پاسخ ثبت شد/)).toBeInTheDocument();
    });
});
