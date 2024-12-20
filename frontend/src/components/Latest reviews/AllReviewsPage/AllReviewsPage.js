import React, { useState, useEffect } from 'react';
import './AllReviewsPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import img from './noon.png';
// const reviews = [
//   { id: 2, name: "محمد احمدی", date: "1403/08/08", rating: 3, comment: " Inception is undoubtedly one of my all-time favorite films. Directed by Christopher Nolan, it offers a remarkable fusion of mind-bending storytelling, outstanding performances, and visually stunning scenes that have left a lasting impression on me. From the very first viewing, I was captivated by its intricate plot and the way it compels the audience to reflect on the nature of reality and dreams.The performances are equally impressive. Leonardo DiCaprio shines as Dom Cobb, a man haunted by his past while navigating the dangerous realm of dream-sharing. The supporting cast—Joseph Gordon-Levitt, Ellen Page, and Tom Hardy—deliver authentic portrayals that draw you into their emotional journeys. Their chemistry adds a level of authenticity that makes the characters' relationships feel real.Visually, Inception is nothing short of a masterpiece. The special effects, especially the folding cityscape and zero-gravity fight scene, are groundbreaking and essential to the film. These visuals don't just serve as spectacle—they immerse the audience in the dream world, blurring the line between reality and imagination. Hans Zimmer’s score complements the visuals perfectly, amplifying the intensity and emotional impact of crucial scenes.Despite its complexity, Inception rewards repeated viewings. Each time, I discover new details and connections I missed before. The film encourages deep analysis, making it a timeless piece that continues to intrigue and inspire.In summary, Inception is a unique cinematic experience. Its innovative plot, brilliant performances, and breathtaking visuals ensure it remains a film I hold in high regard. Whether you love science fiction, thrillers, or simply great storytelling, Inception is a must-watch that will leave you pondering the nature of reality long after it ends.", productImage: img, userImage: img },
//   { id: 3, name: "سارا رضایی", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },
//   { id: 4, name: "احمد موسوی", date: "1403/08/08", rating: 4, comment: "Inception is, without a doubt, one of my favourite movies of all time. Directed by Christopher Nolan, this film delivers a unique blend of mind-bending storytelling, impeccable performances, and stunning visuals that have left a lasting impression on me. From the moment I first watched it, I was captivated by its intricate plot and the way it challenges the audience to think deeply about the nature of reality and dreams.", productImage: img, userImage: img },
//   { id: 5, name: "کاوه رضایی", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },
//   { id: 6, name: "رضا رضایی", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },
//   { id: 7, name: "آرام جعفری", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },

//   // سایر نظرات
// ];


const AllReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:8000/review_rating/reviews/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        console.log(data);
      const enrichedReviews = await Promise.all(
          data.map(async (review) => {
            console.log(review.user);

            const userResponse = await axios.get(`http://localhost:8000/user_management/users/${review.user}/`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            return {
              ...review,
              name: userResponse.data.username,
              userImage: userResponse.data.profile_picture || img,
              
            };
          })
        );
        setReviews(enrichedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="review-section1">
      <h2>همه نظرات</h2>
      <div className="review-grid1">
        {reviews.map(review => (
          <div key={review.id} className="review-card1">
            <img src={review.userImage} alt={review.name} className="user-image1" />
            <div className="review-info1">
              <h4>{review.name}</h4>
              <p className="date">{review.created_at}</p>
              <div className="stars">
                {[...Array(5)].map((_, index) => (
                  <span key={index} className={index < review.rank ? "star filled" : "star"}>★</span>
                ))}
              </div>
              <p className="comment">{review.review_text}</p>
              <LikeDislikeButtons />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LikeDislikeButtons = () => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  return (
    <div className="like-dislike-buttons">
      <button onClick={() => setLikes(likes + 1)} className="like-button">
        👍 {likes}
      </button>
      <button onClick={() => setDislikes(dislikes + 1)} className="dislike-button">
        👎 {dislikes}
      </button>
    </div>
  );
};

export default AllReviewsPage;
