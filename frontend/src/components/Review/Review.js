import React from "react";

const Review = ({ review }) => {
    const { name, rating, comment, date } = review;

    return (
        <div className="review">
            <h3>{name}</h3>
            <p>Rating: {"★".repeat(rating)}{"☆".repeat(5 - rating)}</p>
            <p>{comment}</p>
            <small>{date}</small>
        </div>
    );
};

export default Review;
