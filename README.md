# TapeRX - AI-Enhanced Medication Tapering Application

This React application provides AI-powered predictive analytics for medication tapering with clinical supervision.

## Project Structure

```
src/
├── constants.js                   # Color schemes and navigation items
├── auth/
│   └── AuthContext.js            # Authentication context and provider
├── components/
│   ├── ColorSchemeSelector.js    # Theme selector component
│   └── Navigation.js             # Main navigation component
├── pages/
│   ├── LandingPage.js            # Landing/authentication page
│   ├── DashboardPage.js          # Main dashboard with metrics
│   ├── SymptomsPage.js           # Daily symptom check-in
│   ├── AIAnalyticsPage.js        # AI analytics detailed view
│   ├── SchedulePage.js           # Medication tapering schedule
│   └── CommunicationPage.js      # Clinical team communications
└── App.js                        # Main application component
```

## Components Overview

- **Authentication**: JWT-based authentication with localStorage persistence
- **Navigation**: Responsive navigation with mobile menu support
- **Dashboard**: Real-time metrics with circular progress indicators
- **AI Analytics**: Detailed view of machine learning predictions and clinical data
- **Symptoms Tracking**: Daily yes/no assessment questions
- **Schedule**: Visual representation of tapering timeline
- **Theming**: Multiple color schemes with live switching

## Key Features

- AI-powered predictive analytics for medication tapering
- Clinical oversight and communication tools
- Real-time symptom tracking and analysis
- Responsive design with mobile support
- Multiple color themes
- Secure authentication system

## Dependencies

- React 18+
- Lucide React (icons)
- Recharts (data visualization)
- Axios (HTTP client)
- jwt-decode (JWT token handling)

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Build for production: `npm run build`

## Medical Disclaimer

This application is for educational and research purposes. All medication decisions require direct physician oversight and should never rely solely on AI predictions.