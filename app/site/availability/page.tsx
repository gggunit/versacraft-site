import CalendarEmbed from '@/components/CalendarEmbed';

export default function AvailabilityPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold mb-4">Book a Session</h1>
        <p className="text-lg text-gray-600 mb-2">
          Select a time that works for you. All appointments sync with Google Calendar.
        </p>
        <p className="text-sm text-gray-500">
          Note: Google Calendar busy times are automatically honored to prevent double-booking.
        </p>
      </div>
      
      <CalendarEmbed />
    </main>
  );
}
