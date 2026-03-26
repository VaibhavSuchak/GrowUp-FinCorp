import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.SERVER_PORT || 5001;

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: (process.env.EMAIL_HOST || '').trim(),
    port: parseInt((process.env.EMAIL_PORT || '587').trim()),
    secure: (process.env.EMAIL_PORT || '').trim() === '465',
    auth: {
        user: (process.env.EMAIL_USER || '').trim(),
        pass: (process.env.EMAIL_PASS || '').trim(),
    },
    debug: true, // Enable debug output
    logger: true // Log information into console
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('SMTP Verification Error:', error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

// Inquiry Email Endpoint
app.post('/api/inquiry', async (req, res) => {
    const { name, phone, email, city, loanType, loanAmount, remarks } = req.body;

    const tableStyle = 'border: 1px solid #ddd; border-collapse: collapse; width: 100%;';
    const tdStyle = 'border: 1px solid #ddd; padding: 12px; text-align: left;';
    const thStyle = 'border: 1px solid #ddd; padding: 12px; text-align: left; background-color: #f2f2f2; font-weight: bold; width: 140px;';

    const inquiryDetailsTable = `
        <table style="${tableStyle}">
            <tr><th style="${thStyle}">Full Name</th><td style="${tdStyle}">${name}</td></tr>
            <tr><th style="${thStyle}">Phone</th><td style="${tdStyle}">${phone}</td></tr>
            <tr><th style="${thStyle}">Email</th><td style="${tdStyle}">${email}</td></tr>
            <tr><th style="${thStyle}">City</th><td style="${tdStyle}">${city}</td></tr>
            <tr><th style="${thStyle}">Loan Type</th><td style="${tdStyle}">${loanType}</td></tr>
            <tr><th style="${thStyle}">Loan Amount</th><td style="${tdStyle}">₹${loanAmount}</td></tr>
            <tr><th style="${thStyle}">Remarks</th><td style="${tdStyle}">${remarks || 'N/A'}</td></tr>
        </table>
    `;

    try {
        // 1. Save to Supabase
        const { error: dbError } = await supabase.from('enquiries').insert([{
            name,
            phone,
            email,
            city,
            loan_type: loanType,
            loan_amount: loanAmount,
            message: remarks,
            status: 'New'
        }]);

        if (dbError) throw dbError;

        // 1.5 Save to Admin Notifications
        const { error: notifError } = await supabase.from('admin_notifications').insert([{
            title: 'New Inquiry Received',
            message: `${name} has applied for a ${loanType} of ₹${loanAmount}.`,
            type: 'inquiry',
            read: false,
            link: '/admin/enquiries'
        }]);

        if (notifError) console.error('Failed to create admin notification:', notifError);

        // 2. Admin Notification Email

        await transporter.sendMail({
            from: `"GrowUp FinCorp" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `New Loan Inquiry: ${name} (${loanType})`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #001a33; border-bottom: 2px solid #001a33; padding-bottom: 10px;">New Inquiry Received</h2>
                    <p>Hello Admin,</p>
                    <p>A new loan inquiry has been submitted through the website. Here are the details:</p>
                    ${inquiryDetailsTable}
                    <p style="margin-top: 20px; font-size: 0.9em; color: #666;">This is an automated notification from the GrowUp FinCorp System.</p>
                </div>
            `,
        });

        // 3. User Confirmation (Thank You Mail)
        console.log(`Sending thank-you email to client: ${email}`);
        await transporter.sendMail({
            from: `"GrowUp FinCorp" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Application Received - GrowUp FinCorp`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #001a33; border-bottom: 2px solid #001a33; padding-bottom: 10px;">Application Submitted Successfully</h2>
                    <p>Dear ${name},</p>
                    <p>Thank you for choosing GrowUp FinCorp. We have received your application for a <strong>${loanType}</strong>. Our team will review your details and contact you as soon as possible.</p>
                    <h3 style="color: #001a33;">Your Application Details:</h3>
                    ${inquiryDetailsTable}
                    <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin-top: 25px; border-left: 4px solid #0ea5e9;">
                        <p style="margin: 0; color: #0f172a; font-size: 15px; line-height: 1.5;"><strong>Next Steps:</strong> A dedicated financial advisor from GrowUp FinCorp has been assigned to your application and will reach out to you within 24 business hours to discuss your personalized loan options.</p>
                    </div>
                    <p style="margin-top: 25px; font-size: 0.9em; color: #666;">Regards,<br>Team GrowUp FinCorp</p>
                </div>
            `,
        });

        res.status(200).json({ success: true, message: 'Enquiry saved and emails sent successfully' });
    } catch (error) {
        console.error('Enquiry Process Error:', error);
        res.status(500).json({ success: false, message: 'Failed to process enquiry', error: error.message });
    }

});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
