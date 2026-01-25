"use server";

import { Resend } from "resend";
import jwt from "jsonwebtoken";

// Initialize Resend with API Key (safely)
const resend = new Resend(process.env.RESEND_API_KEY); // Default mock key if missing
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_me"; // Should be in env

interface SendOfferParams {
    businessId: string; // Not strictly needed for email but good for record if we had DB
    businessName: string;
    businessEmail: string;
    offeredPrice: number;
    userEmail: string;
    userName: string;
    note: string;
}

export async function sendOffer(data: SendOfferParams) {
    try {
        console.log("Processing Offer:", data);
        console.log("Attempting to send email to:", data.businessEmail);

        // 1. Create a Secure Token containing the offer details
        // This token is "stateless state". It proves the offer details when the owner clicks the link.
        const tokenPayload = {
            ...data,
            timestamp: Date.now()
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' }); // Valid for 7 days

        // 2. Generate Accept/Refuse Links
        // NOTE: In production, change localhost:3000 to process.env.NEXT_PUBLIC_APP_URL
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const acceptLink = `${baseUrl}/api/offer/respond?token=${token}&action=accept`;
        const refuseLink = `${baseUrl}/api/offer/respond?token=${token}&action=refuse`;

        // 3. Send Email to Business Owner
        if (!process.env.RESEND_API_KEY) {
            console.log("⚠️ NO RESEND API KEY FOUND. MOCKING EMAIL SENDING.");
            console.log(`
            ---------------------------------------------------
            📧 TO: ${data.businessEmail}
            SUBJECT: New Offer from ${data.userName} for ${data.businessName}

            Body:
            Hello ${data.businessName},

            ${data.userName} has offered $${data.offeredPrice} for your service.

            Note: "${data.note}"

            [ACCEPT]: ${acceptLink}
            [REFUSE]: ${refuseLink}
            ---------------------------------------------------
            `);
            return { success: true, message: "Mock email sent (check console)" };
        }

        await resend.emails.send({
            from: 'Walaa Code Studio <onboarding@resend.dev>', // Verify domain in Resend dashboard
            to: data.businessEmail,
            subject: `New Offer: $${data.offeredPrice} from ${data.userName}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                    <h2>New Price Offer! 🎉</h2>
                    <p><strong>${data.userName}</strong> has sent you an offer for <strong>${data.businessName}</strong>.</p>
                    
                    <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin: 0; color: #333;">Offer: $${data.offeredPrice}</h3>
                        <p style="margin: 5px 0 0; color: #666;">"${data.note}"</p>
                    </div>

                    <div style="margin-top: 30px;">
                        <a href="${acceptLink}" style="background: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">Accept Offer</a>
                        <a href="${refuseLink}" style="background: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Decline</a>
                    </div>

                    <p style="margin-top: 20px; font-size: 12px; color: #999;">
                        Reply to this email to contact the user directly at <a href="mailto:${data.userEmail}">${data.userEmail}</a>.
                    </p>
                </div>
            `
        });

        return { success: true };

    } catch (error) {
        console.error("Failed to send offer email. Full error:", JSON.stringify(error, null, 2));
        console.error("Original error object:", error);
        return { success: false, error: "Failed to send email. Please try again." };
    }
}
