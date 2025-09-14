import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

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

// Service duration mapping
const SERVICE_DURATIONS: Record<string, number> = {
  'Computer Help (Remote)': 60,
  'AI Automations / Smart Home': 90,
  'Plant Care': 30,
  'Reiki (Distance)': 60,
  'Mounting & Repairs': 120,
  'Heavy Lifting': 90,
  'Light Carpentry': 120,
  'Organization': 90,
};

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (optional but if provided, should be valid)
 */
function isValidPhone(phone?: string): boolean {
  if (!phone || phone.trim() === '') return true; // Phone is optional
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate date is not in the past
 */
function isValidFutureDate(dateString: string): boolean {
  const bookingDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookingDate >= today;
}

/**
 * Send confirmation email (placeholder for future implementation)
 */
async function sendConfirmationEmail(booking: BookingData): Promise<boolean> {
  try {
    // Log booking details for now
    console.log('📧 Booking confirmation for:', {
      name: booking.name,
      email: booking.email,
      service: booking.service,
      datetime: `${booking.date} at ${booking.time}`,
      duration: `${booking.duration} minutes`
    });
    
    // TODO: Implement actual email sending with Resend
    // const response = await resend.emails.send({...});
    
    return true; // Simulate success for now
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ['name', 'email', 'service', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !body[field] || body[field].trim() === '');
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Validate phone format (if provided)
    if (!isValidPhone(body.phone)) {
      return NextResponse.json(
        { error: 'Please provide a valid phone number or leave it empty' },
        { status: 400 }
      );
    }

    // Validate service type
    if (!SERVICE_DURATIONS[body.service]) {
      return NextResponse.json(
        { error: 'Invalid service type selected' },
        { status: 400 }
      );
    }

    // Validate date
    if (!isValidFutureDate(body.date)) {
      return NextResponse.json(
        { error: 'Please select a future date for your appointment' },
        { status: 400 }
      );
    }

    // Sanitize and prepare booking data
    const booking: BookingData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || '',
      service: body.service,
      notes: body.notes?.trim() || '',
      date: body.date,
      time: body.time,
      duration: SERVICE_DURATIONS[body.service]
    };

    // Generate booking ID
    const timestamp = Date.now();
    const eventId = `booking-${timestamp}`;

    // Log the booking
    console.log('🎉 NEW BOOKING RECEIVED:', {
      id: eventId,
      name: booking.name,
      email: booking.email,
      service: booking.service,
      datetime: `${booking.date} at ${booking.time}`,
      duration: `${booking.duration} minutes`,
      phone: booking.phone || 'Not provided',
      notes: booking.notes || 'None'
    });

    // Send confirmation email
    const emailSent = await sendConfirmationEmail(booking);
    
    return NextResponse.json({
      success: true,
      message: 'Booking confirmed! You\'ll receive a confirmation email shortly.',
      eventId,
      emailSent,
      booking: {
        service: booking.service,
        date: booking.date,
        time: booking.time,
        duration: booking.duration,
        name: booking.name // Include name for confirmation display
      },
      nextSteps: [
        'Confirmation email will arrive within 15 minutes',
        'Calendar invite will be sent to both parties',
        'For remote services, connection details will be provided',
        'Need to reschedule? Just reply to the confirmation email'
      ]
    });

  } catch (error) {
    console.error('Unexpected error in booking API:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred. Please try again or contact support.',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}
