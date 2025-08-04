const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Email transporter configuration
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Email template function
function createEmailTemplate(formData) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
                line-height: 1.6;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            }
            .email-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .email-header h1 {
                font-size: 28px;
                margin-bottom: 10px;
                font-weight: 600;
            }
            .email-header p {
                font-size: 16px;
                opacity: 0.9;
            }
            .email-body {
                padding: 40px 30px;
            }
            .form-card {
                background: #f8fafc;
                border-radius: 10px;
                padding: 25px;
                margin-bottom: 20px;
                border-left: 4px solid #667eea;
            }
            .form-row {
                margin-bottom: 20px;
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
            }
            .form-field {
                flex: 1;
                min-width: 200px;
            }
            .form-field label {
                display: block;
                font-weight: 600;
                color: #374151;
                margin-bottom: 5px;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .form-field .value {
                background: white;
                padding: 12px 15px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
                font-size: 16px;
                color: #1f2937;
                word-wrap: break-word;
            }
            .message-field {
                width: 100%;
            }
            .message-field .value {
                min-height: 120px;
                white-space: pre-wrap;
            }
            .footer {
                background: #1f2937;
                color: white;
                padding: 25px 30px;
                text-align: center;
            }
            .footer-brand {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 10px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .footer-links {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-top: 15px;
                flex-wrap: wrap;
            }
            .footer-link {
                color: #9ca3af;
                text-decoration: none;
                font-size: 14px;
                transition: color 0.3s ease;
            }
            .footer-link:hover {
                color: #667eea;
            }
            .priority-badge {
                display: inline-block;
                padding: 5px 12px;
                background: ${formData.subject === 'job' ? '#10b981' : formData.subject === 'project' ? '#f59e0b' : '#6366f1'};
                color: white;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-left: 10px;
            }
            @media (max-width: 600px) {
                .email-container {
                    margin: 10px;
                    border-radius: 10px;
                }
                .email-header, .email-body, .footer {
                    padding: 20px;
                }
                .form-row {
                    flex-direction: column;
                }
                .footer-links {
                    flex-direction: column;
                    gap: 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                <h1>💌 New Contact Form Submission</h1>
                <p>Someone has reached out through your portfolio website</p>
            </div>

            <div class="email-body">
                <div class="form-card">
                    <div class="form-row">
                        <div class="form-field">
                            <label>👤 Full Name</label>
                            <div class="value">${formData.name}</div>
                        </div>
                        <div class="form-field">
                            <label>📧 Email Address</label>
                            <div class="value">${formData.email}</div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-field">
                            <label>📋 Subject</label>
                            <div class="value">
                                ${formData.subject.charAt(0).toUpperCase() + formData.subject.slice(1)}
                                <span class="priority-badge">${formData.subject}</span>
                            </div>
                        </div>
                        ${formData.budget ? `
                        <div class="form-field">
                            <label>💰 Budget Range</label>
                            <div class="value">${formData.budget.replace('-', ' - ').replace('k', 'k').replace('plus', '+')}</div>
                        </div>
                        ` : ''}
                    </div>

                    <div class="form-row">
                        <div class="form-field message-field">
                            <label>💬 Message</label>
                            <div class="value">${formData.message}</div>
                        </div>
                    </div>

                    ${formData.newsletter ? `
                    <div class="form-row">
                        <div class="form-field">
                            <label>📧 Newsletter Subscription</label>
                            <div class="value">✅ Yes, subscribed to newsletter</div>
                        </div>
                    </div>
                    ` : ''}
                </div>

                <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">
                    📅 Received on ${new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>

            <div class="footer">
                <div class="footer-brand">Josphat Mburu</div>
                <p style="color: #9ca3af; font-size: 14px; margin-bottom: 15px;">
                    Full Stack Developer | Embedded Systems Engineer | Tech Innovator
                </p>
                <div class="footer-links">
                    <a href="mailto:whiz.techke@gmail.com" class="footer-link">📧 Email</a>
                    <a href="https://github.com/mburuwhiz" class="footer-link">🔗 GitHub</a>
                    <a href="https://linkedin.com/in/josphatmburu" class="footer-link">💼 LinkedIn</a>
                    <a href="https://wa.me/254754783683" class="footer-link">📱 WhatsApp</a>
                </div>
                <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
                    This email was sent from your portfolio website contact form.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Routes
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Josphat Mburu | Full Stack Developer',
        page: 'home'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me | Josphat Mburu',
        page: 'about'
    });
});

app.get('/projects', (req, res) => {
    res.render('projects', {
        title: 'Projects | Josphat Mburu',
        page: 'projects'
    });
});

app.get('/skills', (req, res) => {
    res.render('skills', {
        title: 'Skills | Josphat Mburu',
        page: 'skills'
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact | Josphat Mburu',
        page: 'contact'
    });
});

// Contact form submission route
app.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, budget, message, newsletter } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields.'
            });
        }

        // Create email content
        const emailHtml = createEmailTemplate({
            name,
            email,
            subject,
            budget,
            message,
            newsletter
        });

        // Email options
        const mailOptions = {
            from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
            to: process.env.TO_EMAIL,
            subject: `New Contact Form Submission - ${subject.charAt(0).toUpperCase() + subject.slice(1)}`,
            html: emailHtml,
            replyTo: email
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Message sent successfully! I\'ll get back to you soon.'
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error sending your message. Please try again.'
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
