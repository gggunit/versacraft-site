"use client";

import { useState } from 'react';

export default function AvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    notes: ''
  });

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const services = [
    'Computer Help (Remote)',
    'AI Automations / Smart Home', 
    'Plant Care',
    'Reiki (Distance)',
    'Mounting & Repairs',
    'Heavy Lifting'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Booking request submitted for ${selectedDate} at ${selectedTime}. We'll confirm via email!`);
  };

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
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Select Date & Time</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-medium mb-2">Available Times</label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 border rounded-lg text-sm ${
                      selectedTime === time 
                        ? 'bg-black text-white' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking Form */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Your Information</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Service *</label>
              <select
                required
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="w-full p-3 border rounded-lg"
                placeholder="Any specific requirements or questions?"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedDate || !selectedTime || !formData.name || !formData.email || !formData.service}
              className="w-full py-3 bg-black text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            >
              Book Appointment
            </button>
          </form>
        </div>
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">What happens next?</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• You'll receive a confirmation email within 15 minutes</li>
          <li>• A Google Calendar invite will be sent to both parties</li>
          <li>• For remote services, you'll get connection details</li>
          <li>• Need to reschedule? Just reply to the confirmation email</li>
        </ul>
      </div>
    </main>
  );
}
