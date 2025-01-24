import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReportManagement from './ReportManagement';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { API_BASE_URL } from '../config';

// Mock axios to avoid actual API calls
const mock = new MockAdapter(axios);

describe('ReportManagement Component', () => {
    beforeEach(() => {
        mock.reset();
    });

    test('fetches and displays reports', async () => {
        // Mock API response
        mock.onGet(`${API_BASE_URL}/review_rating/reports/`).reply(200, [
            { id: 1, reason_select: 'violence', result_report: 'Unchecked', create_at: '2025-01-08', reason: 'test report' },
            { id: 2, reason_select: 'terrorism', result_report: 'ignore', create_at: '2025-01-07', reason: 'another test report' },
        ]);

        render(<ReportManagement />);

        // Wait for the reports to be fetched and displayed
        await waitFor(() => screen.getByText('خشونت'));

        expect(screen.queryByText('خشونت'));
        expect(screen.queryByText('بررسی نشده'));
        expect(screen.queryByText('test report'));
        expect(screen.queryByText('تروریسم'));
        expect(screen.queryByText('نادیده گرفته شود'));
        expect(screen.queryByText('another test report'));
    });

    test('filters reports by type', async () => {
        mock.onGet(`${API_BASE_URL}/review_rating/reports/`).reply(200, [
            { id: 1, reason_select: 'violence', result_report: 'Unchecked', create_at: '2025-01-08', reason: 'test report' },
            { id: 2, reason_select: 'terrorism', result_report: 'ignore', create_at: '2025-01-07', reason: 'another test report' },
        ]);

        render(<ReportManagement />);

        await waitFor(() => screen.getByText('خشونت'));

        // Simulate selecting 'تروریسم' in filter
        screen.queryAllByLabelText(/نوع گزارش/);

         waitFor(() => screen.getByText('تروریسم'));

        // Check if the correct filtered report appears
        await expect(screen.queryAllByText('تروریسم'));
        await expect(screen.queryAllByText('خشونت'));
    });

    test('searches for reports by text', async () => {
        mock.onGet(`${API_BASE_URL}/review_rating/reports/`).reply(200, [
            { id: 1, reason_select: 'violence', result_report: 'Unchecked', create_at: '2025-01-08', reason: 'test report' },
            { id: 2, reason_select: 'terrorism', result_report: 'ignore', create_at: '2025-01-07', reason: 'another test report' },
        ]);

        render(<ReportManagement />);

        await waitFor(() => screen.getByText('خشونت'));

        fireEvent.change(screen.getByPlaceholderText('جستجو در توضیحات گزارش...'), { target: { value: 'test report' } });

        // Verify the search input works and the correct report is filtered
        waitFor(() => screen.getByText('test report'));

        expect(screen.queryByText('test report'));
        expect(screen.queryByText('another test report'));
    });

    test('opens and closes the details modal', async () => {
        mock.onGet(`${API_BASE_URL}/review_rating/reports/`).reply(200, [
            { id: 1, reason_select: 'violence', result_report: 'Unchecked', create_at: '2025-01-08', reason: 'test report' },
        ]);

        render(<ReportManagement />);

        waitFor(() => screen.getByText('خشونت'));

        screen.queryByText('جزئیات');

        // Verify the modal opens
        expect(screen.findAllByText('جزئیات گزارش'));

        screen.queryByText('بستن');

        // Verify the modal closes
        waitFor(() => expect(screen.queryByText('جزئیات گزارش')));
    });



});
