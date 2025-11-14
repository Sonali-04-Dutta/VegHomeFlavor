import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

export const StarRating = ({ initialRating = 0, onRate }) => {
  const [rating, setRating] = useState(initialRating);

  const handleClick = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  return (
    <div style={{ display: "flex", gap: "5px", cursor: "pointer" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={22}
          color={star <= rating ? "#FF8A00" : "#ccc"}
          onClick={() => handleClick(star)}
        />
      ))}
    </div>
  );
};

// export default StarRating;
