// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import EditUserForm from './EditUserForm';
// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';
// import { Router, useParams } from 'react-router-dom';
// import React from 'react';
// import '@testing-library/jest-dom';
// import { createMemoryHistory } from 'history';
//
// // Mock useParams to return the userId
// jest.mock('react-router-dom', () => ({
//     ...jest.requireActual('react-router-dom'),
//     useParams: jest.fn(),
// }));
//
// const mock = new MockAdapter(axios);
// const history = createMemoryHistory();
//
// const renderWithRouter = (component, { route = '/' } = {}) => {
//     history.push(route);
//     return render(
//         <Router location={route} navigator={history}>
//             {component}
//         </Router>
//     );
// };
//
// describe('EditUserForm', () => {
//     beforeEach(() => {
//         localStorage.clear();
//         mock.reset();
//         window.alert = jest.fn(); // Mock the alert function
//         useParams.mockReturnValue({ userId: 'mockUserId' }); // Mock useParams to return userId
//     });
//
//     it('renders loading state initially', () => {
//         renderWithRouter(<EditUserForm />);
//         expect(screen.getByText(/در حال بارگذاری/i)).toBeInTheDocument();
//     });
//
//     it('fetches user data and updates form fields', async () => {
//         localStorage.setItem('token', 'mockToken');
//         mock.onGet('http://127.0.0.1:8000/user_management/users/mockUserId/').reply(200, {
//             first_name: 'John',
//             last_name: 'Doe',
//             email: 'john.doe@example.com',
//             username: 'johndoe',
//         });
//
//         renderWithRouter(<EditUserForm />, { route: '/edit/mockUserId' });
//
//         await waitFor(() => {
//             expect(screen.getByDisplayValue('John')).toBeInTheDocument();
//             expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
//             expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
//             expect(screen.getByDisplayValue('johndoe')).toBeInTheDocument();
//         });
//     });
//
//     it('shows error message when fetching user data fails', async () => {
//         localStorage.setItem('token', 'mockToken');
//         mock.onGet('http://127.0.0.1:8000/user_management/users/mockUserId/').reply(500, {
//             detail: 'Internal Server Error'
//         });
//
//         renderWithRouter(<EditUserForm />, { route: '/edit/mockUserId' });
//
//         await waitFor(() => {
//             expect(screen.getByText(/خطا: 500 - Internal Server Error/i)).toBeInTheDocument();
//         });
//     });
//
//     it('handles form submission successfully', async () => {
//         localStorage.setItem('token', 'mockToken');
//         mock.onGet('http://127.0.0.1:8000/user_management/users/mockUserId/').reply(200, {
//             first_name: 'John',
//             last_name: 'Doe',
//             email: 'john.doe@example.com',
//             username: 'johndoe',
//         });
//
//         mock.onPut('http://127.0.0.1:8000/user_management/users/mockUserId/').reply(200);
//
//         renderWithRouter(<EditUserForm />, { route: '/edit/mockUserId' });
//
//         await waitFor(() => {
//             expect(screen.getByDisplayValue('John')).toBeInTheDocument();
//             expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
//             expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
//             expect(screen.getByDisplayValue('johndoe')).toBeInTheDocument();
//         });
//
//         fireEvent.change(screen.getByLabelText('نام'), { target: { value: 'Jane' } });
//         fireEvent.change(screen.getByLabelText('نام خانوادگی'), { target: { value: 'Smith' } });
//         fireEvent.change(screen.getByLabelText('ایمیل'), { target: { value: 'jane.smith@example.com' } });
//         fireEvent.change(screen.getByLabelText('نام کاربری'), { target: { value: 'janesmith' } });
//         fireEvent.change(screen.getByLabelText('پسورد'), { target: { value: 'newpassword' } });
//
//         fireEvent.click(screen.getByRole('button', { name: /ذخیره تغییرات/i }));
//
//         await waitFor(() => {
//             expect(window.alert).toHaveBeenCalledWith('اطلاعات با موفقیت به‌روزرسانی شد.');
//             expect(history.location.pathname).toBe('/login');
//         });
//     });
//
//     it('shows error message when form submission fails', async () => {
//         localStorage.setItem('token', 'mockToken');
//         mock.onGet('http://127.0.0.1:8000/user_management/users/mockUserId/').reply(200, {
//             first_name: 'John',
//             last_name: 'Doe',
//             email: 'john.doe@example.com',
//             username: 'johndoe',
//         });
//
//         mock.onPut('http://127.0.0.1:8000/user_management/users/mockUserId/').reply(500, {
//             detail: 'Internal Server Error'
//         });
//
//         renderWithRouter(<EditUserForm />, { route: '/edit/mockUserId' });
//
//         await waitFor(() => {
//             expect(screen.getByDisplayValue('John')).toBeInTheDocument();
//             expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
//             expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
//             expect(screen.getByDisplayValue('johndoe')).toBeInTheDocument();
//         });
//
//         fireEvent.change(screen.getByLabelText('نام'), { target: { value: 'Jane' } });
//         fireEvent.change(screen.getByLabelText('نام خانوادگی'), { target: { value: 'Smith' } });
//         fireEvent.change(screen.getByLabelText('ایمیل'), { target: { value: 'jane.smith@example.com' } });
//         fireEvent.change(screen.getByLabelText('نام کاربری'), { target: { value: 'janesmith' } });
//         fireEvent.change(screen.getByLabelText('پسورد'), { target: { value: 'newpassword' } });
//
//         fireEvent.click(screen.getByRole('button', { name: /ذخیره تغییرات/i }));
//
//         await waitFor(() => {
//             expect(window.alert).toHaveBeenCalledWith('خطا در به‌روزرسانی اطلاعات: {"detail":"Internal Server Error"}');
//         });
//     });
// });
