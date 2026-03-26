import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // 1. Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { name, phone, email, city, loanType, loanAmount, remarks } = req.body;

    // 2. Initialize Supabase
    const supabase = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.VITE_SUPABASE_ANON_KEY
    );

    // 3. Setup Nodemailer
    const transporter = nodemailer.createTransport({
        host: (process.env.EMAIL_HOST || '').trim(),
        port: parseInt((process.env.EMAIL_PORT || '587').trim()),
        secure: (process.env.EMAIL_PORT || '').trim() === '465',
        auth: {
            user: (process.env.EMAIL_USER || '').trim(),
            pass: (process.env.EMAIL_PASS || '').trim(),
        }
    });

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
        await supabase.from('admin_notifications').insert([{
            title: 'Inquiry Received',
            message: `${name} - ${loanType}`,
            type: 'inquiry',
            read: false,
            link: '/admin/enquiries'
        }]);

        // 2. Admin Notification Email
        await transporter.sendMail({
            from: `"GrowUp FinCorp" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `New Loan Inquiry: ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
                    <h2>New Inquiry Received</h2>
                    ${inquiryDetailsTable}
                </div>
            `,
        });

        // 3. User Confirmation (Thank You Mail)
        if (email) {
            await transporter.sendMail({
                from: `"GrowUp FinCorp" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: `Application Received`,
                html: `<p>Dear ${name}, thank you for choosing GrowUp FinCorp. We have received your application.</p>`,
            });
        }

        return res.status(200).json({ success: true, message: 'Enquiry processed successfully' });
    } catch (error) {
        console.error('Vercel API Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to process enquiry', error: error.message });
    }
}
