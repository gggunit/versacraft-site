import reviews from '../data/reviews.json';

export default function ReviewList() {
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {reviews.map((review, idx) => (
        <div
          key={idx}
          className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition-shadow"
        >
          <p className="font-semibold mb-1">{review.nameOrInitials}</p>
          <p className="text-xs text-gray-500 mb-2">
            {new Date(review.dateISO).toLocaleDateString()}
          </p>
          <p className="italic">&ldquo;{review.quote}&rdquo;</p>
        </div>
      ))}
    </div>
  );
}