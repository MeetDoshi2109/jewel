# Aurelia Fine Jewellery — E-Commerce Website

A complete, production-quality jewellery e-commerce website built with Next.js 16, Tailwind CSS v4, Prisma/SQLite, GSAP, and React Three Fiber.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + custom design tokens |
| 3D / Animation | React Three Fiber + Drei, GSAP + ScrollTrigger, Framer Motion |
| State | Zustand (cart + wishlist, persisted to localStorage) |
| Database | SQLite via Prisma ORM |
| Auth | JWT (httpOnly cookies) — customers + admin |
| Images | Unsplash placeholders (swap with your own) |

---

## Quick Start

### 1. Prerequisites
- Node.js 18+ (tested on v24)
- npm 9+

### 2. Clone & install

```bash
cd aurelia
npm install
```

### 3. Environment variables

The `.env` file is already present with safe defaults for local development:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="aurelia-jewellery-secret-key-change-in-production-2024"
ADMIN_JWT_SECRET="aurelia-admin-secret-key-change-in-production-2024"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

**Before deploying to production**, replace both JWT secrets with long random strings, e.g.:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Set up the database

Run migrations (creates `prisma/dev.db`):

```bash
node_modules/.bin/prisma migrate dev --name init
```

### 5. Seed the database (~100 products + demo users)

```bash
node_modules/.bin/ts-node --esm prisma/seed.ts
```

