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

/**
 * Send confirmation email (simplified for now)
 */
async function sendConfirmationEmail(booking: BookingData): Promise<boolean> {
  try {
    // For now, just log the booking
    // Resend integration can be added once domain is verified
    console.log('📧 Would send confirmation email to:', booking.email);
    console.log('Booking details:', booking);
    
    // Return true to indicate success (for demo)
    return true;
  } catch (error) {
    console.error('Error with email:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'service', 'date', 'time'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate date is not in the past
    const bookingDate = new Date(body.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return NextResponse.json(
        { error: 'Cannot book appointments in the past' },
        { status: 400 }
      );
    }

    // Set default duration based on service type
    const serviceDurations: Record<string, number> = {
      'Computer Help (Remote)': 60,
      'AI Automations / Smart Home': 90,
      'Plant Care': 30,
      'Reiki (Distance)': 60,
      'Mounting & Repairs': 120,
      'Heavy Lifting': 90
    };

    const booking: BookingData = {
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      service: body.service,
      notes: body.notes || '',
      date: body.date,
      time: body.time,
      duration: serviceDurations[body.service] || 60
    };

    // Log the booking
    console.log('🎉 NEW BOOKING RECEIVED:', {
      name: booking.name,
      email: booking.email,
      service: booking.service,
      datetime: `${booking.date} at ${booking.time}`,
      duration: `${booking.duration} minutes`,
      phone: booking.phone || 'Not provided',
      notes: booking.notes || 'None'
    });

    // Send confirmation (simplified for now)
    const emailSent = await sendConfirmationEmail(booking);
    
    // Generate a simple booking ID
    const eventId = `booking-${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      message: 'Booking received! German will confirm your appointment shortly.',
      eventId,
      emailSent,
      booking: {
        service: booking.service,
        date: booking.date,
        time: booking.time,
        duration: booking.duration
      }
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}