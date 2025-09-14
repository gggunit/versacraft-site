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
 * Send confirmation email using Resend API
 */
async function sendConfirmationEmail(booking: BookingData, eventId?: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VersaCraft <bookings@versacraft.com>',
        to: [booking.email],
        bcc: [process.env.BUSINESS_EMAIL || 'german.gladkov@gmail.com'],
        subject: `Booking Confirmed: ${booking.service} on ${new Date(booking.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">VersaCraft</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your appointment is confirmed!</p>
            </div>
            
            <div style="padding: 30px;">
              <div style="background: #f8fafc; border-left: 4px solid #059669; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h2 style="color: #059669; margin: 0 0 15px 0; font-size: 20px;">✅ Booking Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151;">Service:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${booking.service}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151;">Date:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${new Date(booking.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151;">Time:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${booking.time} PST</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151;">Duration:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${booking.duration} minutes</td>
                  </tr>
                  ${booking.notes ? `
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #374151; vertical-align: top;">Notes:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${booking.notes}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">📋 What happens next?</h3>
                <ul style="color: #92400e; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">You'll receive a Google Calendar invite within the next few minutes</li>
                  <li style="margin-bottom: 8px;">For remote services, connection details will be included in the calendar invite</li>
                  <li style="margin-bottom: 8px;">German will reach out if any preparation is needed before the session</li>
                  <li style="margin-bottom: 0;">Need to reschedule? Simply reply to this email</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #1f2937; font-size: 16px; margin-bottom: 20px;">Thank you for choosing VersaCraft!</p>
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  Professional tech support, AI automations, and personal services<br>
                  when you need them most.
                </p>
              </div>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                This is an automated confirmation from VersaCraft.<br>
                Questions? Just reply to this email - we're here to help!
              </p>
            </div>
          </div>
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Resend API error:', response.status, errorData);
      return false;
    }

    const result = await response.json();
    console.log('✅ Email sent successfully:', result.id);
    return true;
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
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

    // Log the booking for German to see
    console.log('🎉 NEW BOOKING RECEIVED:', {
      name: booking.name,
      email: booking.email,
      service: booking.service,
      datetime: `${booking.date} at ${booking.time}`,
      duration: `${booking.duration} minutes`,
      phone: booking.phone || 'Not provided',
      notes: booking.notes || 'None'
    });

    // Send confirmation email using Resend
    const emailSent = await sendConfirmationEmail(booking);
    
    if (!emailSent) {
      console.warn('⚠️ Email sending failed, but booking was recorded');
    }

    // TODO: Create actual Google Calendar event
    // This requires OAuth setup, for now we'll just log it
    const eventId = `versacraft-${Date.now()}`;
    console.log('📅 Calendar event would be created:', {
      summary: `VersaCraft: ${booking.service} - ${booking.name}`,
      start: `${booking.date}T${convertTimeToISO(booking.time)}`,
      duration: `${booking.duration} minutes`,
      attendees: [booking.email, process.env.BUSINESS_EMAIL]
    });
    
    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
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
    console.error('❌ Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
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
