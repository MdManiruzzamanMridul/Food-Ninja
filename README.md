# Food Ninja

A modern, high-performance full-stack food delivery platform built to handle real-time orders, multi-role user management, location-aware restaurant discovery, and seamless payments.

---

## 🚀 Tech Stack

- **Frontend & Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, PostCSS
- **Database:** PostgreSQL / [Neon Serverless Postgres](https://neon.tech)
- **Database Client:** `pg` (Node-Postgres) with connection pooling
- **Data Ingestion:** `csv-parse`
- **Backend Services:** Next.js Server Components & Route Handlers / Python (Flask & Psycopg Pool)

---

## 📦 Project Dependencies

### Production Dependencies (`Frontend/package.json`)

| Package | Version | Purpose |
| :--- | :--- | :--- |
| **`next`** | `16.3.0` | React framework for server-side rendering, App Router, and API routes |
| **`react`** | `19.2.8` | Core UI library for component-based interface rendering |
| **`react-dom`** | `19.2.8` | DOM renderer for React |
| **`pg`** | `^8.23.0` | PostgreSQL client for Node.js to connect to Postgres / Neon databases |
| **`leaflet`** | `^1.9.4` | Interactive maps for location picking and rider tracking |

### Development Dependencies (`Frontend/package.json`)

| Package | Version | Purpose |
| :--- | :--- | :--- |
| **`typescript`** | `^5` | Type safety and static analysis across the application |
| **`tailwindcss`** | `^4` | Utility-first CSS framework for modern, responsive UI design |
| **`@tailwindcss/postcss`** | `^4` | PostCSS plugin integration for Tailwind CSS v4 |
| **`eslint`** | `^9` | Code linting and static analysis |
| **`eslint-config-next`** | `16.3.0` | Next.js-specific ESLint rules and configurations |
| **`@types/node`** | `^20` | TypeScript definitions for Node.js runtime APIs |
| **`@types/react`** | `^19` | TypeScript definitions for React 19 |
| **`@types/react-dom`** | `^19` | TypeScript definitions for React 19 DOM |
| **`@types/pg`** | `^8.21.0` | TypeScript definitions for Node PostgreSQL client |

### Backend Prototype Dependencies (`Backend/`)

| Package / Tool | Version / Spec | Purpose |
| :--- | :--- | :--- |
| **`Python`** | `3.10+` | Python runtime for backend microservices |
| **`Flask`** | `Latest` | Lightweight WSGI web framework for API endpoints |
| **`psycopg` / `psycopg_pool`** | `v3+` | PostgreSQL connection pool and adapter for Python |
| **`python-dotenv`** | `Latest` | Loads environment variables from `.env` files |

---

## 📂 Project Structure

```text
Food Ninja/
├── Database/                          # Database schemas, migrations, & diagrams
│   ├── schema.sql                     # PostgreSQL PostGIS table schemas
│   └── ERD_dark.png                   # Database Entity Relationship Diagram
├── Backend/                           # Python Flask REST API & query services
│   ├── Queries/                       # Parameterized SQL queries
│   ├── routes/                        # Modular Flask API blueprints
│   ├── app.py                         # Flask server entry point
│   ├── auth.py                        # JWT security & password hashing
│   ├── db.py                          # Connection pooling & SQL loader
│   ├── utils.py                       # Validations & Distance Matrix routing
│   ├── requirements.txt               # Python dependencies
│   └── BACKEND_TASKS.md               # Backend progress & task tracking
├── Frontend/                          # Next.js 16 Web Application
│   ├── app/                           # App router pages & layouts
│   │   ├── admin/                     # Admin dashboard & management
│   │   ├── checkout/                  # Order checkout flow
│   │   ├── home/                      # Restaurant browsing & search
│   │   ├── login/ & register/         # Multi-role authentication & onboarding
│   │   ├── orders/                    # Live order tracking & details
│   │   ├── owner/                     # Restaurant owner portal
│   │   ├── profile/                   # Customer profile settings
│   │   └── rider/                     # Rider delivery portal
│   ├── components/                    # Reusable UI & Leaflet map components
│   ├── lib/                           # Platform state, database pool, & API client
│   ├── public/                        # Static assets & icons
│   ├── package.json                   # Frontend dependencies & scripts
│   └── tsconfig.json                  # TypeScript configuration
├── package.json                       # Root script orchestrator (--prefix Frontend)
├── .gitignore                         # Unified root gitignore
└── README.md                          # Root project documentation
```

---

## 👥 Core Features & Roles

Based on a robust, multi-actor architecture, Food Ninja supports four distinct user roles:

- **Users (Customers):** Browse restaurants, filter by cuisine/area, manage a real-time cart, place orders, make payments, and leave reviews.
- **Restaurant Owners:** Manage food catalogs, update operating hours, receive and process orders, and track restaurant-specific revenue.
- **Riders:** Accept assigned deliveries, update delivery statuses in real-time, and track earnings and vehicle status.
- **Admins:** Oversee the platform ecosystem, monitor order metrics, manage users, restaurant owners, and rider accounts.

---

## 🗄️ Database Architecture

The application is powered by a relational PostgreSQL database (compatible with Neon Serverless Postgres):

- **Authentication & Roles:** Dedicated entities for Users, Admins, Restaurant Owners, and Riders.
- **Commerce Flow:** Seamless data flow from `Cart` $\to$ `Cart_Items` $\to$ `Order` $\to$ `Order_Items` $\to$ `Payment`.
- **Restaurant Directory:** `dhaka_restaurants` table storing geo-coordinates, cuisine tags, ratings, and Google Maps links.
- **Geospatial Tracking:** Location-aware routing for users, restaurants, and riders.

*(Reference `ERD_dark.png` in the project root for the complete database schema diagram).*

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: `v20.x` or higher recommended
- **npm**: `v10.x` or higher
- **PostgreSQL**: Neon Serverless Postgres or a local PostgreSQL instance (v14+)
- **Python** *(optional, for Python backend)*: `v3.10+`

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/food-ninja.git
   cd "Food Ninja"
   ```

2. **Install frontend dependencies:**
   ```bash
   # From root:
   npm install --prefix Frontend
   # OR:
   cd Frontend && npm install
   ```

3. **Configure Environment Variables:**
   Create `Frontend/.env.local` with your PostgreSQL / Neon database connection string:
   ```env
   DATABASE_URL="postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/food_ninja?sslmode=require"
   ```

4. **Start the Frontend Development Server:**
   ```bash
   # From project root:
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts (Run from project root)

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Starts Next.js development server on `http://localhost:3000` |
| `build` | `npm run build` | Builds optimized production bundle in `Frontend/` |
| `start` | `npm run start` | Starts Next.js production server |
| `lint` | `npm run lint` | Runs ESLint across `Frontend/` |

---

## 🐍 Python Backend Setup

If running the Flask API service in `Backend/`:

1. Navigate to the backend folder:
   ```bash
   cd Backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install Python dependencies:
   ```bash
   pip install flask "psycopg[pool]" python-dotenv
   ```
4. Run the Flask server:
   ```bash
   python app.py
   ```
   The Flask API will run on `http://localhost:5000`.

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'Add NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

