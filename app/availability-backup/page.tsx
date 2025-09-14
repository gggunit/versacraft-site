// Remove the import for now to test if that's the issue
// import CalendarEmbed from '@/components/CalendarEmbed';

export default function AvailabilityPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Book a Session - Working!</h1>
        <p className="text-xl text-gray-600 mb-4">
          Schedule your VersaCraft consultation with real-time availability.
        </p>
        <div className="p-4 bg-green-100 rounded-lg">
          <p>✅ This page is now loading successfully!</p>
          <p>The issue was likely with component imports or compilation.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Choose Date (Test)</label>
          <input
            type="date"
            className="w-full p-3 border rounded-lg"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'].map((time) => (
            <button
              key={time}
              className="p-2 border rounded-lg hover:bg-gray-50"
            >
              {time}
            </button>
          ))}
        </div>
      </div>
      
      {/* <CalendarEmbed /> */}
    </main>
  );
}
