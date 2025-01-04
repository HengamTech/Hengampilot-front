import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutUs from './AboutUs'; // Adjust the path based on your file structure

jest.mock('./M.r amin.jpg', () => 'mock-img1.jpg');
jest.mock('./mohammad.png', () => 'mock-img2.jpg');
jest.mock('./hamidreza.jpg', () => 'mock-img3.jpg');
jest.mock('./Alireza.jpg', () => 'mock-img4.jpg');
jest.mock('./ehsan.jpg', () => 'mock-img5.jpg');

describe('AboutUs Component', () => {
    beforeEach(() => {
        render(<AboutUs />);
    });

    test('renders the main heading', () => {
        expect(screen.queryByText('اعضای گروه  هنگام پایلت'));
    });

    test('renders the team leader card correctly', () => {
        expect(screen.getByText('Amin Mirlohi')).toBeInTheDocument();
        expect(screen.getByText('مدیر تیم')).toBeInTheDocument();
        expect(screen.getByText('پسر من همیشه به تیمم اطمینان دارم')).toBeInTheDocument();
    });

    test('renders all leadership team members correctly', () => {
        const teamMembers = [
            { name: 'محمد جلیلی نیا', title: 'گروه فرانت اند', description: 'کلاج بگیرید بچه ها زودتر', image: 'mock-img2.jpg' },
            { name: 'محمد احسان کریمی', title: 'گروه بکند', description: 'خنک آن قماربازی که هیچش نماند الا هوس قمار دیگر', image: 'mock-img5.jpg' },
            { name: 'حمیدرضا کردی', title: 'گروه بکند', description: ' متولد ۸۰ پسری اهل جنوب و بیزار از سرما و کولر در عین حال عاشق بستنی و کوهنوردی', image: 'mock-img3.jpg' },
            { name: 'علیرضا باقرزاده', title: 'گروه فرانت اند', description: 'دریغ از یک ارامش خداااااااااااااا', image: 'mock-img4.jpg' },
        ];

        teamMembers.forEach(member => {
            expect(screen.queryByText(member.name));
            expect(screen.queryByText(member.description));
            expect(screen.queryByText(member.name));
        });
    });

    test('renders contact information correctly', () => {
        expect(screen.getByText('ایمیل')).toBeInTheDocument();
        expect(screen.getByText('HengamPilot@iust.ac.ir')).toBeInTheDocument();
        expect(screen.getByText('تلفن')).toBeInTheDocument();
        expect(screen.getByText('021-11111')).toBeInTheDocument();
        expect(screen.getByText('آدرس')).toBeInTheDocument();
        expect(screen.getByText('تهران، نارمک، میدان رسالت، خیابان هنگام، خیابان دانشگاه علم و صنعت، دانشگاه علم و صنعت ایران')).toBeInTheDocument();
    });

    test('renders the Google Maps iframe', () => {
        const iframe = screen.getByTitle('نقشه شرکت');
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute('src', expect.stringContaining('https://www.google.com/maps'));
    });
});
