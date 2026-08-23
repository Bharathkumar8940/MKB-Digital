import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { getOwnerSession } from '../../lib/auth';
import { EnquirySchema } from '../../lib/validations';
import { rateLimit } from '../../lib/ratelimit';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting (3 enquiries per hour per IP to block spam)
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'anonymous_client';
    const rateLimitRes = await rateLimit(`enquiry:${ip}`, 3, 3600);

    if (!rateLimitRes.success) {
      return NextResponse.json(
        { error: 'You have submitted multiple enquiries recently. Please try again later.' },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Body
    const body = await req.json();

    // Honeypot anti-spam check: If hidden website_url field is populated, silently return fake success
    if (body.website_url && body.website_url.trim() !== '') {
      console.warn(`Spam honeypot triggered from IP ${ip}`);
      return NextResponse.json({
        success: true,
        message: "Thanks! Your enquiry has been received. I'll get back to you soon.",
      });
    }

    const validation = EnquirySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid form input', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // 3. Save Enquiry to Database
    const enquiry = await prisma.enquiry.create({
      data: {
        name: data.name,
        businessName: data.businessName || null,
        email: data.email,
        phone: data.phone || null,
        serviceRequired: data.serviceRequired,
        budget: data.budget || null,
        message: data.message || '',
        status: 'NEW',
        ipAddress: String(ip),
      },
    });

    // 4. Trigger Email Notification to bharathkumarmatsa@gmail.com
    const notificationEmail = process.env.NOTIFICATION_EMAIL || 'bharathkumarmatsa@gmail.com';
    console.log(`[EMAIL DISPATCH] New Client Enquiry received!
From: ${data.name} (${data.email})
Business: ${data.businessName || 'N/A'} | Phone: ${data.phone || 'N/A'}
Service: ${data.serviceRequired} | Budget: ${data.budget || 'N/A'}
Message: ${data.message}
Target Notification Recipient: ${notificationEmail}`);

    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'MKB Digital Enquiries <enquiries@mkbdigital.com>',
            to: [notificationEmail],
            subject: `New Project Enquiry: ${data.serviceRequired} - ${data.name}`,
            html: `
              <h2>New Client Quote Request Received</h2>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Business:</strong> ${data.businessName || 'N/A'}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
              <p><strong>Service Requested:</strong> ${data.serviceRequired}</p>
              <p><strong>Budget:</strong> ${data.budget || 'N/A'}</p>
              <p><strong>Message:</strong></p>
              <blockquote style="background:#f4f4f4; padding:12px; border-left:4px solid #00ff88;">
                ${(data.message || '').replace(/\n/g, '<br/>')}
              </blockquote>
            `,
          }),
        });
      } catch (emailErr) {
        console.error('Failed to send Resend email notification:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thanks! Your enquiry has been received. I'll get back to you soon.",
      id: enquiry.id,
    });
  } catch (error) {
    console.error('Enquiry submission error:', error);
    return NextResponse.json({ error: 'Server error processing quote request' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // SECURITY RULE: Only owner can view enquiries
    const session = await getOwnerSession();
    if (!session || session.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized: Only the owner can access client enquiries' },
        { status: 401 }
      );
    }

    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
