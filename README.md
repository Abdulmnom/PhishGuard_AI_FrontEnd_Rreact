# PhishGuard AI Frontend

A modern, responsive React-based frontend application for PhishGuard AI, designed to help users detect phishing attempts through email and URL scanning.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Dashboard**: Centralized interface for all scanning operations
- **Email Scanner**: Analyze email addresses for potential phishing threats
- **URL Scanner**: Check URLs for malicious content and phishing indicators
- **Scan History**: View and manage previous scan results
- **System Health Monitoring**: Real-time status of the backend services
- **Responsive Design**: Optimized for desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Axios
- **UI Components**: Lucide React icons
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Abdulmnom/PhishGuard_AI_FrontEnd_Rreact.git
   cd PhishGuard_AI_FrontEnd_Rreact
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   VITE_API_BASE_URL=your_backend_api_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx       # Navigation component
│   └── ProtectedRoute.jsx # Route protection wrapper
├── context/             # React context providers
│   └── AuthContext.jsx  # Authentication context
├── pages/               # Page components
│   ├── Dashboard.jsx    # Main dashboard
│   ├── LoginPage.jsx    # User login
│   ├── RegisterPage.jsx  # User registration
│   ├── Profile.jsx      # User profile management
│   ├── AdminDashboard.jsx # Admin interface
│   └── ScanPage.jsx     # Scanning interface
├── api/                 # API configuration
│   └── api.js           # Axios instance and API calls
├── App.jsx              # Main application component
└── main.jsx             # Application entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


*Built with ❤️ using React and modern web technologies*
