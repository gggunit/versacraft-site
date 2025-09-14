// Force deploy trigger
import ReviewList from '@/components/ReviewList';

export const metadata = {
  title: 'Reviews — VersaCraft',
};

export default function ReviewsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Reviews</h1>
      <p className="text-gray-600">4.9★ · 628 reviews (summary)</p>
      <ReviewList />
    </main>
  );
}
