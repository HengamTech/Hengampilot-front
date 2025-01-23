// UserReviews.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import UserReviews from './UserReviews';
import { API_BASE_URL } from '../../config';

// Mocking axios to avoid real API calls in tests
jest.mock('axios');

describe('UserReviews Component', () => {
    const token = 'mock-token';
    const userId = '1';

    const mockReviews = [
        {
            id: 1,
            user: 1,
            business_id: 1,
            review_text: 'Great service',
            rank: 5,
            created_at: '2022-12-12',
            hidden: false,
        },
        {
            id: 2,
            user: 1,
            business_id: 2,
            review_text: 'Good experience',
            rank: 4,
            created_at: '2022-12-11',
            hidden: true,
        }
    ];

    const mockUser = {
        username: 'user1',
        first_name: 'John',
        last_name: 'Doe',
        user_image: 'user1.jpg',
    };

    const mockBusinesses = [
        {
            businessId: 1,
            name: 'Business 1',
            pic: 'business1.jpg',
        },
        {
            businessId: 2,
            name: 'Business 2',
            pic: 'business2.jpg',
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem('token', token);

        axios.get.mockImplementation((url) => {
            if (url.startsWith(`${API_BASE_URL}/review_rating/reviews/reviews-by-user/`)) {
                return Promise.resolve({ data: mockReviews });
            }
            if (url.startsWith(`${API_BASE_URL}/user_management/users/`)) {
                return Promise.resolve({ data: mockUser });
            }
            const businessId = url.match(/\/businesses\/(\d+)\//)[1];
            return Promise.resolve({ data: mockBusinesses.find(b => b.businessId === parseInt(businessId)) });
        });
    });

    test('renders loading state initially', () => {
        render(<UserReviews />, { wrapper: BrowserRouter });
        expect(screen.getByText('در حال بارگذاری...')).toBeInTheDocument();
    });

    test('fetches and displays reviews and user information', async () => {
        render(<UserReviews />, { wrapper: BrowserRouter });

        await waitFor(() => {
            expect(screen.getByText('user1 نظرات')).toBeInTheDocument();
            expect(screen.getByText('Great service')).toBeInTheDocument();
            expect(screen.getByText('Good experience')).toBeInTheDocument();
        });
    });

    test('handles error state', async () => {
        axios.get.mockRejectedValueOnce(new Error('Fetching error'));

        render(<UserReviews />, { wrapper: BrowserRouter });

        await waitFor(() => {
            expect(screen.getByText('خطا در دریافت لیست نظرات')).toBeInTheDocument();
        });
    });

    test('displays "no reviews" message when there are no reviews', async () => {
        axios.get.mockResolvedValueOnce({ data: [] });

        render(<UserReviews />, { wrapper: BrowserRouter });

        await waitFor(() => {
            expect(screen.getByText('هیچ نظری ثبت نشده است.')).toBeInTheDocument();
        });
    });

    test('renders correct business information and review details', async () => {
        render(<UserReviews />, { wrapper: BrowserRouter });

         waitFor(() => {
            mockReviews.forEach((review) => {
                const business = mockBusinesses.find(b => b.businessId === review.business_id);
                expect(screen.getByText(review.review_text)).toBeInTheDocument();
                expect(screen.getByText(business.name)).toBeInTheDocument();
            });
        });
    });

    test('renders Jalali date correctly', async () => {
        render(<UserReviews />, { wrapper: BrowserRouter });

         waitFor(() => {
            const jalaliDate = screen.getAllByText(/۱۴۰۱/);  // Example: Matching year 1401 in Jalali
            expect(jalaliDate.length).toBeGreaterThan(0);
        });
    });

    test('correctly renders the user image and business images', async () => {
        render(<UserReviews />, { wrapper: BrowserRouter });

         waitFor(() => {
            mockReviews.forEach((review) => {
                const business = mockBusinesses.find(b => b.businessId === review.business_id);
                const userImage = screen.getByAltText(mockUser.username);
                const businessImage = screen.getByAltText(business.name);
                expect(userImage).toHaveAttribute('src', mockUser.user_image);
                expect(businessImage).toHaveAttribute('src', business.pic);
            });
        });
    });

    test('displays badges correctly for review status', async () => {
        render(<UserReviews />, { wrapper: BrowserRouter });

        await waitFor(() => {
            const approvedBadge = screen.getByText('تایید شده');
            const notApprovedBadge = screen.getByText('تایید نشده');
            expect(approvedBadge).toBeInTheDocument();
            expect(notApprovedBadge).toBeInTheDocument();
        });
    });

    test('correctly renders the star rating for each review', async () => {
        render(<UserReviews />, { wrapper: BrowserRouter });

        await waitFor(() => {
            mockReviews.forEach((review) => {
                const stars = screen.getAllByText('★');

                stars.forEach((star, index) => {
                    if (index < review.rank) {
                        expect(star).toHaveClass('text-warning');
                    } else {
                        expect(star)
                    }
                });
            });
        });
    });
});
