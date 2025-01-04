import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './loginForm';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import '@testing-library/jest-dom';

const mock = new MockAdapter(axios);

describe('LoginPage', () => {
    beforeEach(() => {
        mock.reset();
    });

    it('renders the login form', () => {
        render(
            <Router>
                <LoginPage />
            </Router>
        );

        expect(screen.getByLabelText(/نام کاربری/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/رمز عبور/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /ورود/i })).toBeInTheDocument();
    });

    it('shows validation errors when fields are empty', async () => {
        render(
            <Router>
                <LoginPage />
            </Router>
        );

        fireEvent.click(screen.getByRole('button', { name: /ورود/i }));

        // Using findByText for directly finding the validation error messages
        const usernameError = await screen.findByText(/نام کاربری الزامی است/i);
        const passwordError = await screen.findByText(/رمز عبور الزامی است/i);

        console.log("Checking validation errors for empty fields");
        screen.debug();

        expect(usernameError).toBeInTheDocument();
        expect(passwordError).toBeInTheDocument();
    });

    it('handles API errors and displays the error message', async () => {
        render(
            <Router>
                <LoginPage />
            </Router>
        );

        fireEvent.change(screen.getByLabelText(/نام کاربری/i), { target: { value: 'newUser' } });
        fireEvent.change(screen.getByLabelText(/رمز عبور/i), { target: { value: 'Password123!' } });

        mock.onPost('http://127.0.0.1:8000/api/token/').reply(500, {
            detail: 'Internal Server Error'
        });

        fireEvent.click(screen.getByRole('button', { name: /ورود/i }));

        try {
            console.log("Attempting to find the error message");
            const errorMessage = await screen.findByText(/ورود ناموفق بود، لطفاً دوباره تلاش کنید!/i, {}, { timeout: 5000 });
            console.log("Found error message:", errorMessage);
            expect(errorMessage).toBeInTheDocument();
        } catch (error) {
            console.error("Error finding the error message:", error);
            console.log("DOM state when error occurred:");
            screen.debug();
            throw error;
        }
    });

    it('navigates to dashboard on successful login', async () => {
        render(
            <Router>
                <LoginPage />
            </Router>
        );

        fireEvent.change(screen.getByLabelText(/نام کاربری/i), { target: { value: 'newUser' } });
        fireEvent.change(screen.getByLabelText(/رمز عبور/i), { target: { value: 'Password123!' } });

        mock.onPost('http://127.0.0.1:8000/api/token/').reply(200, {
            access: 'mockToken',
            user_id: '1234'
        });

        fireEvent.click(screen.getByRole('button', { name: /ورود/i }));

        await waitFor(() => {
            console.log("Checking successful login");
            screen.debug();
            expect(localStorage.getItem('token')).toBe('mockToken');
            expect(localStorage.getItem('userId')).toBe('1234');
        });
    });
});
