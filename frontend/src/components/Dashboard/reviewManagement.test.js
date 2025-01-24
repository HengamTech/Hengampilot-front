import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ReviewManagementPage from './ReviewManagementPage';

jest.mock('axios');

describe('ReviewManagementPage', () => {
    const reviews = [
        {
            id: 1,
            user: 1,
            business_id: 1,
            rank: 4.5,
            review_text: 'Great service!',
            created_at: '2021-12-01',
            hidden: false
        },
        // Add more sample reviews as needed
    ];

    const businessesMap = {
        1: 'Business 1',
        // Add more sample businesses as needed
    };

    const usersMap = {
        1: 'User 1',
        // Add more sample users as needed
    };

    beforeEach(() => {
        axios.get.mockImplementation((url) => {
            if (url.includes('reviews')) {
                return Promise.resolve({ data: reviews });
            } else if (url.includes('businesses')) {
                return Promise.resolve({ data: { business_name: businessesMap[1] } });
            } else if (url.includes('users')) {
                return Promise.resolve({ data: { username: usersMap[1] } });
            }
            return Promise.reject(new Error('not found'));
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders ReviewManagementPage component', async () => {
        render(<ReviewManagementPage />);
        expect(screen.getByText('مدیریت نظرات')).toBeInTheDocument();
        await waitFor(() => expect(axios.get).toHaveBeenCalled());
    });

    test('fetches and displays reviews', async () => {
        render(<ReviewManagementPage />);
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3)); // reviews, businesses, and users
        expect(screen.queryByText('Great service!'));
        expect(screen.queryByText('User 1'));
        expect(screen.queryByText('Business 1'));
    });

    test('handles search functionality', async () => {
        render(<ReviewManagementPage />);
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));
        fireEvent.change(screen.getByPlaceholderText('جستجو...'), { target: { value: 'User 1' } });
        expect(screen.queryAllByText('Great service!'));
    });
    test('handles review hiding', async () => {
        render(<ReviewManagementPage />);
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));
        screen.queryByTestId('show-review-1');
        waitFor(() => expect(axios.put).toHaveBeenCalled());
        expect(screen.queryAllByText('مخفی شده'));
    });

    test('handles review deletion', async () => {
        render(<ReviewManagementPage />);
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));
        screen.queryByTestId('delete-review-1');
        await waitFor(() => expect(axios.delete));
        expect(screen.queryByText('Great service!')).not.toBe();
    });

});