This creates:
- **100 jewellery products** across 8 categories (rings, necklaces, earrings, bangles, mangalsutra, anklets, nose pins, men's)
- **~15 premium items** (priced above ₹10,000, in-store purchase only)
- **2 admin users**: `admin@aurelia.in / admin123` and `staff@aurelia.in / staff123`
- **2 customer accounts**: `priya@example.com / password123` and `ananya@example.com / password123`
- Sample reviews on the first 10 products

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Key URLs

| URL | Description |
|---|---|
| `/` | Homepage with 3D hero, scroll scenes, featured products |
| `/collections` | All products with filters, sort, category pills |
| `/collections/rings` | Category-specific listing (redirects to `/collections?category=rings`) |
| `/products/[slug]` | Product detail page with image zoom + reservation/cart flow |
| `/checkout` | Standard checkout for items ≤ ₹10,000 |
| `/account` | Customer login / register / order history |
| `/wishlist` | Saved items |
| `/about` | Brand story |
| `/contact` | Contact form |
| `/stores` | Store locator with map embeds |
| `/faq` | FAQ accordion |
| `/admin` | Admin dashboard (separate auth) |
| `/admin/products` | Product CRUD |
| `/admin/orders` | Online orders + in-store reservations (tabbed) |
| `/admin/customers` | Customer list |

---

## Dual Checkout Logic

This is the core business rule — implemented precisely:

**Standard items (≤ ₹10,000)**
- Normal e-commerce flow: add to cart → checkout → pay online (card/UPI/wallet)
- Order status: `placed → confirmed → shipped → delivered`

**Premium items (> ₹10,000)**
- Product page shows "Reserve for In-Store Payment" — no cart, no online payment
- Customer fills in name, phone, email, preferred store & visit date
- Order created with status `pending_instore`, payment taken in-person
- Admin updates status via the dashboard after the customer pays in store
- Statuses: `pending_instore → paid_instore → processing → ready_for_pickup → completed`
- Customer sees: *"Your piece is reserved. Please visit [store] to complete payment."*

---

## Admin Dashboard

Navigate to `/admin` and log in with `admin@aurelia.in / admin123`.

**Dashboard** — Revenue, pending reservations count, low-stock alerts, recent orders

**Products** — Full CRUD: add/edit/delete, mark isPremium/isFeatured/isBestseller, manage stock and images

**Orders (two tabs)**
- *Online Orders* — Update status, add tracking number + courier
- *In-Store Reservations* — Update status, log in-person payment amount + method, add notes

**Customers** — List with order counts and total spend

---

## Design System

Colour palette defined in `src/app/globals.css` as CSS variables:

| Variable | Value | Use |
|---|---|---|
| `--ivory` | `#FAF6F0` | Page background |
| `--ivory-deep` | `#F2EBE0` | Section backgrounds |
| `--charcoal` | `#1C1C1E` | Primary text, dark sections |
| `--gold` | `#C9A05B` | Accent, CTA, badges |
| `--rose-gold` | `#B76E79` | Wishlist, secondary accent |
| `--muted` | `#8A8A8E` | Secondary text |
| `--border` | `#E8DDD0` | Borders, dividers |

Typography: **Cormorant Garamond** (headings) + **Inter** (body/UI), loaded from Google Fonts.

---

## 3D & Animation

| Feature | Implementation |
|---|---|
| Hero 3D ring | React Three Fiber + Drei (`RingModel.tsx`) — lazy-loaded after first paint |
| Ring rotation tied to scroll | GSAP ScrollTrigger `scrub: 1` in `ScrollScene.tsx` |
| Horizontal category scroll-jack | GSAP pin + x-translate (desktop only, falls back to flex scroll on mobile) |
| Craftsmanship text reveal | Framer Motion `whileInView` stagger |
| Sparkle particles | Canvas 2D requestAnimationFrame loop with mouse-repel (`ParticleCanvas.tsx`) |
| Animated gradient blobs | Pure CSS `@keyframes` transform + blur (`GradientMesh.tsx`) |
| Scroll-reactive bg colour | GSAP ScrollTrigger transitions `body` background colour between sections |
| `prefers-reduced-motion` | All GSAP/canvas animations exit early; only opacity/colour transitions remain |

---

## Replacing Placeholder Images

All product images currently use Unsplash URLs. To swap in your own photography:

1. Upload your images to a storage service (Cloudinary, S3, etc.)
2. Update the `images` JSON array on each product via the Admin → Products panel, or run a bulk update script against the SQLite database
3. Add your image hostname to `next.config.ts`:

```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'your-cdn.example.com', pathname: '/**' },
  ],
}
```

---

## Payment Gateway (Razorpay)

The checkout is wired up but currently simulates payment. To activate Razorpay:

1. Add keys to `.env`:
```
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx
```

2. Install the SDK: `npm install razorpay`

3. In `src/app/checkout/page.tsx`, replace the `handlePlaceOrder` simulation block with a real Razorpay order creation call + client-side payment modal. The order structure and confirmation flow are already in place.

---

## Production Build

```bash
npm run build
npm start
```

---

## Database Commands

```bash
# Regenerate Prisma client after schema changes
node_modules/.bin/prisma generate

# Run migrations
node_modules/.bin/prisma migrate dev --name your_migration_name

# Open Prisma Studio (GUI)
node_modules/.bin/prisma studio

# Re-seed
node_modules/.bin/ts-node --esm prisma/seed.ts
```

---

## Project Structure

```
aurelia/
├── prisma/
│   ├── schema.prisma          # DB schema
│   ├── seed.ts                # 100-product seed script
│   └── migrations/            # SQLite migration files
├── src/
│   ├── app/
│   │   ├── page.tsx           # Homepage
│   │   ├── layout.tsx         # Root layout (Navbar, Footer, CartDrawer)
│   │   ├── globals.css        # Design tokens, animations, hover utilities
│   │   ├── collections/       # Listing page + category redirect
│   │   ├── products/[slug]/   # PDP + reservation modal
│   │   ├── checkout/          # Standard checkout
│   │   ├── account/           # Customer auth + order history
│   │   ├── wishlist/
│   │   ├── about/ contact/ stores/ faq/
│   │   ├── admin/             # Protected admin dashboard
│   │   │   ├── page.tsx       # Dashboard overview
│   │   │   ├── products/      # Product CRUD
│   │   │   ├── orders/        # Online + reservation orders
│   │   │   └── customers/
│   │   └── api/               # API routes
│   │       ├── products/
│   │       ├── orders/
│   │       ├── auth/customer/
│   │       ├── auth/admin/
│   │       └── admin/
│   ├── components/
│   │   ├── home/              # HeroSection, ScrollScene, RingModel, BrandStory, etc.
│   │   ├── layout/            # Navbar, Footer, NewsletterForm
│   │   ├── product/           # ProductCard
│   │   ├── cart/              # CartDrawer
│   │   └── ui/                # ParticleCanvas, GradientMesh, WishlistButton, MagneticButton
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── auth.ts            # JWT sign/verify helpers
│   │   └── utils.ts           # formatPrice, cn, CATEGORIES, etc.
│   ├── store/
│   │   └── cart.ts            # Zustand cart + wishlist stores
│   └── types/
│       └── index.ts           # Shared TypeScript types
├── .env                       # Local environment variables
├── next.config.ts
├── tailwind.config (via postcss.config.mjs)
└── README.md
```

---

## Licence

This project is provided as a template. Replace all placeholder brand copy, images, and store details before launching.
