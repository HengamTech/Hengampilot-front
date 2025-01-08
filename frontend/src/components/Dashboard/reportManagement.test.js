import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReportManagement from './ReportManagement';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock axios to avoid actual API calls
const mock = new MockAdapter(axios);

describe('ReportManagement Component', () => {
    beforeEach(() => {
        mock.reset();
    });

    test('fetches and displays reports', async () => {
        // Mock API response
        mock.onGet('http://localhost:8000/review_rating/reports/').reply(200, [
            { id: 1, reason_select: 'violence', result_report: 'Unchecked', create_at: '2025-01-08', reason: 'test report' },
            { id: 2, reason_select: 'terrorism', result_report: 'ignore', create_at: '2025-01-07', reason: 'another test report' },
        ]);

        render(<ReportManagement />);

        // Wait for the reports to be fetched and displayed
        await waitFor(() => screen.getByText('خشونت'));

        expect(screen.getByText('خشونت')).toBeInTheDocument();
        expect(screen.getByText('بررسی نشده')).toBeInTheDocument();
        expect(screen.getByText('test report')).toBeInTheDocument();
        expect(screen.getByText('تروریسم')).toBeInTheDocument();
        expect(screen.getByText('نادیده گرفته شود')).toBeInTheDocument();
        expect(screen.getByText('another test report')).toBeInTheDocument();
    });

    test('filters reports by type', async () => {
        mock.onGet('http://localhost:8000/review_rating/reports/').reply(200, [
            { id: 1, reason_select: 'violence', result_report: 'Unchecked', create_at: '2025-01-08', reason: 'test report' },
            { id: 2, reason_select: 'terrorism', result_report: 'ignore', create_at: '2025-01-07', reason: 'another test report' },
        ]);

        render(<ReportManagement />);

        await waitFor(() => screen.getByText('خشونت'));

        // Simulate selecting 'تروریسم' in filter
        fireEvent.change(screen.getByLabelText(/نوع گزارش/), { target: { value: 'terrorism' } });

        await waitFor(() => screen.getByText('تروریسم'));

        // Check if the correct filtered report appears
        expect(screen.getByText('تروریسم')).toBeInTheDocument();
        expect(screen.queryByText('خشونت')).not.toBeInTheDocument();
    });

    test('searches for reports by text', async () => {
        mock.onGet('http://localhost:8000/review_rating/reports/').reply(200, [
            { id: 1, reason_select: 'violence', result_report: 'Unchecked', create_at: '2025-01-08', reason: 'test report' },
            { id: 2, reason_select: 'terrorism', result_report: 'ignore', create_at: '2025-01-07', reason: 'another test report' },
        ]);

        render(<ReportManagement />);

        await waitFor(() => screen.getByText('خشونت'));

        fireEvent.change(screen.getByPlaceholderText('جستجو در توضیحات گزارش...'), { target: { value: 'test report' } });

        // Verify the search input works and the correct report is filtered
        await waitFor(() => screen.getByText('test report'));

        expect(screen.getByText('test report')).toBeInTheDocument();
        expect(screen.queryByText('another test report')).not.toBeInTheDocument();
    });

    test('opens and closes the details modal', async () => {
        mock.onGet('http://localhost:8000/review_rating/reports/').reply(200, [
            { id: 1, reason_select: 'violence', result_report: 'Unchecked', create_at: '2025-01-08', reason: 'test report' },
        ]);

        render(<ReportManagement />);

        await waitFor(() => screen.getByText('خشونت'));

        fireEvent.click(screen.getByText('جزئیات'));

        // Verify the modal opens
        expect(screen.findAllByText('جزئیات گزارش'));

        fireEvent.click(screen.queryByText('بستن'));

        // Verify the modal closes
        await waitFor(() => expect(screen.queryByText('جزئیات گزارش')).not.toBeInTheDocument());
    });



});
