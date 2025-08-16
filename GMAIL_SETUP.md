# Gmail Configuration for Contact Form

To enable email sending from your contact form, you need to set up a Gmail App Password.

## Steps to get Gmail App Password:

1. **Enable 2-Factor Authentication** on your Gmail account (dulanprabashwara@gmail.com)

   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled

2. **Generate App Password**

   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click on "2-Step Verification"
   - Scroll down to "App passwords"
   - Select "Mail" and choose "Other (Custom name)"
   - Enter "Chatbot Contact Form" as the name
   - Copy the generated 16-character password

3. **Update Environment Variable**

   - Replace `your_app_password_here` in `.env.local` with the generated app password
   - Example: `GMAIL_APP_PASSWORD=abcd efgh ijkl mnop` (16 characters with spaces)

4. **Restart Development Server**
   - After updating `.env.local`, restart your Next.js development server
   - Run: `npm run dev`

## Security Notes:

- Never commit `.env.local` to git (it's already in .gitignore)
- The app password is specific to this application
- You can revoke it anytime from Google Account settings

## Testing:

After setting up, test the contact form on your website. You should receive emails at dulanprabashwara@gmail.com when someone submits the contact form.

## Troubleshooting:

- If emails aren't working, check the browser console for errors
- Verify that the Gmail App Password is entered correctly (no extra spaces)
- Make sure 2-Factor Authentication is enabled on your Google account
