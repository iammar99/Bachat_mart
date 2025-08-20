import React from 'react';

export const StarRating = ({ rating, numReviews }) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
        <div className="star-rating">
            {[...Array(fullStars)].map((_, index) => (
                <i key={index} className="fa fa-star" style={{ color: 'gold' }}></i>
            ))}
            {halfStars > 0 && <i className="fa fa-star-half-alt" style={{ color: 'gold' }}></i>}
            {[...Array(emptyStars)].map((_, index) => (
                <i key={index} className="fa fa-star-o" style={{ color: 'gold' }}></i>
            ))}
            <span> ({numReviews} Reviews)</span>
        </div>
    );
}