[repo link](https://github.com/Damilss/lilianal.com)

[deployment link](https://lilianal-hlbbpsikj-damilss-projects.vercel.app/)

[intended link](https://lilianal.com)

# Personal Website Project (Client)

This repository will contain the source code and assets for a personal website being developed for a client.

## Status

- **Stage:** Initial setup + beginning of production of site
- **Code:** Typescript + Tailwind CSS 
- **Tech stack:** Basic frontend in next.js, no need for traditional backend for project

## Project Goals (High-Level)

- Build a clean, professional personal website for the client.
- Prioritize performance, accessibility, and mobile responsiveness
- Ensure the site is easy to maintain and update over time

## Planned Features (Draft)

These are placeholders and may change:

- Home / Landing page
- About page
- Contact section (form and/or direct links)
- Basic SEO setup (metadata, sitemap, analytics if requested)
- Deployment to a production host (Vercel)

## Tech Stack


- **Language:** Typescript + Tailwind CSS
- **Framework:** Next.js 
- **Dependencies:** React + Next.js + framer-motion
- **Hosting/Deployment:** Vercel + Cloudflare domains

## Repository Structure

.
├── app/                     # Next.js App Router directory
│   ├── contact/             # Contact page route
│   ├── favicon.ico          # Site favicon
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout component
│   ├── not-found.tsx        # Custom 404 page
│   └── page.tsx             # Home page
│
├── components/              # Reusable React components
├── public/                  # Static assets (images, etc.)
│
├── .next/                   # Build output (auto-generated)
├── node_modules/            # Dependencies (auto-generated)
│
├── .gitignore               # Git ignore rules
├── eslint.config.mjs        # ESLint configuration
├── next-env.d.ts            # Next.js TypeScript types
├── next.config.ts           # Next.js configuration
├── postcss.config.mjs       # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Project metadata and scripts
├── package-lock.json        # Dependency lock file
└── README.md                # Project documentation

## License

 - MIT Licsense. See `LICENSE.md`.

## Notes

- Client-specific content (branding, copy, images, etc.) will be added when provided/approved.
- Implementation details and milestone tracking may be added under an `/docs` folder or GitHub Issues.

## Getting Started
This is a Next.js project bootstrapped with create-next-app.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
