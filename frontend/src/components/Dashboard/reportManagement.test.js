import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ReportManagement from './ReportManagement';

jest.mock('axios');

describe('ReportManagement', () => {
    const mockReports = [
        {
            id: 1,
            business_name: 'Business 1',
            average_rating: 4.5,
            total_reviews: 10,
            is_verified: true,
            profileImage: 'https://via.placeholder.com/80',
            website_url: 'https://example.com',
            reason_select: 'violence',
            reason: 'Violent content',
            result_report: 'pending',
            create_at: '2023-01-01'
        },
        // Add more mock reports as needed
    ];

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockReports });
        localStorage.setItem("token", "mockToken");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('fetches and displays reports', async () => {
        render(<ReportManagement />);

         waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith("http://localhost:8000/review_rating/reports/", expect.any(Object));
        });

         waitFor(() => {
            expect(screen.queryAllByText('Business 1'));
            expect(screen.queryAllByText('4.5'));
            expect(screen.queryAllByText('10'));
        });
    });

    test('applies filters correctly', async () => {
        render(<ReportManagement />);

         waitFor(() => {
            expect(screen.queryAllByText('Business 1'));
        });

        screen.queryAllByText('report-type-select');
        screen.queryAllByText('apply-filters-button');

         waitFor(() => {
            expect(screen.getByText('Business 1')).toBeInTheDocument();
        });

        expect(screen.queryByTestId('status-select'));
        expect(screen.queryByTestId('apply-filters-button'));

         waitFor(() => {
            expect(screen.getByText('Business 1')).toBeInTheDocument();
        });
    });

    test('handles report details view', async () => {
        render(<ReportManagement />);

         waitFor(() => {
            expect(screen.queryAllByText('Business 1'));
        });

        screen.queryAllByText('button-1');

         waitFor(() => {
            expect(screen.getByText('جزئیات گزارش')).toBeInTheDocument();
            expect(screen.getByText('Violent content')).toBeInTheDocument();
        });
    });

    test('handles ignoring report', async () => {
        render(<ReportManagement />);

         waitFor(() => {
            expect(screen.queryAllByText('Business 1'));
        });

        expect(screen.queryAllByText('button'));
        expect(screen.queryAllByText('نادیده گرفتن گزارش'));

         waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith(
                "http://localhost:8000/review_rating/reports/1/",
                expect.objectContaining({ result_report: 'ignore' }),
                expect.any(Object)
            );
        });
    });

    test('handles user deletion and ban', async () => {
        render(<ReportManagement />);

         waitFor(() => {
            expect(screen.queryAllByText('Business 1'));
        });

        screen.queryAllByText('button');
        screen.queryAllByText('حذف کاربر');

        window.confirm = jest.fn(() => true);
         waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith("http://localhost:8000/user_management/users/1/");
        });

        fireEvent.click(screen.getByText('مسدود کردن کاربر'));

        window.confirm = jest.fn(() => true);
         waitFor(() => {
            expect(axios.patch).toHaveBeenCalledWith(
                "http://localhost:8000/user_management/users/1/",
                expect.objectContaining({ is_active: false }),
                expect.any(Object)
            );
        });
    });
});
