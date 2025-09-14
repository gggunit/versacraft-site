import CalendarEmbed from '@/components/CalendarEmbed';

export default function AvailabilityPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Book a Session</h1>
        <p className="text-xl text-gray-600 mb-4">
          Schedule your VersaCraft consultation with real-time availability.
        </p>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          Our booking system connects directly to Google Calendar to show only available time slots. 
          You'll receive instant confirmation and calendar invites for your appointment.
        </p>
      </div>
      
      <CalendarEmbed />
    </main>
  );
}
