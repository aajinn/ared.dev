import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getAllContent } from "@/lib/data";

export async function POST(request: NextRequest) {
  const { email, message } = await request.json();

  if (!email || !message) {
    return NextResponse.json(
      { error: "Email and message are required" },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return NextResponse.json(
      { error: "Contact form is not configured" },
      { status: 500 }
    );
  }

  try {
    const content = await getAllContent();
    const toEmail = content.email.to;
    const subject = content.email.subject.replace("%email%", email);

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort) || 587,
      secure: Number(smtpPort) === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: smtpUser,
      to: toEmail,
      subject,
      text: `From: ${email}\n\n${message}`,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Failed to send email:", e);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
