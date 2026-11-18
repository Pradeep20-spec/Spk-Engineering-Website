# SPK Engineering website

React and Vite website for SPK Engineering, with a contact form that sends enquiries to the business email address.

## Run locally

```sh
npm install
npm run dev
```

## Configure website email

The contact endpoint sends mail through Yahoo SMTP. Copy `.env.example` to `.env` and set `SMTP_PASS` to an app password generated in the Yahoo account. Do not use the regular Yahoo account password, commit `.env`, or put SMTP credentials in frontend code.

The other Yahoo SMTP settings are:

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=465
SMTP_USER=spk.engineering@yahoo.co.in
CONTACT_TO=spk.engineering@yahoo.co.in
```

In production, deploy the project on Vercel (which serves `api/contact.js` as a serverless function) and add these values in the project's Environment Variables settings. Redeploy after adding or changing environment variables. The same endpoint is available in Vite development mode.
