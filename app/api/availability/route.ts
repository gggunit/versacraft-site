import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Business hours configuration
const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 18,  // 6 PM
  timezone: 'America/Los_Angeles'
};

const WORKING_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday (0 = Sunday)

interface CalendarEvent {
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

interface TimeSlot {
  time: string;
  available: boolean;
  datetime: string;
}

/**
 * Generate available time slots for a given date
 */
function generateTimeSlots(date: string, busyTimes: CalendarEvent[] = []): TimeSlot[] {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Validate date format
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Don't allow booking in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return NextResponse.json(
        { error: 'Cannot book appointments in the past' },
        { status: 400 }
      );
    }

    // Prepare time range for Google Calendar API
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    let busyTimes: CalendarEvent[] = [];

    try {
      // Call Google Calendar API server-side to keep API key secure
      const calendarResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        `key=${process.env.GOOGLE_API_KEY}&` +
        `timeMin=${startOfDay.toISOString()}&` +
        `timeMax=${endOfDay.toISOString()}&` +
        `singleEvents=true&` +
        `orderBy=startTime`
      );

      if (calendarResponse.ok) {
        const calendarData = await calendarResponse.json();
        
        // Convert Google Calendar events to our format
        busyTimes = (calendarData.items || [])
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

        console.log(`✅ Found ${busyTimes.length} busy time(s) for ${date} from Google Calendar`);
      } else {
        console.warn('⚠️ Google Calendar API error, using basic availability');
      }
    } catch (error) {
      console.error('❌ Error calling Google Calendar API:', error);
      // Continue with empty busyTimes array - will show all slots as available
    }

    // Generate time slots based on busy times
    const timeSlots = generateTimeSlots(date, busyTimes);

    return NextResponse.json({
      success: true,
      date,
      slots: timeSlots,
      busyEventsFound: busyTimes.length
    });

  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}
