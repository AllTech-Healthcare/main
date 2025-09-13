# TapeRX - AI-Enhanced Medication Tapering Solutions

TapeRX is a React-based web application for AI-enhanced medication tapering. It provides a comprehensive platform for patients and healthcare providers to manage medication discontinuation with predictive analytics and clinical oversight.

## Features

- **AI-Powered Analytics**: Machine learning algorithms for predictive withdrawal risk assessment
- **Clinical Dashboard**: Comprehensive patient monitoring with real-time metrics
- **Symptom Tracking**: Daily check-ins and assessment tools
- **Tapering Schedule**: AI-optimized hyperbolic dose reduction schedules
- **Color Scheme Customization**: Multiple theme options (Electric Blue, Emerald Green, Royal Purple)
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Authentication**: Secure user authentication with JWT tokens

## Pages & Components

1. **Landing Page**: Marketing page with feature highlights and authentication forms
2. **Dashboard**: Main overview with recovery metrics, AI insights, and quick actions
3. **Symptoms Tracker**: Daily yes/no questionnaire for monitoring withdrawal symptoms
4. **Schedule**: Visual tapering schedule with charts and timeline
5. **Clinical Communication**: Team communication features (coming soon)
6. **AI Analytics**: Deep dive into ML algorithms and technical architecture

## Technology Stack

- **Frontend**: React 18, JavaScript ES6+
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Authentication**: JWT Decode
- **Build Tool**: Create React App

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Project Structure

```
src/
├── App.js          # Main application component with all pages
├── index.js        # React app entry point
└── index.css       # Global styles with Tailwind imports

public/
├── index.html      # HTML template
└── ...

Other files:
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind configuration
└── postcss.config.js     # PostCSS configuration
```

## API Integration

The application is configured to work with a backend API at `http://localhost:5000/api` with the following endpoints:

- `POST /login` - User authentication
- `POST /register` - User registration
- `GET /schedule` - Retrieve tapering schedule
- `GET /symptoms` - Get symptom history
- `POST /symptoms` - Submit symptom assessment

## Color Schemes

The application supports three built-in color schemes:
- **Electric Blue** (#007AFF)
- **Emerald Green** (#10B981)
- **Royal Purple** (#8B5CF6)

Users can switch between themes using the color picker in the navigation bar.

## Medical Disclaimer

This application is for educational and demonstration purposes. All AI predictive analytics are investigational tools that supplement but never replace clinical judgment. Medical decisions require direct physician oversight, especially for psychiatric medication tapering which carries significant risks.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license information here]