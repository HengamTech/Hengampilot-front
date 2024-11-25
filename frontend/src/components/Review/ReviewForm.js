import React, { useState } from "react";

const ReviewForm = ({ addReview }) => {
    const [name, setName] = useState("");
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && rating && comment) {
            const newReview = {
                id: Date.now(),
                name,
                rating,
                comment,
                date: new Date().toISOString().split("T")[0],
            };
            addReview(newReview);
            setName("");
            setRating(0);
            setComment("");
        }
    };

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                <option value={0}>Rate</option>
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
            </select>
            <textarea
                placeholder="Your Review"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit">Submit Review</button>
        </form>
    );
};

export default ReviewForm;
