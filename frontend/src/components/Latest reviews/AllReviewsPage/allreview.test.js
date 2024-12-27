import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import '@testing-library/jest-dom'; // Import jest-dom matchers
import { MemoryRouter } from 'react-router-dom';
import AllReviewsPage from './AllReviewsPage'; // Import the component

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

describe('AllReviewsPage Component', () => {
    beforeEach(() => {
        axios.get.mockImplementation(url => {
            if (url === 'http://localhost:8000/review_rating/reviews/') {
                return Promise.resolve({ data: mockReviews });
            } else if (url.startsWith('http://localhost:8000/user_management/users/')) {
                return Promise.resolve({ data: mockUser });
            } else if (url.startsWith('http://localhost:8000/business_management/businesses/')) {
                return Promise.resolve({ data: mockBusiness });
            } else {
                return Promise.reject(new Error('Network Error'));
            }
        });
    });

    it('renders reviews', async () => {
        render(
            <MemoryRouter>
                <AllReviewsPage />
            </MemoryRouter>
        );

        expect(await screen.findByText("همه نظرات")).toBeInTheDocument();
        expect(await screen.findByText("John Doe")).toBeInTheDocument();
        expect(await screen.findByText("Great service!")).toBeInTheDocument();
        expect(await screen.findByText("Best Business")).toBeInTheDocument();
    });

    it('handles likes and dislikes', async () => {
        render(
            <MemoryRouter>
                <AllReviewsPage />
            </MemoryRouter>
        );

        const likeButton = await screen.findByText('👍 0');
        const dislikeButton = await screen.findByText('👎 0');

        fireEvent.click(likeButton);
        expect(await screen.findByText('👍 1')).toBeInTheDocument();

        fireEvent.click(dislikeButton);
        expect(await screen.findByText('👎 1')).toBeInTheDocument();
    });

    it('handles loading state', async () => {
        axios.get.mockResolvedValueOnce(new Promise(resolve => setTimeout(() => resolve({ data: mockReviews }), 2000))); // Mock delay

        render(
            <MemoryRouter>
                <AllReviewsPage />
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
                <AllReviewsPage />
            </MemoryRouter>
        );

        // Using waitFor to ensure that the component re-renders with the error message
        await waitFor(() => {
            expect(screen.queryByText("خطا در دریافت اطلاعات نظرات."));
        });
    });
});
