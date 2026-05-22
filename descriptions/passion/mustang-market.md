# Mustang Market Mobile

React Native (Expo) app for Mustang Market - Cal Poly's student marketplace.

## Features

- 📱 Native iOS & Android apps
- 🔐 Cal Poly email authentication
- 🛍️ Browse and search listings
- 💾 Save/bookmark listings
- 👤 User profiles with ratings
- 📂 Multiple listing types (Products, Services, Rideshare, Housing)

## Tech Stack

- **Expo** (SDK 54) - React Native framework
- **Expo Router** - File-based navigation
- **Firebase** - Auth, Firestore, Storage
- **NativeWind** - Tailwind CSS for React Native

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app on your phone (for development)

### Installation

1. Clone this repository

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your environment file:
   ```bash
   cp .env.example .env
   ```

4. Fill in your Firebase credentials in `.env`

5. Start the development server:
   ```bash
   npx expo start
   ```

6. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## Project Structure

```
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Browse/Home
│   │   ├── messages.tsx   # Messages
│   │   ├── create.tsx     # Create listing
│   │   ├── saved.tsx      # Saved listings
│   │   └── profile.tsx    # User profile
│   ├── listing/[id].tsx   # Listing detail
│   ├── login.tsx          # Authentication
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts (Auth)
│   ├── lib/               # Firebase, types, utilities
│   └── constants/         # App constants
├── assets/                # Images, fonts
└── app.json               # Expo config
```

## Firebase Setup

This app shares the same Firebase backend as the web app. Make sure your Firebase project has:

1. **Authentication** enabled with Email/Password provider
2. **Firestore** with the following collections:
   - `listings`
   - `users`
   - `savedListings`
   - `conversations`
   - `requests`
3. **Storage** bucket for images
4. Appropriate security rules

## Building for Production

### Development Build
```bash
npx expo run:ios
npx expo run:android
```

### Production Build (EAS)
```bash
npm install -g eas-cli
eas build --platform all
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT


---

# 🐎 Mustang Market
---
[Mobile Repository](https://github.com/cedmonston22/mustang-market-mobile)
---
### The Secure, Exclusive Marketplace for the Cal Poly Community.
Mustang Market is a peer-to-peer marketplace designed specifically for Cal Poly students. It eliminates the "sketchiness" of public marketplaces by requiring `@calpoly.edu` verification and using a __Digital Handshake (QR Scan)__ to ensure safe, guaranteed transactions.

## 🛠 Tech Stack
- Frontend: Next.js 14+ (App Router), Tailwind CSS, TypeScript
- Backend/Auth: Firebase (Firestore, Authentication, Storage)
- Payments: Stripe Connect (Express) for Escrow & Payouts
- Mobile: Currently PWA (Progressive Web APP) but eventually moving to React Native / Expo on mustang-market-mobile

## ⚡ The "Easy" User Flow (MVP)
1. List (Seller)
- Student uploads item photos, description, and price.
- Listing is tagged by campus location (e.g., PCV, Red Bricks, Yosemite).

2. Secure (Buyer)
- Buyer clicks "Secure Purchase" and pays via the app.
- The Vault: Funds are held in escrow by the platform.
- A private chat opens _after the buyer pays_ for the Buyer and Seller to coordinate a meetup.

3. Exchange (The Handshake)
- Parties meet at agreed upon location.
- Buyer inspects the item.
- The Trigger: Seller shows a unique QR code -> Buyer scans it in-app.

4. Payout
- The scan confirms the item was received.
- Split: 95% to Seller / 5% Service Fee to Mustang Market.

## 🔐 Safety & Trust Guardrails
- Edu-Only: Firebase Auth rules strictly block any email not ending in @calpoly.edu.
- Escrow: Sellers are never "ghosted" without payment, and Buyers never pay for a broken item.
- Reputation: Every transaction builds a "Campus Trust Score" visible on user profiles.

## 🚀 Getting Started
1. Clone & Install:
```bash
Bashgit clone https://github.com/your-repo/mustang-market.git
npm install
```

45: 2. Environment Variables: Create a `.env.local` with your Firebase and Stripe keys.
   ```env
   # Firebase Config
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   
   # Stripe Config
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PLATFORM_FEE_PERCENT=10
   ```

3. Run Development:
```bash
npm run dev
```
## 📈 Monetization Strategy
- Service Fee: A 5% "Trust & Protection" fee on all digital transactions.

ideas for later:
- Mustang Boost: $1.99 to pin a listing to the top of the feed for 24 hours.
- Sponsored Posts: Local SLO businesses (coffee shops, bike repair) promoting to students.
--- 
See [docs.md](DOCS.md) for more documentation! 
---

## License Summary

This repository is **proprietary** and **not open source**.

- Ownership is retained exclusively by the original Mustang Market founders
- Source code access is permitted **for academic review only**
- Modification, redistribution, deployment, or commercial use is prohibited
- No affiliation with Cal Poly is claimed or implied

See `LICENSE.md` for the full, legally binding terms.

[mustang-market.com](https://mustang-market.com)