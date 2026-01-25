import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key_change_me";
const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789");

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    const action = searchParams.get("action"); // 'accept' or 'refuse'

    if (!token || !action) {
        return NextResponse.json({ error: "Missing token or action" }, { status: 400 });
    }

    try {
        // 1. Verify Token
        const payload: any = jwt.verify(token, JWT_SECRET);

        // Payload contains: businessId, businessName, businessEmail, offeredPrice, userEmail, userName, note, timestamp

        const isAccepted = action === 'accept';
        const subject = isAccepted ? "Offer Accepted! 🎉" : "Offer Declined";
        const messageColor = isAccepted ? "#22c55e" : "#ef4444";
        const messageText = isAccepted
            ? `Good news! <strong>${payload.businessName}</strong> has accepted your offer of <strong>$${payload.offeredPrice}</strong>.`
            : `<strong>${payload.businessName}</strong> has declined your offer of $${payload.offeredPrice}.`;

        // 2. Send Email to User (Sender)
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: 'Home Service <onboarding@resend.dev>',
                to: payload.userEmail,
                subject: `${subject} - ${payload.businessName}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                        <h2 style="color: ${messageColor};">${subject}</h2>
                        <p>${messageText}</p>
                        <p style="margin-top: 20px;">
                            You can contact them directly at <a href="mailto:${payload.businessEmail}">${payload.businessEmail}</a>.
                        </p>
                    </div>
                `
            });
        } else {
            console.log(`Mock Email to ${payload.userEmail}: ${subject}`);
        }

        // 3. Return HTML Response to the Business Owner (who clicked the link)
        return new NextResponse(`
            <html>
                <head>
                    <title>Offer Response</title>
                    <style>
                        body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f9fafb; }
                        .card { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); text-align: center; }
                        h1 { color: ${messageColor}; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h1>${isAccepted ? "Offer Accepted!" : "Offer Declined"}</h1>
                        <p>You have successfully <strong>${action}ed</strong> the offer from ${payload.userName}.</p>
                        <p>A confirmation email has been sent to them.</p>
                        <a href="/" style="text-decoration: none; color: #666; margin-top: 20px; display: inline-block;">Return to Home</a>
                    </div>
                </body>
            </html>
        `, {
            headers: {
                "Content-Type": "text/html",
            },
        });

    } catch (error) {
        console.error("Token verification failed:", error);
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
}
