# Food Ninja

yay

A high-performance, full-stack food delivery platform built to handle real-time orders, multi-role user management, and seamless payments.

## Tech Stack

*   **Frontend & Framework:** Next.js, React
*   **Database:** PostgreSQL 
*   **Styling:** Tailwind CSS 
*   **Real-time Capabilities:** WebSockets / Server-Sent Events (SSE)

## Core Features

Based on a robust, multi-actor database architecture, Food Ninja supports four distinct user roles, each with specialized features:

*   **Users (Customers):** Browse restaurants, manage a real-time cart, place orders, make payments, and leave reviews for food and riders.
*   **Restaurant Owners:** Manage food catalogs, update operating hours, receive orders, and track restaurant-specific revenue.
*   **Riders:** Accept assigned deliveries, update delivery statuses in real-time, and track earnings and vehicle status.
*   **Admins:** Oversee the entire ecosystem, monitor platform health, and manage user, owner, and rider accounts.

## Database Architecture

The application is powered by a relational PostgreSQL database designed for scale and historical accuracy. Key domains include:

*   **Authentication & Roles:** Dedicated tables for Users, Admins, Restaurant Owners, and Riders.
*   **Commerce Flow:** Seamless data flow from `Cart` -> `Cart_Items` -> `Order` -> `Order_Items` -> `Payment`.
*   **Geospatial Tracking:** Location-aware routing for users, restaurants, and riders, optimized for real-time tracking using PostGIS.

*(Note: Reference `ERD_dark.pdf` in the `/docs` folder for the complete database schema).*

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

*   Node.js (v18.x or higher recommended)
*   PostgreSQL installed and running locally

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/food-ninja.git](https://github.com/your-username/food-ninja.git)
    cd food-ninja
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and configure your database connection string and standard environment variables.
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/food_ninja"
    ```

4.  **Run Database Migrations:**
    ```bash
    npm run db:migrate 
    ```

5.  **Start the development server:**
    ```bash
    npm run dev
    ```

6.  Open http://localhost:3000 with your browser to see the application.

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'Add NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request
