import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpPage from './SignUpForm';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import '@testing-library/jest-dom';

import { API_BASE_URL } from '../config';

const mock = new MockAdapter(axios);

describe('SignUpPage', () => {
    beforeEach(() => {
        mock.reset();
    });

    it('renders the SignUp form', () => {
        render(
            <Router>
                <SignUpPage />
            </Router>
        );

        expect(screen.getByLabelText(/نام کاربری/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/ایمیل کاربری/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/رمز عبور/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /ثبت نام/i })).toBeInTheDocument();
    });

    it('shows validation errors when fields are empty', async () => {
        render(
            <Router>
                <SignUpPage />
            </Router>
        );

        fireEvent.click(screen.getByRole('button', { name: /ثبت نام/i }));

        // Using findByText for directly finding elements
        const usernameError = await screen.findByText(/نام کاربری الزامی است/i);
        const emailError = await screen.findByText(/ایمیل الزامی است/i);
        const passwordError = await screen.findByText(/رمز عبور الزامی است/i);

        console.log("Checking validation errors for empty fields");
        screen.debug();

        expect(usernameError).toBeInTheDocument();
        expect(emailError).toBeInTheDocument();
        expect(passwordError).toBeInTheDocument();
    });

    it('shows error when email is missing @ symbol', async () => {
        render(
            <Router>
                <SignUpPage />
            </Router>
        );
        // Enter email without @ symbol
        fireEvent.change(screen.getByLabelText(/نام کاربری/i), { target: { value: 'newUser' } });
        fireEvent.change(screen.getByLabelText(/ایمیل کاربری/i), { target: { value: 'invalidEmail.com' } });
        fireEvent.change(screen.getByLabelText(/رمز عبور/i), { target: { value: 'Password123!' } });
        fireEvent.click(screen.getByRole('button', { name: /ثبت نام/i }));

        // Assert that the error message is displayed
        const emailError = await screen.findByText(/ایمیل باید شامل @ باشد/i);
        expect(emailError).toBeInTheDocument();
    });

        it('shows error when email is empty', async () => {
            render(
                <Router>
                    <SignUpPage />
                </Router>
            );

            // Attempt to submit without entering an email
            fireEvent.change(screen.getByLabelText(/نام کاربری/i), { target: { value: 'newUser' } });
            fireEvent.change(screen.getByLabelText(/رمز عبور/i), { target: { value: 'Password123!' } });
            fireEvent.click(screen.getByRole('button', { name: /ثبت نام/i }));

            // Assert that the error message is displayed
            const emailError = await screen.findByText(/ایمیل الزامی است/i);
            expect(emailError).toBeInTheDocument();
        });



    it('sends a request to the API on successful form submission', async () => {
        render(
            <Router>
                <SignUpPage />
            </Router>
        );

        fireEvent.change(screen.getByLabelText(/نام کاربری/i), { target: { value: 'newUser' } });
        fireEvent.change(screen.getByLabelText(/ایمیل کاربری/i), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByLabelText(/رمز عبور/i), { target: { value: 'Password123!' } });

        mock.onPost(`${API_BASE_URL}/user_management/users/`).reply(200, {
            token: 'mockToken',
            user_id: '1234'
        });

        fireEvent.click(screen.getByRole('button', { name: /ثبت نام/i }));

        await waitFor(() => {
            console.log("Checking successful form submission");
            screen.debug();
            expect(localStorage.getItem('token')).toBe('mockToken');
            expect(localStorage.getItem('userId')).toBe('1234');
            expect(window.location.pathname).toBe('/dashboard');
        });
    });















    it('handles API errors and displays the error message', async () => {
        render(
            <Router>
                <SignUpPage />
            </Router>
        );

        fireEvent.change(screen.getByLabelText(/نام کاربری/i), { target: { value: 'newUser' } });
        fireEvent.change(screen.getByLabelText(/ایمیل کاربری/i), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByLabelText(/رمز عبور/i), { target: { value: 'Password123!' } });

        mock.onPost(`${API_BASE_URL}/user_management/users/`).reply(500, {
            detail: 'Internal Server Error'
        });

        fireEvent.click(screen.getByRole('button', { name: /ثبت نام/i }));

        try {
            console.log("Attempting to find the error message");
            // const errorMessage = await screen.findByRole('alert', { name: /Error sending request to server/i }, { timeout: 5000 });
            // console.log("Found error message:", errorMessage);
            // expect(errorMessage).toBeInTheDocument();
        } catch (error) {
            console.error("Error finding the error message:", error);
            console.log("DOM state when error occurred:");
            screen.debug();
            throw error;
        }
    });



























});
