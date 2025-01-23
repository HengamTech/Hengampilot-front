import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Router, useParams, useNavigate } from 'react-router-dom';
import ReviewSubmit from './ReviewSubmit';
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

describe('ReviewSubmit', () => {
    beforeEach(() => {
        localStorage.clear();
        mock.reset();
        window.alert = jest.fn(); // Mock the alert function
        useParams.mockReturnValue({ id: 'mockBusinessId' }); // Mock useParams to return businessId
        useNavigate.mockReturnValue(navigate); // Mock useNavigate to return navigate
    });

    it('renders loading state initially', async () => {
        localStorage.setItem('token', 'mockToken');
        localStorage.setItem('username', 'mockUsername');
        localStorage.setItem('userId', 'mockUserId');

        mock.onGet(`${API_BASE_URL}/business_management/businesses/mockBusinessId/`).reply(200, {
            business_name: 'Mock Business',
        });

        renderWithRouter(<ReviewSubmit />);

        await waitFor(() => {
            expect(screen.getByText(/شرکت: Mock Business/i)).toBeInTheDocument();
            expect(screen.getByText(/کاربر: mockUsername/i)).toBeInTheDocument();
        });
    });

    it('shows error message when fetching business name fails', async () => {
        localStorage.setItem('token', 'mockToken');
        localStorage.setItem('username', 'mockUsername');
        localStorage.setItem('userId', 'mockUserId');

        mock.onGet(`${API_BASE_URL}/business_management/businesses/mockBusinessId/`).reply(500);

        renderWithRouter(<ReviewSubmit />);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('خطا در دریافت اطلاعات شرکت.');
        });
    });

    it('validates and shows errors when form fields are empty', async () => {
        localStorage.setItem('token', 'mockToken');
        localStorage.setItem('username', 'mockUsername');
        localStorage.setItem('userId', 'mockUserId');

        mock.onGet(`${API_BASE_URL}/business_management/businesses/mockBusinessId/`).reply(200, {
            business_name: 'Mock Business',
        });

        renderWithRouter(<ReviewSubmit />);

        fireEvent.click(screen.getByRole('button', { name: /ارسال نظر/i }));

        await waitFor(() => {
// Check if validation messages are displayed
            expect(screen.getByText('لطفاً متن نظر را وارد کنید.')).toBeInTheDocument();
            expect(screen.getByText('لطفاً امتیاز خود را انتخاب کنید.')).toBeInTheDocument();
        });
    });

    it('submits the form successfully', async () => {
        localStorage.setItem('token', 'mockToken');
        localStorage.setItem('username', 'mockUsername');
        localStorage.setItem('userId', 'mockUserId');

        mock.onGet(`${API_BASE_URL}/business_management/businesses/mockBusinessId/`).reply(200, {
            business_name: 'Mock Business',
        });

        mock.onPost(`${API_BASE_URL}/review_rating/reviews/`).reply(201);

        renderWithRouter(<ReviewSubmit />);

        fireEvent.change(screen.getByLabelText(/متن نظر/i), { target: { value: 'Great service!' } });
        fireEvent.click(screen.getByTestId('star-5'));

        fireEvent.click(screen.getByRole('button', { name: /ارسال نظر/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('نظر شما با موفقیت ثبت شد!');
            expect(navigate).toHaveBeenCalledWith('/companies/mockBusinessId');
        });
    });

    it('shows error message when form submission fails', async () => {
        localStorage.setItem('token', 'mockToken');
        localStorage.setItem('username', 'mockUsername');
        localStorage.setItem('userId', 'mockUserId');

        mock.onGet(`${API_BASE_URL}/business_management/businesses/mockBusinessId/`).reply(200, {
            business_name: 'Mock Business',
        });

        mock.onPost(`${API_BASE_URL}/review_rating/reviews/`).reply(500);

        renderWithRouter(<ReviewSubmit />);

        fireEvent.change(screen.getByLabelText(/متن نظر/i), { target: { value: 'Great service!' } });
        fireEvent.click(screen.getByTestId('star-5'));

        fireEvent.click(screen.getByRole('button', { name: /ارسال نظر/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('خطا در ارسال نظر. لطفا دوباره تلاش کنید.');
        });
    });
});