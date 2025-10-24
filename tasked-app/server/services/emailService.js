// server/services/emailService.js
const nodemailer = require('nodemailer');

// Set up the transporter using your provided Gmail credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // IMPORTANT: Use the App Password you generated, not your main password.
        user: 'kgomotsosele80@gmail.com',
        pass: 'nnxw nqal qhuq etpm'
    }
});

/**
 * Sends a project invitation email.
 * @param {string} recipientEmail - The email address of the person to invite.
 * @param {string} projectName - The name of the project.
 */
exports.sendInvitation = async (recipientEmail, projectName) => {
    const mailOptions = {
        from: 'kgomotsosele80@gmail.com',
        to: recipientEmail,
        subject: `You have been invited to the ${projectName} project!`,
        html: `
            <h1>Project Invitation</h1>
            <p>You have been invited to join the **${projectName}** project.</p>
            <p>Since this is a demo application, this is an automated message to confirm email functionality is working.</p>
            <br/>
            <p>Happy Tasking!</p>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email successfully queued: ${info.response}`);
        return true;
    } catch (error) {
        console.error('CRITICAL: Error sending email. Check Nodemailer logs or App Password:', error.message);
        throw new Error('Failed to send invitation email. Check server console for details.');
    }
};