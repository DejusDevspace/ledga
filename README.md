# Ledga — Personal Finance Dashboard

Ledga is a modern, brutalist-style finance tracker that uses Google Sheets as its primary database and Supabase for secure authentication. It provides real-time insights into your spending, savings, and income directly extracted from your spreadsheet data.

## 🚀 Getting Started

### 1. Prerequisites
- A **Supabase** account and project.
- A **Google Cloud Console** project with the Google Sheets API enabled.
- A **Service Account JSON** credential from your Google project.

### 2. Environment Setup
Create a `.env.local` file in the root directory and add the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Sheets API (Service Account)
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="your_private_key"
```

### 3. Installation & Local Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📈 How to Use

1. **Sign Up**: Create an account via the secure authentication system.
2. **Link a Sheet**: Navigate to **Settings > Sheets** and add your Google Sheet ID (found in your spreadsheet URL).
3. **Format Your Data**: Ensure your Google Sheet has at least these columns: `Date`, `Type` (Income/Expense), `Category`, `Description`, and `Amount`.
4. **Monitor**: Your transactions will automatically sync and populate the Dashboard, Transactions tracker, and Insights analytics.

## ✨ Features

- **Live Data Proxy**: Seamless, real-time fetching from Google Sheets without external databases.
- **Transaction Tracking**: Powerful filtering, sorting, and search capabilities.
- **Interactive Insights**: Visual analytics including spending trends, savings rates, and income stability.
- **Dynamic Categorization**: Automatic category discovery with consistent, vibrant color mapping.
- **Brutalist UI/UX**: High-contrast, bold design optimized for speed and clarity.
