[repo link](https://github.com/Damilss/westcoastbeautyco.com)
# West Coast Beauty Co. Website

This is a Next.js website for West Coast Beauty Co., a beauty and wellness brand. The site is built with Next.js, TypeScript, and Tailwind CSS.

## Documentation

- Contact Form: `docs/contact-form.md`
- Instagram Feed (Current): `docs/instagram-feed.md`
- Instagram Feed (Archive): `docs/instagram-third-party-embed-migration.md`

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open:
```
http://localhost:3000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contact Form Email Delivery

The contact form at `/contact` is sent server-side with Resend.

For implementation details, see `docs/contact-form.md`.

1. Create `.env.local` from `.env.example`.
2. Set `RESEND_API_KEY` to your Resend API key.
3. Set `RESEND_FROM_EMAIL` to a sender address on your verified Resend domain.

Current contact delivery settings:
- To: `Hello@westcoastbeautyco.com`
- From: `West Coast Beauty Co <${RESEND_FROM_EMAIL}>`
- Reply-To: submitter email

## Instagram Feed

The homepage Instagram section renders from the public Behold JSON endpoint:
- `https://feeds.behold.so/jidFIqDLkPBGRR83dk3E`

Notes:
- No API keys are required.
- No `.env` configuration is required for the feed.
- The feed is fetched client-side in `app/components/instagram-feed.tsx`.