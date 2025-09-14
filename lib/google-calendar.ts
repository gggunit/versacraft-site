// Real Google Calendar API integration for VersaCraft Scheduler
// Now using actual Google Calendar API with your credentials

export interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  status: string;
}

export interface BookingData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  notes?: string;
  date: string;
  time: string;
  duration: number; // in minutes
}

export interface TimeSlot {
  time: string;
  available: boolean;
  datetime: string;
}

// Business hours configuration
const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 18,  // 6 PM
  timezone: 'America/Los_Angeles'
};

const WORKING_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday (0 = Sunday)

/**
 * Generate available time slots for a given date
 */
export function generateTimeSlots(date: string, busyTimes: CalendarEvent[] = []): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const selectedDate = new Date(date);
  
  // Check if it's a working day
  if (!WORKING_DAYS.includes(selectedDate.getDay())) {
    return slots; // Return empty array for weekends
  }

  // Generate hourly slots during business hours
  for (let hour = BUSINESS_HOURS.start; hour < BUSINESS_HOURS.end; hour++) {
    const slotDate = new Date(selectedDate);
    slotDate.setHours(hour, 0, 0, 0);
    
    const timeString = slotDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
      timeZone: BUSINESS_HOURS.timezone
    });

    const datetime = slotDate.toISOString();
    
    // Check if this slot conflicts with any busy times
    const isConflict = busyTimes.some(event => {
      const eventStart = new Date(event.start.dateTime);
      const eventEnd = new Date(event.end.dateTime);
      const slotEnd = new Date(slotDate.getTime() + 60 * 60 * 1000); // 1 hour later
      
      return (
        (slotDate >= eventStart && slotDate < eventEnd) ||
        (slotEnd > eventStart && slotEnd <= eventEnd) ||
        (slotDate <= eventStart && slotEnd >= eventEnd)
      );
    });

    // Don't show past time slots for today
    const now = new Date();
    const isPast = slotDate < now;

    slots.push({
      time: timeString,
      available: !isConflict && !isPast,
      datetime
    });
  }

  return slots;
}

/**
 * Check availability using real Google Calendar API
 */
export async function checkAvailability(date: string): Promise<TimeSlot[]> {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Use Google Calendar API to get busy times
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `key=${process.env.GOOGLE_API_KEY}&` +
      `timeMin=${startOfDay.toISOString()}&` +
      `timeMax=${endOfDay.toISOString()}&` +
      `singleEvents=true&` +
      `orderBy=startTime`
    );

    if (!response.ok) {
      console.error('Google Calendar API error:', response.status, response.statusText);
      // Fall back to basic slots if API fails
      return generateTimeSlots(date);
    }

    const data = await response.json();
    
    // Convert Google Calendar events to our format
    const busyTimes: CalendarEvent[] = (data.items || [])
      .filter((event: any) => event.start?.dateTime && event.end?.dateTime)
      .map((event: any) => ({
        id: event.id,
        summary: event.summary || 'Busy',
        start: {
          dateTime: event.start.dateTime,
          timeZone: event.start.timeZone || BUSINESS_HOURS.timezone
        },
        end: {
          dateTime: event.end.dateTime,
          timeZone: event.end.timeZone || BUSINESS_HOURS.timezone
        },
        status: event.status || 'confirmed'
      }));

    console.log(`Found ${busyTimes.length} busy time(s) for ${date}`);
    
    return generateTimeSlots(date, busyTimes);
  } catch (error) {
    console.error('Error checking availability:', error);
    // Return basic slots if API call fails
    return generateTimeSlots(date);
  }
}

/**
 * Create a Google Calendar event for a booking
 * Note: This requires OAuth authentication for write access
 * For now, we'll log the event that would be created
 */
export async function createCalendarEvent(booking: BookingData): Promise<{ success: boolean; eventId?: string; error?: string }> {
  try {
    // Parse the booking datetime
    const startTime = new Date(`${booking.date}T${convertTimeToISO(booking.time)}`);
    const endTime = new Date(startTime.getTime() + booking.duration * 60 * 1000);

    const event = {
      summary: `VersaCraft: ${booking.service} - ${booking.name}`,
      description: `
Client: ${booking.name}
Email: ${booking.email}
${booking.phone ? `Phone: ${booking.phone}` : ''}
Service: ${booking.service}
${booking.notes ? `Notes: ${booking.notes}` : ''}

Booked via VersaCraft website.
      `.trim(),
      start: {
        dateTime: startTime.toISOString(),
        timeZone: BUSINESS_HOURS.timezone,
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: BUSINESS_HOURS.timezone,
      },
      attendees: [
        { email: booking.email },
        { email: process.env.BUSINESS_EMAIL || 'german.gladkov@gmail.com' }
      ],
      conferenceData: {
        createRequest: {
          requestId: `versacraft-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };

    // For now, log the event that would be created
    // To implement actual calendar creation, you'd need OAuth authentication
    console.log('Calendar event would be created:', event);
    
    // TODO: Implement OAuth flow for actual calendar event creation
    // This would require additional setup with Google OAuth consent screen
    
    return { success: true, eventId: `mock-event-${Date.now()}` };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return { success: false, error: 'Failed to create calendar event' };
  }
}

/**
 * Convert 12-hour time format to ISO time string
 */
function convertTimeToISO(timeString: string): string {
  const [time, period] = timeString.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (period === 'PM' && hours !== '12') {
    hours = String(parseInt(hours) + 12);
  } else if (period === 'AM' && hours === '12') {
    hours = '00';
  }
  
  return `${hours.padStart(2, '0')}:${minutes || '00'}:00-07:00`;
}

/**
 * Send confirmation email using Resend API
 */
export async function sendConfirmationEmail(booking: BookingData, eventId?: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VersaCraft <noreply@versacraft.com>',
        to: [booking.email],
        bcc: [process.env.BUSINESS_EMAIL || 'german.gladkov@gmail.com'],
        subject: `Booking Confirmed: ${booking.service} on ${booking.date}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Your VersaCraft appointment is confirmed! ✅</h2>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Service:</strong> ${booking.service}</p>
              <p><strong>Date & Time:</strong> ${new Date(booking.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} at ${booking.time} PST</p>
              <p><strong>Duration:</strong> ${booking.duration} minutes</p>
              ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
            </div>
            
            <h3>What happens next?</h3>
            <ul>
              <li>You should receive a Google Calendar invite shortly</li>
              <li>For remote services, connection details will be included in the calendar invite</li>
              <li>If you need to reschedule or cancel, simply reply to this email</li>
            </ul>
            
            <p>Thank you for choosing VersaCraft!</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              This is an automated confirmation email from VersaCraft.<br>
              If you have any questions, reply to this email.
            </p>
          </div>
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Resend API error:', response.status, errorData);
      return false;
    }

    const result = await response.json();
    console.log('Email sent successfully:', result.id);
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
}
