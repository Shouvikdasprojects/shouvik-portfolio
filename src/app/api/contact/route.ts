import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ 
        success: false, 
        error: "Please fill in all fields (name, email, message)." 
      }, { status: 400 });
    }

    console.log(`✉️ Contact Form Submission:
    Name: ${name}
    Email: ${email}
    Message: ${message}`);

    const recipientEmail = "shouvikdaswork@gmail.com";

    // -------------------------------------------------------------------------
    // NODEMAILER SMTP PIPELINE (Direct Gmail dispatch)
    // -------------------------------------------------------------------------
    const smtpHost = process.env.SMTP_HOST; // e.g. smtp.gmail.com
    const smtpPort = process.env.SMTP_PORT; // e.g. 587
    const smtpUser = process.env.SMTP_USER; // e.g. shouvikdaswork@gmail.com
    const smtpPass = process.env.SMTP_PASSWORD; // App Password (e.g. 16-character google app password)

    const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT_URL; // e.g. https://formspree.io/f/xyza123
    const resendApiKey = process.env.RESEND_API_KEY;

    const isSmtpConfigured = smtpHost && smtpUser && smtpPass && smtpPass !== 'xxxx_xxxx_xxxx_xxxx';
    const isFormspreeConfigured = formspreeEndpoint && !formspreeEndpoint.includes("your_form_id_here");
    const isResendConfigured = resendApiKey && !resendApiKey.includes("your_resend_api_key_here");

    if (isSmtpConfigured) {
      // Create SMTP transporter
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || "587"),
        secure: smtpPort === "465", // true for 465, false for 587/other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // Dispatch mail
      await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: recipientEmail,
        replyTo: email,
        subject: `💼 Portfolio Contact Form: Message from ${name}`,
        text: `You received a new message from your portfolio contact form:
        
Name: ${name}
Email: ${email}
Message: ${message}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 600px; background-color: #0c0a18; color: #fff;">
            <h2 style="color: #ff007f; margin-bottom: 20px; font-weight: 900; border-bottom: 1px solid #221c38; padding-bottom: 10px;">💼 New Portfolio Inquiry</h2>
            <p style="margin: 8px 0;"><strong style="color: #ff007f;">Name:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong style="color: #ff007f;">Email:</strong> <a href="mailto:${email}" style="color: #8b5cf6; text-decoration: none;">${email}</a></p>
            <hr style="border: 0; border-top: 1px solid #221c38; margin: 20px 0;" />
            <p><strong style="color: #ff007f;">Message:</strong></p>
            <p style="white-space: pre-wrap; background: #161226; padding: 15px; border-radius: 6px; color: #e2e8f0; line-height: 1.6; border: 1px solid #261f42;">${message}</p>
          </div>
        `,
      });

      console.log("🚀 Email sent successfully via Nodemailer!");
    } else if (isFormspreeConfigured) {
      // Forward directly to Formspree for immediate free Gmail delivery!
      const forwardResponse = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name,
          _replyto: email,
          message,
          _subject: `Portfolio Contact from ${name}`
        }),
      });

      if (!forwardResponse.ok) {
        throw new Error("Failed to forward payload to Formspree carrier.");
      }
      
      console.log("🚀 Form submitted successfully to Formspree pipeline!");
    } else if (isResendConfigured) {
      // Direct Resend API email dispatch
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: recipientEmail,
          subject: `💼 Portfolio Contact Form Submission from ${name}`,
          html: `<p>You received a new message from your portfolio contact form:</p>
                 <p><strong>Name:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Message:</strong> ${message}</p>`
        }),
      });

      if (!emailResponse.ok) {
        throw new Error("Failed to send email via Resend API.");
      }
      
      console.log("🚀 Email sent successfully via Resend API!");
    } else {
      console.log(`✉️ Local Offline Form Submission:
      Name: ${name}
      Email: ${email}
      Message: ${message}`);
      console.warn("⚠️ Nodemailer SMTP, Formspree Endpoint, or Resend Key is not configured! Submission logged in server console. To enable direct Gmail delivery, check walkthrough.md!");
    }

    return NextResponse.json({ 
      success: true, 
      message: "Your message has been processed successfully! Shouvik will get back to you soon." 
    });

  } catch (error: any) {
    console.error("Error processing contact submission inside API route:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Message submission failed. Please try again.",
      details: error.message 
    }, { status: 500 });
  }
}
