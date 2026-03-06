import { Star } from "lucide-react";

type RatingStarsProps = {
  value: number;
  size?: number;
};

export function RatingStars({ value, size = 16 }: RatingStarsProps) {
  const fullStars = Math.round(value);

  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, idx) => (
        <Star key={idx} size={size} className={idx < fullStars ? "fill-[#f5b942] text-[#f5b942]" : "text-[#d1c8b8]"} />
      ))}
    </div>
  );
}
