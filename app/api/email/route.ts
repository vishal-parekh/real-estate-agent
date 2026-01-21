import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { InterestedCustomerEmail } from '../../templates/InterestedCustomerEmail';
import { ContactForm } from '../../../types/form';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        // Block non-US IPs
        const country = request.headers.get('x-vercel-ip-country');
        // Note: On localhost, country will be null. We allow null for dev, but enforce 'US' if present.
        // Or strictly enforce US if that's the requirement. 
        // The requirement says "Blocks non-US IP addresses". 
        // Usually local dev doesn't have this header, so it would break local testing if we strictly require 'US'.
        // However, I should strictly follow "Blocks non-US IP addresses".
        // If country is present AND it is NOT 'US', we block. 
        if (country && country !== 'US') {
            return NextResponse.json(
                { error: 'Access denied. US IP addresses only.' },
                { status: 403 }
            );
        }

        const body: ContactForm = await request.json();
        const { name, email, propertyAddress } = body;

        // Validate fields
        if (!name || !email || !propertyAddress) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is not defined');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        if (!process.env.EMAIL_RECIPIENT) {
            console.error('EMAIL_RECIPIENT is not defined');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const { data, error } = await resend.emails.send({
            from: 'Real Estate Agent Intake <onboarding@resend.dev>',
            to: [process.env.EMAIL_RECIPIENT],
            subject: `New Interest in ${propertyAddress}`,
            replyTo: email,
            react: InterestedCustomerEmail({ name, email, propertyAddress }),
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
