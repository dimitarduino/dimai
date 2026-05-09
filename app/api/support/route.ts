// import { NextResponse } from "next/server";
// import nodemailer from "nodemailer";

// export async function POST(request) {
//   try {
//     const { name, email, message } = await request.json();

//     if (!name || !email || !message) {
//       return NextResponse.json(
//         { error: "Missing required fields." },
//         { status: 400 }
//       );
//     }

//     if (
//       !process.env.SMTP_HOST ||
//       !process.env.SMTP_PORT ||
//       !process.env.SMTP_USER ||
//       !process.env.SMTP_PASS
//     ) {
//       console.error("SMTP configuration is missing in environment variables.");
//       return NextResponse.json(
//         {
//           error:
//             "Email service is not configured. Please contact us directly at info@dimnai.com.",
//         },
//         { status: 500 }
//       );
//     }

//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: Number(process.env.SMTP_PORT),
//       secure: Number(process.env.SMTP_PORT) === 465,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     const html = `
//       <h2>New Support Request</h2>
//       <p><strong>Name:</strong> ${name}</p>
//       <p><strong>Email:</strong> ${email}</p>
//       <p><strong>Message:</strong></p>
//       <p>${message.replace(/\n/g, "<br />")}</p>
//     `;

//     await transporter.sendMail({
//       from: `"Dimn AI Support" <${process.env.SMTP_USER}>`,
//       to: "info@dimnai.com",
//       replyTo: email,
//       subject: "New Support Request from Dimn AI",
//       text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
//       html,
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error sending support email:", error);
//     return NextResponse.json(
//       { error: "Failed to send support message." },
//       { status: 500 }
//     );
//   }
// }

export const dynamic = "force-static";

