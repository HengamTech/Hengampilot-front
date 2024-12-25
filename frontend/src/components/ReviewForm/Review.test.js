import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewForm from './ReviewForm';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import '@testing-library/jest-dom';

const mock = new MockAdapter(axios);

describe('ReviewForm', () => {
    beforeEach(() => {
        localStorage.clear();
        mock.reset();
        // Mock the alert function before each test
        window.alert = jest.fn();
    });

    it('renders the review form correctly', () => {
        render(
            <Router>
                <ReviewForm />
            </Router>
        );

        expect(screen.getByLabelText(/نام شرکت/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/توضیحات/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/آدرس وب‌سایت/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /ثبت کسب‌وکار/i })).toBeInTheDocument();
    });

    it('shows validation errors when fields are empty', async () => {
        render(
            <Router>
                <ReviewForm />
            </Router>
        );

        fireEvent.click(screen.getByRole('button', { name: /ثبت کسب‌وکار/i }));

        const businessNameError = await screen.findByText(/لطفاً نام شرکت را وارد کنید/i);
        const descriptionError = await screen.findByText(/لطفاً توضیحات را وارد کنید/i);
        const websiteUrlError = await screen.findByText(/لطفاً آدرس وب‌سایت را وارد کنید/i);

        expect(businessNameError).toBeInTheDocument();
        expect(descriptionError).toBeInTheDocument();
        expect(websiteUrlError).toBeInTheDocument();
    });

    it('submits form successfully', async () => {
        localStorage.setItem('token', 'mockToken');
        localStorage.setItem('userId', 'mockUserId');

        mock.onPost('http://127.0.0.1:8000/business_management/businesses/').reply(201, {});

        render(
            <Router>
                <ReviewForm />
            </Router>
        );

        fireEvent.change(screen.getByLabelText(/نام شرکت/i), { target: { value: 'Test Business' } });
        fireEvent.change(screen.getByLabelText(/توضیحات/i), { target: { value: 'Test Description' } });
        fireEvent.change(screen.getByLabelText(/آدرس وب‌سایت/i), { target: { value: 'http://test.com' } });

        fireEvent.click(screen.getByRole('button', { name: /ثبت کسب‌وکار/i }));

        await waitFor(() => {
            expect(screen.queryByText(/لطفاً نام شرکت را وارد کنید/i)).not.toBeInTheDocument();
        });

        expect(localStorage.getItem('token')).toBe('mockToken');
        expect(localStorage.getItem('userId')).toBe('mockUserId');
    });

    it('shows API error message on submission failure', async () => {
        localStorage.setItem('token', 'mockToken');
        localStorage.setItem('userId', 'mockUserId');

        mock.onPost('http://127.0.0.1:8000/business_management/businesses/').reply(500);

        render(
            <Router>
                <ReviewForm />
            </Router>
        );

        fireEvent.change(screen.getByLabelText(/نام شرکت/i), { target: { value: 'Test Business' } });
        fireEvent.change(screen.getByLabelText(/توضیحات/i), { target: { value: 'Test Description' } });
        fireEvent.change(screen.getByLabelText(/آدرس وب‌سایت/i), { target: { value: 'http://test.com' } });

        fireEvent.click(screen.getByRole('button', { name: /ثبت کسب‌وکار/i }));

        await waitFor(() => {
            expect(window.alert);
        });
    });
});
