import { NextResponse } from "next/server";
import { Resend } from "resend";
import { saveContactMessage } from "@/lib/firestore";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();
    console.log("Received contact form data:", { name, email, message });

    // Validate input
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Save to Firestore (existing functionality)
    try {
      console.log("Saving to Firestore...");
      await saveContactMessage({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      console.log("Successfully saved to Firestore");
    } catch (firestoreError) {
      console.error("Firestore error:", firestoreError);
      // Continue with email sending even if Firestore fails
    }

    // Send email using Resend
    try {
      console.log("Sending email via Resend...");
      console.log(
        "Using API key:",
        process.env.RESEND_API_KEY
          ? `Key found: ${process.env.RESEND_API_KEY.substring(0, 10)}...`
          : "API key missing"
      );
      console.log(
        "Resend instance:",
        resend ? "Created successfully" : "Failed to create"
      );

      const emailData = {
        from: "Contact Form <onboarding@resend.dev>",
        to: ["nipunsribw2003@gmail.com"], // Testing with your Resend signup email
        // to: ["dulanprabashwara@gmail.com"], // Will work after domain verification
        subject: `New Contact Form Message from ${name.trim()}`,
        replyTo: email.trim(),
        text: `New Contact Form Message

Name: ${name.trim()}
Email: ${email.trim()}
Message: ${message.trim()}

This message was sent from your chatbot website contact form on ${new Date().toLocaleString()}.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #16a34a; margin-bottom: 20px; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
                New Contact Form Message
              </h2>
              
              <div style="margin-bottom: 20px;">
                <strong style="color: #374151;">Name:</strong>
                <div style="background-color: #f3f4f6; padding: 10px; border-radius: 5px; margin-top: 5px;">
                  ${name.trim()}
                </div>
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong style="color: #374151;">Email:</strong>
                <div style="background-color: #f3f4f6; padding: 10px; border-radius: 5px; margin-top: 5px;">
                  <a href="mailto:${email.trim()}" style="color: #16a34a; text-decoration: none;">
                    ${email.trim()}
                  </a>
                </div>
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong style="color: #374151;">Message:</strong>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin-top: 5px; line-height: 1.6;">
                  ${message.trim().replace(/\n/g, "<br>")}
                </div>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  This message was sent from your chatbot website contact form on ${new Date().toLocaleString()}.
                </p>
              </div>
            </div>
          </div>
        `,
      };

      console.log("Email data to send:", JSON.stringify(emailData, null, 2));

      const emailResult = await resend.emails.send(emailData);

      console.log(
        "Email sent successfully! Full response:",
        JSON.stringify(emailResult, null, 2)
      );
    } catch (emailError) {
      console.error("Email sending error - Full details:", emailError);
      console.error("Email error message:", emailError.message);
      console.error("Email error stack:", emailError.stack);
      throw new Error("Failed to send email: " + emailError.message);
    }

    return NextResponse.json(
      { message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in contact API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
