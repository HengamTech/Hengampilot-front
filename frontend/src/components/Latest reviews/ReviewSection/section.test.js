import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import '@testing-library/jest-dom'; // Import jest-dom matchers
import { MemoryRouter } from 'react-router-dom';
import ReviewSection from './ReviewSection'; // Import the component

import { API_BASE_URL } from '../../config';

// Mock axios
jest.mock('axios');

// Mock image import
jest.mock('./noon.png', () => 'test-file-stub');

const mockReviews = [
    {
        id: 1,
        user: 1,
        business_id: 1,
        review_text: "Great service!",
        rank: 5,
        created_at: "2023-01-01",
    },
];

const mockUser = {
    id: 1,
    username: "John Doe",
    profile_picture: null,
};

const mockBusiness = {
    id: 1,
    business_name: "Best Business",
    website_url: "http://bestbusiness.com",
};

describe('ReviewSection Component', () => {
    beforeEach(() => {
        axios.get.mockImplementation(url => {
            if (url === `${API_BASE_URL}/review_rating/reviews/`) {
                return Promise.resolve({ data: mockReviews });
            } else if (url.startsWith(`${API_BASE_URL}/user_management/users/`)) {
                return Promise.resolve({ data: mockUser });
            } else if (url.startsWith(`${API_BASE_URL}/business_management/businesses/`)) {
                return Promise.resolve({ data: mockBusiness });
            } else {
                return Promise.reject(new Error('Network Error'));
            }
        });
    });

    it('renders review cards', async () => {
        render(
            <MemoryRouter>
                <ReviewSection />
            </MemoryRouter>
        );

        expect(await screen.findByText("مشاهده نظرسنجی‌های اخیر")).toBeInTheDocument();
        expect(await screen.findByText("John Doe")).toBeInTheDocument();
        expect(await screen.findByText("Great service!")).toBeInTheDocument();
        expect(await screen.findByText("Best Business")).toBeInTheDocument();
    });

    it('handles view more functionality', async () => {
        render(
            <MemoryRouter>
                <ReviewSection />
            </MemoryRouter>
        );

        const viewMoreButton = screen.queryByText("مشاهده نظرات بیشتر");

        if (viewMoreButton) {
            fireEvent.click(viewMoreButton);
            expect(await screen.findByText("همه نظرات")).toBeInTheDocument();
        }
    });



    it('handles loading state', async () => {
        axios.get.mockResolvedValueOnce(new Promise(resolve => setTimeout(() => resolve({ data: mockReviews }), 2000))); // Mock delay

        render(
            <MemoryRouter>
                <ReviewSection />
            </MemoryRouter>
        );

        expect(screen.queryByText("در حال بارگذاری..."));

        await waitFor(() => {
            expect(screen.queryByText("John Doe"));
        });
    });

    it('handles error state', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network Error'));

        render(
            <MemoryRouter>
                <ReviewSection />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText("خطا در دریافت اطلاعات نظرات."));
        });
    });
});
