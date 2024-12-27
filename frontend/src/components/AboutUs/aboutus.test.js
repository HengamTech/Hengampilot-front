import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom matchers
import AboutUs from './AboutUs'; // Import your component
import img1 from "./M.r amin.jpg";
import img2 from "./mohammad.png";
import img3 from "./hamidreza.jpg";
import img4 from "./Alireza.jpg";

jest.mock('./M.r amin.jpg', () => 'path/to/image1.jpg');
jest.mock('./mohammad.png', () => 'path/to/image2.jpg');
jest.mock('./hamidreza.jpg', () => 'path/to/image3.jpg');
jest.mock('./Alireza.jpg', () => 'path/to/image4.jpg');

describe('AboutUs Component', () => {
    it('renders the team members', () => {
        render(<AboutUs />);

        // Check if the team members are rendered
        expect(screen.getByText('محمد جلیلی نیا')).toBeInTheDocument();
        expect(screen.getByText('محمد احسان کریمی')).toBeInTheDocument();
        expect(screen.getByText('حمیدرضا کردی')).toBeInTheDocument();
        expect(screen.getByText('علیرضا باقرزاده')).toBeInTheDocument();
    });

    it('renders the team leader', () => {
        render(<AboutUs />);

        // Check if the team leader is rendered
        expect(screen.getByText('Amin Mirlohi')).toBeInTheDocument();
    });

    it('renders the contact information', () => {
        render(<AboutUs />);

        // Check if the contact information is rendered
        expect(screen.getByText('ایمیل')).toBeInTheDocument();
        expect(screen.getByText('HengamPilot@iust.ac.ir')).toBeInTheDocument();
        expect(screen.getByText('تلفن')).toBeInTheDocument();
        expect(screen.getByText('021-11111')).toBeInTheDocument();
        expect(screen.getByText('آدرس')).toBeInTheDocument();
        expect(screen.getByText('تهران، نارمک، میدان رسالت، خیابان هنگام، خیابان دانشگاه علم و صنعت، دانشگاه علم و صنعت ایران')).toBeInTheDocument();
    });

    it('renders the Google Maps iframe', () => {
        render(<AboutUs />);

        // Check if the Google Maps iframe is rendered
        const iframe = screen.getByTitle('نقشه شرکت');
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute('src', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.3673219171565!2d51.5068074!3d35.74177540000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e032fd49e3809%3A0x470e49fef97ae303!2sIran%20University%20of%20Science%20and%20Technology%20(IUST)!5e0!3m2!1sen!2s!4v1734353298701!5m2!1sen!2s');
    });
});

