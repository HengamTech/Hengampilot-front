// صفحه 404 با طراحی بهتر و عکس با استفاده از React
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div style={styles.container}>
            <div style={styles.imageContainer}>
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyXC1MU3X0FQjZ3upsCGU0U2IMFYhmnHRJOg&s"
                    alt="Page not found"
                    style={styles.image}
                />
            </div>
            <div style={styles.textContainer}>
                <h1 style={styles.title}>404</h1>
                <p style={styles.message}>متأسفیم، صفحه‌ای که به دنبال آن هستید پیدا نشد!</p>
                <Link to="/" style={styles.link}>بازگشت به صفحه اصلی</Link>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
        backgroundColor: '#f8f9fa',
        padding: '50px',
        //gap: '-5%', // Reduce gap to bring items closer
        flexWrap: 'wrap', // Enable wrapping for responsiveness
    },
    imageContainer: {
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '300px',
    },
    textContainer: {
        flex: '1',
        textAlign: 'center',
        color: '#343a40',
        minWidth: '300px',
        //paddingLeft: '10px', // Optional padding for balance
    },
    image: {
        width: '100%',
        maxWidth: '500px',
        height: 'auto',
    },
    title: {
        fontSize: '4rem',
        margin: '0 0 20px',
    },
    message: {
        fontSize: '1.5rem',
        margin: '1rem 0',
    },
    link: {
        fontSize: '1rem',
        color: '#007bff',
        textDecoration: 'none',
        marginTop: '2rem',
        border: '1px solid #007bff',
        padding: '10px 15px',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease',
    },
    '@media (max-width: 768px)': { // Media query for smaller screens
        container: {
            flexDirection: 'column',
            textAlign: 'center', // Center text on smaller screens
        },
        textContainer: {
            textAlign: 'center',
            paddingLeft: '0', // Remove padding on smaller screens
        },
    },
};

export default NotFoundPage;
