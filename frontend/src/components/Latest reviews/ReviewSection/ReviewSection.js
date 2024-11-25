import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewSection.css';
import img from './noon.png';

const reviews = [
  { id: 2, name: "محمد احمدی", date: "1403/08/08", rating: 3, comment: " Inception is undoubtedly one of my all-time favorite films. Directed by Christopher Nolan, it offers a remarkable fusion of mind-bending storytelling, outstanding performances, and visually stunning scenes that have left a lasting impression on me. From the very first viewing, I was captivated by its intricate plot and the way it compels the audience to reflect on the nature of reality and dreams.The performances are equally impressive. Leonardo DiCaprio shines as Dom Cobb, a man haunted by his past while navigating the dangerous realm of dream-sharing. The supporting cast—Joseph Gordon-Levitt, Ellen Page, and Tom Hardy—deliver authentic portrayals that draw you into their emotional journeys. Their chemistry adds a level of authenticity that makes the characters' relationships feel real.Visually, Inception is nothing short of a masterpiece. The special effects, especially the folding cityscape and zero-gravity fight scene, are groundbreaking and essential to the film. These visuals don't just serve as spectacle—they immerse the audience in the dream world, blurring the line between reality and imagination. Hans Zimmer’s score complements the visuals perfectly, amplifying the intensity and emotional impact of crucial scenes.Despite its complexity, Inception rewards repeated viewings. Each time, I discover new details and connections I missed before. The film encourages deep analysis, making it a timeless piece that continues to intrigue and inspire.In summary, Inception is a unique cinematic experience. Its innovative plot, brilliant performances, and breathtaking visuals ensure it remains a film I hold in high regard. Whether you love science fiction, thrillers, or simply great storytelling, Inception is a must-watch that will leave you pondering the nature of reality long after it ends.", productImage: img, userImage: img },
  { id: 3, name: "سارا رضایی", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },
  { id: 4, name: "لیلا موسوی", date: "1403/08/08", rating: 4, comment: "Inception is, without a doubt, one of my favourite movies of all time. Directed by Christopher Nolan, this film delivers a unique blend of mind-bending storytelling, impeccable performances, and stunning visuals that have left a lasting impression on me. From the moment I first watched it, I was captivated by its intricate plot and the way it challenges the audience to think deeply about the nature of reality and dreams.", productImage: img, userImage: img },
  { id: 5, name: "سارا رضایی", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },
  { id: 6, name: "سارا رضایی", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },
  { id: 7, name: "سارا رضایی", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },

  // سایر نظرات
];

const ITEMS_PER_PAGE = 4;
const COMMENT_MAX_LENGTH = 100;

const ReviewSection = () => {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate('/all-reviews');
  };

  const handleReadMore = (id) => {
    navigate(`/review/${id}`);
  };

  return (
    <div className="review-section">
      <h2>مشاهده نظرسنجی های اخیر</h2>
      <div className="review-grid">
        {reviews.slice(0, ITEMS_PER_PAGE).map(review => (
          <ReviewCard key={review.id} review={review} handleReadMore={handleReadMore} />
        ))}
      </div>
      {reviews.length > ITEMS_PER_PAGE && (
        <button className="view-more-button" onClick={handleViewMore}>مشاهده نظرات بیشتر</button>
      )}
    </div>
  );
};

const ReviewCard = ({ review, handleReadMore }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleDislike = () => {
    setDislikes(dislikes + 1);
  };

  return (
    <div className="review-card">
      <img src={review.userImage} alt={review.name} className="user-image" />
      <div className="review-info">
        <h4>{review.name}</h4>
        <p className="date">{review.date}</p>
        <div className="stars">
          {[...Array(5)].map((_, index) => (
            <span key={index} className={index < review.rating ? "star filled" : "star"}>★</span>
          ))}
        </div>
        <p className="comment">
          {review.comment.length > COMMENT_MAX_LENGTH
            ? `${review.comment.substring(0, COMMENT_MAX_LENGTH)}...`
            : review.comment}
        </p>
        {review.comment.length > COMMENT_MAX_LENGTH && (
          <button className="read-more-button" onClick={() => handleReadMore(review.id)}>مشاهده بیشتر</button>
        )}
        
      </div>
    </div>
  );
};

export default ReviewSection;
