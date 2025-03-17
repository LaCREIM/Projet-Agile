import { FaCircle } from "react-icons/fa";

interface PositionementProps {
  rating: number;
  setRating: (value: number) => void;
  hover: number;
  setHover: (value: number) => void;
}

const Positionement = ({
  rating,
  setRating,
  hover,
  setHover,
}: PositionementProps) => {
  return (
    <div className="flex flex-row gap-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              className="hidden"
              value={`${ratingValue}`}
              onClick={() => setRating(ratingValue)}
            />
            <FaCircle
              size={19}
              className="hover:cursor-pointer"
              color={ratingValue <= (hover || rating) ? "#000000" : "#e4e5e9"}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default Positionement;
