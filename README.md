# Hospital Ward Management System

A modern, comprehensive hospital ward management system built with React, Vite, and TailwindCSS.

## Features

- **Dashboard**: Overview of ward statistics, occupancy rates, and key metrics
- **Ward Management**: Manage wards, beds, and bed assignments
- **Patient Management**: Track patient admissions, discharges, and medical records
- **Staff Management**: Manage doctors, nurses, and staff assignments
- **Analytics**: Visual charts and reports for better decision-making
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Supabase**: PostgreSQL database and backend
- **Lucide React**: Beautiful icon library
- **Recharts**: Charting library for analytics
- **date-fns**: Date manipulation library

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase database:
   - Follow the instructions in `SUPABASE_SETUP.md`
   - Run the SQL schema in your Supabase SQL Editor
   - Environment variables are already configured in `.env`

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── context/          # React context for state management
├── lib/              # Supabase client configuration
├── data/             # Mock data (for reference)
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## Usage

The system is now connected to Supabase for data persistence. All data is stored in a PostgreSQL database and synced in real-time. After setting up the database schema, you can:

1. Add and manage wards
2. Register and track patients
3. Manage hospital staff
4. View analytics and reports

All changes are automatically saved to the database.

## License

MIT
