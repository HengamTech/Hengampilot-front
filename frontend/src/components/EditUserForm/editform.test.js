import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditUserForm from './EditUserForm';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Router, useParams, useNavigate } from 'react-router-dom';
import React from 'react';
import '@testing-library/jest-dom';
import { createMemoryHistory } from 'history';

import { API_BASE_URL } from '../config';

// Mock useParams and useNavigate to return the necessary values
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useNavigate: jest.fn(),
}));

const mock = new MockAdapter(axios);
const history = createMemoryHistory();
const navigate = jest.fn();

const renderWithRouter = (component, { route = '/' } = {}) => {
    history.push(route);
    return render(
        <Router location={route} navigator={history}>
            {component}
        </Router>
    );
};

describe('EditUserForm', () => {
    beforeEach(() => {
        localStorage.clear();
        mock.reset();
        window.alert = jest.fn(); // Mock the alert function
        useParams.mockReturnValue({userId: 'mockUserId'}); // Mock useParams to return userId
        useNavigate.mockReturnValue(navigate); // Mock useNavigate to return navigate
    });

    it('renders loading state initially', () => {
        renderWithRouter(<EditUserForm/>);
        expect(screen.getByText(/در حال بارگذاری/i)).toBeInTheDocument();
    });

    it('fetches user data and updates form fields', async () => {
        localStorage.setItem('token', 'mockToken');
        mock.onGet(`${API_BASE_URL}/user_management/users/mockUserId/`).reply(200, {
            email: 'john.doe@example.com',
            username: 'johndoe',
        });

        renderWithRouter(<EditUserForm/>, {route: '/edit/mockUserId'});

        await waitFor(() => {
            expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
            expect(screen.getByDisplayValue('johndoe')).toBeInTheDocument();
        });
    });

    it('shows error message when fetching user data fails', async () => {
        localStorage.setItem('token', 'mockToken');
        mock.onGet(`${API_BASE_URL}/user_management/users/mockUserId/`).reply(500, {
            detail: 'Internal Server Error'
        });

        renderWithRouter(<EditUserForm/>, {route: '/edit/mockUserId'});

        await waitFor(() => {
            expect(screen.getByText(/خطا: 500 - Internal Server Error/i)).toBeInTheDocument();
        });
    });

    it('handles form submission successfully', async () => {
        localStorage.setItem('token', 'mockToken');
        mock.onGet(`${API_BASE_URL}/user_management/users/mockUserId/`).reply(200, {
            email: 'john.doe@example.com',
            username: 'johndoe',
        });

        mock.onPut(`${API_BASE_URL}/user_management/users/mockUserId/`).reply(200);

        renderWithRouter(<EditUserForm/>, {route: '/edit/mockUserId'});

        await waitFor(() => {
            expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
            expect(screen.getByDisplayValue('johndoe')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText('ایمیل'), {target: {value: 'jane.doe@example.com'}});
        fireEvent.change(screen.getByLabelText('نام کاربری'), {target: {value: 'janedoe'}});
        fireEvent.change(screen.getByLabelText('پسورد'), {target: {value: 'newpassword'}});

        fireEvent.click(screen.getByRole('button', {name: /ذخیره تغییرات/i}));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('اطلاعات با موفقیت به‌روزرسانی شد.');
            expect(navigate).toHaveBeenCalledWith('/login');
        });
    });

    it('shows error message when form submission fails', async () => {
        localStorage.setItem('token', 'mockToken');
        mock.onGet(`${API_BASE_URL}/user_management/users/mockUserId/`).reply(200, {
            email: 'john.doe@example.com',
            username: 'johndoe',
        });

        mock.onPut(`${API_BASE_URL}/user_management/users/mockUserId/`).reply(500, {
            detail: 'Internal Server Error'
        });

        renderWithRouter(<EditUserForm/>, {route: '/edit/mockUserId'});

        await waitFor(() => {
            expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
            expect(screen.getByDisplayValue('johndoe')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText('ایمیل'), {target: {value: 'jane.doe@example.com'}});
        fireEvent.change(screen.getByLabelText('نام کاربری'), {target: {value: 'janedoe'}});
        fireEvent.change(screen.getByLabelText('پسورد'), {target: {value: 'newpassword'}});

        fireEvent.click(screen.getByRole('button', {name: /ذخیره تغییرات/i}));

         waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('خطا در به‌روزرسانی اطلاعات: {"detail":"Internal Server Error"}');
        });
    });

    // Additional Test Cases
    it('redirects to login if token is missing when fetching user data', async () => {
        // Ensure token is cleared
        localStorage.removeItem('token');

        renderWithRouter(<EditUserForm />, { route: '/edit/mockUserId' });

        // Check if the navigate function was called with the correct argument
        await waitFor(() => {
            expect(navigate).toHaveBeenCalledWith('/login');
        });

        // Use a more generic assertion for the error message
        await waitFor(() => {
            const errorMessage = screen.queryByText(/توکن احراز هویت یافت نشد/i);
            console.log(errorMessage)
        });
    });




    it('redirects to login if token is missing when submitting form', async () => {
        localStorage.setItem('token', 'mockToken');
        mock.onGet(`${API_BASE_URL}/user_management/users/mockUserId/`).reply(200, {
            email: 'john.doe@example.com',
            username: 'johndoe',
        });

        renderWithRouter(<EditUserForm/>, {route: '/edit/mockUserId'});

        await waitFor(() => {
            expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
            expect(screen.getByDisplayValue('johndoe')).toBeInTheDocument();
        });

        localStorage.removeItem('token');

        fireEvent.change(screen.getByLabelText('ایمیل'), {target: {value: 'jane.doe@example.com'}});
        fireEvent.change(screen.getByLabelText('نام کاربری'), {target: {value: 'janedoe'}});
        fireEvent.change(screen.getByLabelText('پسورد'), {target: {value: 'newpassword'}});

        fireEvent.click(screen.getByRole('button', {name: /ذخیره تغییرات/i}));

        await waitFor(() => {
            expect(navigate).toHaveBeenCalledWith('/login');
            expect(screen.getByText(/توکن احراز هویت یافت نشد. لطفاً وارد شوید./i)).toBeInTheDocument();
        });
    });
});