'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface TimeSlot {
  time: string;
  available: boolean;
  datetime: string;
}

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  service: string;
  notes: string;
}

export default function CalendarEmbed() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<BookingForm>({
    name: '',
    email: '',
    phone: '',
    service: '',
    notes: ''
  });

  const services = [
    'Computer Help (Remote)',
    'AI Automations / Smart Home', 
    'Plant Care',
    'Reiki (Distance)',
    'Mounting & Repairs',
    'Heavy Lifting'
  ];

  // Load available time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      loadAvailability(selectedDate);
    } else {
      setTimeSlots([]);
      setSelectedTime('');
    }
  }, [selectedDate]);

  const loadAvailability = async (date: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/availability?date=${date}`);
      const data = await response.json();
      
      if (data.success) {
        setTimeSlots(data.slots);
        console.log(`Loaded ${data.slots.length} time slots, found ${data.busyEventsFound} busy events`);
      } else {
        setError(data.error || 'Failed to load availability');
        setTimeSlots([]);
      }
    } catch (err) {
      setError('Failed to connect to booking system');
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const bookingData = {
        ...formData,
        date: selectedDate,
        time: selectedTime
      };

      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Reset form
        setFormData({ name: '', email: '', phone: '', service: '', notes: '' });
        setSelectedDate('');
        setSelectedTime('');
        setTimeSlots([]);
      } else {
        setError(data.error || 'Failed to create booking');
      }
    } catch (err) {
      setError('Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Get maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Booking Confirmed! 🎉
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Your appointment has been successfully scheduled. You'll receive a confirmation email shortly with all the details.
        </p>
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-4">What happens next?</h3>
          <ul className="text-left space-y-2 text-gray-600">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              You'll receive a confirmation email within 15 minutes
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              A Google Calendar invite will be sent to both parties
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              For remote services, you'll get connection details
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              Need to reschedule? Just reply to the confirmation email
            </li>
          </ul>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div className="space-y-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 mr-2" />
            <h3 className="text-xl font-semibold">Select Date & Time</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Choose Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={today}
                max={maxDateString}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Available Monday - Friday, 9 AM - 6 PM PST
              </p>
            </div>

            {selectedDate && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Available Times {loading && <Loader2 className="inline w-4 h-4 animate-spin ml-1" />}
                </label>
                
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Checking your Google Calendar...
                  </div>
                ) : timeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available ? setSelectedTime(slot.time) : null}
                        disabled={!slot.available}
                        className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                          selectedTime === slot.time 
                            ? 'bg-black text-white border-black' 
                            : slot.available 
                            ? 'bg-white hover:bg-gray-50 border-gray-300 text-gray-900'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {slot.time}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No available times for this date
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <div className="space-y-6">
          <div className="flex items-center mb-4">
            <User className="w-6 h-6 mr-2" />
            <h3 className="text-xl font-semibold">Your Information</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Service Type *
              </label>
              <select
                required
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Any specific requirements or questions?"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedDate || !selectedTime || !formData.name || !formData.email || !formData.service || submitting}
              className="w-full py-3 bg-black text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating Booking...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirm Booking
                </>
              )}
            </button>
          </form>

          {selectedDate && selectedTime && formData.service && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Booking Summary</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Service:</strong> {formData.service}</p>
                <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Time:</strong> {selectedTime} PST</p>
                <p><strong>Duration:</strong> {formData.service === 'Plant Care' ? '30' : formData.service === 'AI Automations / Smart Home' ? '90' : formData.service === 'Mounting & Repairs' ? '120' : formData.service === 'Heavy Lifting' ? '90' : '60'} minutes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
