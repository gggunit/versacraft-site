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

interface TimeSlot {
  time: string;
  available: boolean;
  datetime: string;
}

/**
 * Generate available time slots for a given date
 */
function generateTimeSlots(date: string): TimeSlot[] {
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
    
    // Don't show past time slots for today
    const now = new Date();
    const isPast = slotDate < now;
    
    // For now, mark some slots as busy for demo purposes
    // In production, this would check your actual Google Calendar
    const isDemoBlocked = hour === 10 || hour === 14; // Block 10 AM and 2 PM for demo

    slots.push({
      time: timeString,
      available: !isPast && !isDemoBlocked,
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

    // Generate time slots (temporarily without Google Calendar integration)
    const timeSlots = generateTimeSlots(date);
    
    // Note: Google Calendar integration temporarily disabled
    // Will be re-enabled once OAuth is properly configured
    console.log('📅 Returning availability for:', date);
    console.log('⚠️ Note: Using demo availability (Google Calendar integration pending OAuth setup)');

    return NextResponse.json({
      success: true,
      date,
      slots: timeSlots,
      busyEventsFound: 0,
      note: 'Currently showing demo availability. Google Calendar integration coming soon!'
    });

  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}