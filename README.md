# Hunar-Setu 🌿🧵

> **A Unified Digital Commerce, Skill Development & Production Management Platform for Self-Help Groups (SHGs)**

Hunar-Setu bridges the gap between rural artisan Self-Help Groups (SHGs) and modern conscious consumers. It provides grassroots cooperatives with direct access to digital markets, structured vocational skill training, and production order tracking—all within an integrated multi-portal architecture.

---

## 🌟 Key Highlights & Architecture

Hunar-Setu is designed with three distinct, dedicated portal environments tailored to each stakeholder's workflow:

```
                          ┌───────────────────────────┐
                          │    Hunar-Setu Gateway     │
                          └─────────────┬─────────────┘
                                        │
         ┌──────────────────────────────┼──────────────────────────────┐
         ▼                              ▼                              ▼
  🛍️ Buyer Portal               🧵 SHG Portal                  🛡️ Admin Portal
  - Direct Marketplace          - Group Registration           - Order Allocation
  - Verified Artisan Goods      - Member Roster & Aadhaar      - Multi-SHG Batch Split
  - Cart & Instant Checkout     - Video Training Center        - YouTube Course Curation
  - Customer Order Tracking     - Production Batch Tracker     - Catalog & Stock Management
```

---

## 🚀 Portals & Features

### 🛍️ 1. Buyer Portal (Artisan Marketplace)
- **Authentic Handmade Catalog**: Browse curated handicrafts, handloom textiles, eco-friendly pottery, natural cosmetics, and organic food items.
- **Detailed Product Specifications**: Detailed materials breakdown, artisan highlights, high-resolution imagery, and verified community reviews.
- **Dynamic Shopping Cart & Checkout**: Interactive bag management, flexible quantity adjustments, shipping details, and order generation.
- **Order Tracking**: Real-time status inspection for customer orders from placement to production and fulfillment.

### 🧵 2. SHG Portal (Artisan Cooperative Workspace)
- **Cooperative Identity & Profile**: Manage official registration numbers, state/district location, leader credentials, and craft specialization.
- **Member Directory**: Maintain an exhaustive artisan roster complete with craft specializations, years of experience, contact details, and formatted 12-digit Aadhaar identification records.
- **Interactive Video Learning Center**: Access vocational skill enhancement modules. Supports embedded video playback, bookmarking, and real-time course completion percentage tracking.
- **Assigned Order Production Tracking**: Direct visibility into allocated batches. Artisans can update production progress across four discrete lifecycle stages:
  - `Assigned` ➔ `In Production` ➔ `Completed` (or `Cancelled`).

### 🛡️ 3. Admin & Operational Hub
- **Smart Order Allocation & Batch Splitting**: Allocate bulk consumer orders among multiple SHGs based on capacity, location, and craftsmanship skills.
- **YouTube Curriculum Engine**: Add vocational video courses by simply pasting a YouTube URL. The platform automatically fetches:
  - Video title
  - Channel / Instructor name
  - High-resolution video thumbnail
  - **Exact video duration in standard `MM:SS` format** (e.g., `16:19`, `24:45`) via the YouTube Player stream detection.
- **Catalog Management**: Add, update, and toggle inventory status for artisan products, manage pricing, descriptions, and material specifications.
- **Network Directory & Monitoring**: Monitor all registered Self-Help Groups, active members, aggregate completion metrics, and production fulfillment pipelines.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons & UI Enhancements** | [Lucide React](https://lucide.dev/) & [Motion](https://motion.dev/) |
| **Database & Persistence** | [Firebase Firestore](https://firebase.google.com/) (Real-time synchronization) |
| **Video & Media Service** | YouTube IFrame Player & oEmbed API |

---

## 📂 Project Structure

```
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Modular portal components
│   │   ├── AdminPortal.tsx    # Management hub (orders, allocation, curriculum, products)
│   │   ├── BuyerPortal.tsx    # Artisan marketplace storefront & checkout
│   │   ├── LandingHero.tsx    # Brand landing page with role navigation
│   │   ├── RoleAuthModal.tsx  # Modal authentication for Buyer, SHG, and Admin
│   │   └── SHGPortal.tsx      # Cooperative workspace (profile, roster, training, orders)
│   ├── data/
│   │   └── seedData.ts        # Initial seed products, courses, and baseline data
│   ├── lib/
│   │   ├── cloudService.ts    # Firestore real-time queries & mutations
│   │   ├── firebase.ts        # Firebase app configuration
│   │   └── youtubeService.ts  # YouTube API duration extraction (MM:SS) & metadata parser
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces (Product, SHGProfile, OrderItem, etc.)
│   ├── App.tsx             # Central state coordinator and role-based portal router
│   ├── index.css           # Global Tailwind CSS imports and theme configuration
│   └── main.tsx            # React application entry point
├── firestore.rules         # Security and access control rules for Firestore
├── package.json            # Project dependencies and operational scripts
├── tsconfig.json           # Strict TypeScript configuration
└── vite.config.ts          # Vite build and plugin configuration
```

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed on your local development machine:
- **Node.js**: v18.0.0 or higher
- **npm** or **bun** or **yarn**
- **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/hunar-setu.git
   cd hunar-setu
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory modeled after `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your Firebase project configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

5. **Typecheck & Linting**:
   ```bash
   npm run lint
   ```

6. **Create a production build**:
   ```bash
   npm run build
   ```

---

## 🔒 Security & Data Integrity

- **Firestore Security Rules**: Standardized access rules ensure order creation, group roster updates, and administrative allocations remain isolated and authorized.
- **Aadhaar Privacy**: Member records support structured input with masked display patterns to safeguard personal identification information.
- **Fail-safe Offline Fallback**: In scenarios where cloud connectivity is interrupted, the platform transparently falls back to local data states, guaranteeing continuous uptime for field operations.

---

## 🤝 Contributing

Contributions to empower artisan communities are always welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.
