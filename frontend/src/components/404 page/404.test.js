// import { render, screen } from '@testing-library/react';
// import NotFoundPage from './404';
// import { BrowserRouter as Router } from 'react-router-dom';
// import React from 'react';
// import '@testing-library/jest-dom';
//
// describe('NotFoundPage', () => {
//     it('renders the 404 message and link', () => {
//         render(
//             <Router>
//                 <NotFoundPage />
//             </Router>
//         );
//
//         // Check if the image is present
//         const image = screen.getByAltText(/Page not found/i);
//         expect(image).toBeInTheDocument();
//
//         // Check if the 404 title is present
//         const title = screen.getByText(/404/i);
//         expect(title).toBeInTheDocument();
//
//         // Check if the message is present
//         const message = screen.getByText(/متأسفیم، صفحه‌ای که به دنبال آن هستید پیدا نشد!/i);
//         expect(message).toBeInTheDocument();
//
//         // Check if the link to the home page is present
//         const link = screen.getByRole('link', { name: /بازگشت به صفحه اصلی/i });
//         expect(link).toBeInTheDocument();
//         expect(link).toHaveAttribute('href', '/');
//     });
// });
