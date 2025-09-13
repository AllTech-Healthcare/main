import React, { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext } from 'react';
import { Calendar, ChevronRight, AlertTriangle, TrendingDown, Users, MessageCircle, FileText, Home, X, Menu, ArrowRight, Shield, Heart, Brain, Activity, Zap, Target, BarChart3, TrendingUp, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Constants
const COLOR_SCHEMES = {
  'electric-blue': {
    primary: '#007AFF',
    primaryHover: '#0056CC',
    primaryLight: 'rgba(0, 122, 255, 0.1)',
    primaryBorder: 'rgba(0, 122, 255, 0.3)',
    name: 'Electric Blue',
    gradient: 'from-blue-600 to-blue-700'
  },
  'emerald-green': {
    primary: '#10B981',
    primaryHover: '#059669',
    primaryLight: 'rgba(16, 185, 129, 0.1)',
    primaryBorder: 'rgba(16, 185, 129, 0.3)',
    name: 'Emerald Green',
    gradient: 'from-emerald-600 to-emerald-700'
  },
  'royal-purple': {
    primary: '#8B5CF6',
    primaryHover: '#7C3AED',
    primaryLight: 'rgba(139, 92, 246, 0.1)',
    primaryBorder: 'rgba(139, 92, 246, 0.3)',
    name: 'Royal Purple',
    gradient: 'from-purple-600 to-purple-700'
  }
};

const NAVIGATION_ITEMS = [
  { key: 'dashboard', label: 'Overview', icon: Home },
  { key: 'schedule', label: 'Schedule', icon: Calendar },
  { key: 'symptoms', label: 'Daily', icon: Activity },
  { key: 'communication', label: 'Clinical', icon: MessageCircle }
];

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        }
      } catch (err) {
        logout();
      }
    }
  }, [token]);

  const login = (newToken, newUserId) => {
    setToken(newToken);
    setUserId(newUserId);
    localStorage.setItem('token', newToken);
    localStorage.setItem('userId', newUserId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

axios.defaults.baseURL = 'http://localhost:5000/api'; // Or prod URL

// Color Scheme Selector Component
const ColorSchemeSelector = ({ selectedColorScheme, onSchemeChange, currentScheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const handleColorSelection = (key) => {
    onSchemeChange(key);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:bg-gray-800"
        title="Change color theme"
      >
        <div 
          className="w-5 h-5 rounded-full border-2 border-white shadow-lg"
          style={{ backgroundColor: currentScheme.primary }}
        />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-12 bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl z-50 min-w-[180px]">
          <p className="text-white text-xs font-medium mb-3 text-center">Choose Theme</p>
          <div className="space-y-2">
            {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
              <button
                key={key}
                onClick={() => handleColorSelection(key)}
                className={`w-full flex items-center space-x-3 p-2 rounded text-sm transition-all duration-200 ${
                  selectedColorScheme === key 
                    ? 'bg-gray-800 text-white transform scale-105' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm" 
                  style={{ backgroundColor: scheme.primary }}
                />
                <span className="flex-grow text-left">{scheme.name}</span>
                {selectedColorScheme === key && (
                  <Check className="w-4 h-4 text-green-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Navigation Component
const Navigation = ({ currentPage, onPageChange, currentScheme, selectedColorScheme, onSchemeChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token, logout } = useContext(AuthContext);

  const handleNavigation = (page) => {
    onPageChange(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav 
      className="bg-gray-900 border-b sticky top-0 z-50" 
      style={{ borderBottomColor: currentScheme.primary }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation('landing')}
            className="flex items-center space-x-3 transition-transform hover:scale-105"
          >
            <div 
              className="rounded-lg w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg"
              style={{ backgroundColor: currentScheme.primary, color: 'white' }}
            >
              T
            </div>
            <span className="text-2xl font-bold">
              <span className="text-white">Tape</span>
              <span style={{ color: currentScheme.primary }}>RX</span>
            </span>
          </button>
          
          <div className="flex items-center space-x-4">
            {/* Navigation Items */}
            {token && currentPage !== 'landing' && (
              <div className="hidden md:flex space-x-1">
                {NAVIGATION_ITEMS.map(({ key, label, icon: Icon }) => (
                  <button 
                    key={key}
                    onClick={() => handleNavigation(key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      currentPage === key 
                        ? 'text-white shadow-lg transform scale-105' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                    style={currentPage === key ? { backgroundColor: currentScheme.primary } : {}}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            )}
            
            {/* Color Scheme Selector */}
            <ColorSchemeSelector 
              selectedColorScheme={selectedColorScheme}
              onSchemeChange={onSchemeChange}
              currentScheme={currentScheme}
            />
            
            {token && (
              <button onClick={logout} className="text-gray-300 hover:text-white">
                Logout
              </button>
            )}
            
            {/* Mobile Menu Button */}
            {token && currentPage !== 'landing' && (
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-300"
              >
                <Menu size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && token && currentPage !== 'landing' && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="space-y-2">
              {NAVIGATION_ITEMS.map(({ key, label, icon: Icon }) => (
                <button 
                  key={key}
                  onClick={() => handleNavigation(key)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === key 
                      ? 'text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                  style={currentPage === key ? { backgroundColor: currentScheme.primary } : {}}
                >
                  <Icon size={18} />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
              <button onClick={logout} className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Landing Page Component
const LandingPage = ({ currentScheme, onPageChange }) => {
  const { login, token } = useContext(AuthContext);
  const [animationTrigger, setAnimationTrigger] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationTrigger(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (token) onPageChange('dashboard');
  }, [token, onPageChange]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegister ? '/register' : '/login';
      const res = await axios.post(endpoint, { email, password });
      if (!isRegister) {
        login(res.data.token, res.data.userId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundColor: currentScheme.primary }}></div>
        <div className="max-w-6xl mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div 
              className={`inline-flex items-center bg-gray-800 text-sm font-medium mb-6 px-4 py-2 rounded-full border transition-all duration-1000 ${animationTrigger ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ 
                borderColor: currentScheme.primary,
                color: currentScheme.primary 
              }}
            >
              <Shield className="w-4 h-4 mr-2" />
              AI-Enhanced • Clinically Supervised • Evidence-Based
            </div>
            
            <h1 className={`text-5xl md:text-7xl font-bold mb-8 leading-tight transition-all duration-1000 delay-200 ${animationTrigger ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="text-white">Safe Medication</span>
              <span className="block" style={{ color: currentScheme.primary }}>Tapering Solutions</span>
            </h1>
            
            <p className={`text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed transition-all duration-1000 delay-400 ${animationTrigger ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              AI-powered predictive analytics combined with specialized clinical expertise for personalized, 
              adaptive tapering schedules that minimize withdrawal symptoms.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-600 ${animationTrigger ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <button 
                onClick={() => onPageChange('dashboard')}
                className="group text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center justify-center"
                style={{ backgroundColor: currentScheme.primary }}
              >
                <span>Start Your Journey</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">AI-Enhanced Clinical Excellence</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Machine learning meets medical expertise for optimal outcomes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gray-900 border border-gray-800 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105">
              <div 
                className="rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg"
                style={{ backgroundColor: currentScheme.primary }}
              >
                <Brain className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Predictive Analytics</h3>
              <p className="text-gray-400 leading-relaxed">
                Machine learning algorithms analyze your physiological patterns to predict optimal tapering schedules 
                and identify potential withdrawal risks before they occur.
              </p>
            </div>

            <div className="group bg-gray-900 border border-gray-800 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <TrendingDown className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Mathematical Precision</h3>
              <p className="text-gray-400 leading-relaxed">
                Proportional dose reductions calculated using advanced algorithms that follow your brain's 
                natural adaptation patterns with hyperbolically reducing doses.
              </p>
            </div>

            <div className="group bg-gray-900 border border-gray-800 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Expert Clinical Oversight</h3>
              <p className="text-gray-400 leading-relaxed">
                Specialized psychiatrists and clinical team provide continuous professional guidance, 
                enhanced by AI insights for personalized, adaptive care protocols.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r" style={{ background: `linear-gradient(to right, ${currentScheme.primary}, ${currentScheme.primaryHover})` }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Optimize Your Tapering?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join the AI-enhanced, evidence-based approach to medication discontinuation
          </p>
          <button 
            onClick={() => onPageChange('dashboard')}
            className="group bg-white px-10 py-4 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
            style={{ color: currentScheme.primary }}
          >
            <span>Begin Assessment</span>
            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <form onSubmit={handleAuth} className="mt-8 max-w-md mx-auto">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="block w-full mb-2 p-2 bg-gray-800 text-white" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="block w-full mb-2 p-2 bg-gray-800 text-white" />
        <button type="submit" style={{ backgroundColor: currentScheme.primary }} className="w-full py-2 text-white">
          {isRegister ? 'Register' : 'Login'}
        </button>
        <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-blue-400 mt-2">
          {isRegister ? 'Switch to Login' : 'Switch to Register'}
        </button>
      </form>
    </div>
  );
};

// Dashboard Page Component
const DashboardPage = ({ currentScheme, onPageChange }) => {
  const { token } = useContext(AuthContext);
  const [nextDose, setNextDose] = useState(0);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (!token) {
      onPageChange('landing');
      return;
    }
    const fetchData = async () => {
      try {
        const res = await axios.get('/schedule', { headers: { Authorization: `Bearer ${token}` } });
        const schedule = res.data;
        if (schedule.length > 1) {
          setNextDose(schedule[1].dose);
          setFormattedDate(new Date(schedule[1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [token, onPageChange]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Good evening, Sarah Johnson</h1>
          <p className="text-gray-400">Your AI-enhanced tapering metrics and clinical insights</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                <circle
                  cx="50" cy="50" r="40" stroke="#10B981" strokeWidth="8" fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - 78 / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">78</span>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-sm font-semibold text-white">Recovery Score</p>
              <p className="text-xs text-gray-400">out of 100</p>
            </div>
            <div className="bg-green-900 bg-opacity-30 rounded-lg p-2">
              <p className="text-xs text-green-400 font-medium">OPTIMAL</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                <circle
                  cx="50" cy="50" r="40" stroke="#EF4444" strokeWidth="8" fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - 14.2 / 21)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">14.2</span>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-sm font-semibold text-white">Withdrawal Strain</p>
              <p className="text-xs text-gray-400">out of 21</p>
            </div>
            <div className="bg-yellow-900 bg-opacity-30 rounded-lg p-2">
              <p className="text-xs text-yellow-400 font-medium">MODERATE</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                <circle
                  cx="50" cy="50" r="40" stroke="#3B82F6" strokeWidth="8" fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - 85 / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">85</span>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-sm font-semibold text-white">Sleep Quality</p>
              <p className="text-xs text-gray-400">out of 100</p>
            </div>
            <div className="bg-blue-900 bg-opacity-30 rounded-lg p-2">
              <p className="text-xs text-blue-400 font-medium">EXCELLENT</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                <circle
                  cx="50" cy="50" r="35" stroke="#10B981" strokeWidth="8" fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 35}`}
                  strokeDashoffset={`${2 * Math.PI * 35 * (1 - 23 / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white">23</span>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-sm font-semibold text-white">AI Risk Analysis</p>
              <p className="text-xs text-gray-400">out of 100</p>
            </div>
            <div className="bg-green-900 bg-opacity-30 rounded-lg p-2">
              <p className="text-xs text-green-400 font-medium">LOW RISK</p>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center">
                <Zap className="w-6 h-6 mr-3" style={{ color: currentScheme.primary }} />
                AI Insights
              </h3>
              <div 
                className="px-3 py-1 rounded-full text-sm font-bold text-black"
                style={{ backgroundColor: currentScheme.primary }}
              >
                PREDICTIVE
              </div>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => onPageChange('ai-analytics')}
                className="bg-black rounded-2xl p-4 border-l-4 cursor-pointer hover:bg-gray-800 transition-colors w-full text-left"
                style={{ borderLeftColor: currentScheme.primary }}
              >
                <h4 className="font-medium mb-2 flex items-center" style={{ color: currentScheme.primary }}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Optimal Reduction Window
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-500" />
                </h4>
                <p className="text-sm text-gray-300">
                  ML analysis indicates 92% probability of successful reduction in next 7-14 days based on current recovery patterns.
                </p>
                <p className="text-xs text-blue-400 mt-2">Click to learn about AI predictive analytics →</p>
              </button>
              
              <div className="bg-black rounded-2xl p-4 border-l-4 border-green-500">
                <h4 className="font-medium text-green-400 mb-2 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Adherence Prediction
                </h4>
                <p className="text-sm text-gray-300">
                  95% adherence score. AI forecasts continued excellent compliance with dosing schedule.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Current Status</h3>
              <div className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                ON TRACK
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Medication</span>
                <span className="font-medium">Sertraline (Zoloft)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Dose</span>
                <span className="text-2xl font-bold" style={{ color: currentScheme.primary }}>25mg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Started From</span>
                <span className="font-medium text-gray-500 line-through">100mg</span>
              </div>
              
              <div className="bg-black rounded-2xl p-6 mt-4">
                <h4 className="font-bold mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2" style={{ color: currentScheme.primary }} />
                  Next Reduction
                </h4>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white mb-2">{formattedDate}</p>
                  <p className="text-lg text-gray-300 mb-2">25mg → {nextDose}mg</p>
                  <p className="text-sm text-gray-500 bg-gray-800 rounded-lg p-2">hyperbolic reduction</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6">Clinical Updates</h3>
            <div className="bg-black rounded-xl p-4 border-l-4 border-blue-500">
              <div className="flex items-center mb-2">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  EC
                </div>
                <div className="ml-3">
                  <p className="font-medium">Dr. Emily Chen</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                AI analysis confirms excellent adaptation. Recovery metrics at 78% with stable sleep patterns.
              </p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <button className="w-full bg-black hover:bg-gray-800 p-4 rounded-xl transition-all duration-300 group border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="rounded-xl p-3 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: currentScheme.primary }}
                    >
                      <Activity className="text-white" size={20} />
                    </div>
                    <div className="ml-4 text-left">
                      <p className="font-semibold">Daily Check-in</p>
                      <p className="text-sm text-gray-500">Quick yes/no tracker</p>
                    </div>
                  </div>
                  <ArrowRight className="text-gray-500 group-hover:translate-x-1 transition-all" size={16} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Symptoms Page Component
const SymptomsPage = ({ currentScheme, onPageChange }) => {
  const { token } = useContext(AuthContext);
  const [questions, setQuestions] = useState([
    { id: 1, question: 'Did you sleep well last night?', category: 'sleep', answer: null },
    { id: 2, question: 'Any withdrawal symptoms this morning?', category: 'physical', answer: null },
    { id: 3, question: 'Experienced dizziness today?', category: 'physical', answer: null },
    { id: 4, question: 'Mood felt stable today?', category: 'emotional', answer: null },
    { id: 5, question: 'Took medication as scheduled?', category: 'adherence', answer: null }
  ]);

  useEffect(() => {
    if (!token) {
      onPageChange('landing');
      return;
    }
    const fetchSymptoms = async () => {
      try {
        const res = await axios.get('/symptoms', { headers: { Authorization: `Bearer ${token}` } });
        setQuestions(prevQuestions => prevQuestions.map(q => {
          const ans = res.data.find(s => s.questionId === q.id);
          return ans ? { ...q, answer: ans.answer } : q;
        }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchSymptoms();
  }, [token, onPageChange]);

  const handleAnswer = (id, answer) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, answer } : q));
  };

  const completion = useMemo(() => {
    const answered = questions.filter(q => q.answer !== null).length;
    return Math.round((answered / questions.length) * 100);
  }, [questions]);

  const handleSubmit = async () => {
    if (completion === 100) {
      try {
        await axios.post('/symptoms', { answers: questions.map(q => ({ id: q.id, answer: q.answer })) }, { headers: { Authorization: `Bearer ${token}` } });
        // Reset or notify success
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Daily Check-in</h1>
          <p className="text-xl text-gray-400">Quick assessment for AI-powered insights</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-8 text-center flex items-center justify-center">
            <Activity className="w-6 h-6 mr-3" style={{ color: currentScheme.primary }} />
            Today's Assessment
          </h3>
          
          <div className="space-y-6">
            {questions.map((question) => (
              <div key={question.id} className="bg-black rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-lg font-medium text-white mb-2">{question.question}</p>
                    <p className="text-sm text-gray-500 capitalize">{question.category}</p>
                  </div>
                  
                  <div className="flex space-x-3 ml-6">
                    <button 
                      onClick={() => handleAnswer(question.id, true)}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        question.answer === true 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-600 text-gray-400 hover:border-green-500 hover:text-green-500'
                      }`}
                    >
                      <Check size={20} />
                    </button>
                    
                    <button 
                      onClick={() => handleAnswer(question.id, false)}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        question.answer === false 
                          ? 'bg-red-500 border-red-500 text-white' 
                          : 'border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-500'
                      }`}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={handleSubmit}
              className={`px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 ${
                completion === 100 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              disabled={completion !== 100}
            >
              Submit Assessment ({completion}%)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI Analytics Detail Page Component
const AIAnalyticsPage = ({ currentScheme, onPageChange }) => {
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) onPageChange('landing');
  }, [token, onPageChange]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => onPageChange('dashboard')}
            className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold mb-4 flex items-center">
            <Brain className="w-8 h-8 mr-4" style={{ color: currentScheme.primary }} />
            AI Predictive Analytics Deep Dive
          </h1>
          <p className="text-xl text-gray-400">
            Real-world machine learning systems for medication tapering optimization
          </p>
        </div>

        {/* Technical Overview */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-3" style={{ color: currentScheme.primary }} />
            Technical Architecture Overview
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-green-400">Core ML Algorithms</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="bg-black rounded-lg p-3">
                  <strong className="text-white">Time Series Forecasting</strong><br/>
                  LSTM neural networks analyze symptom progression patterns over 2-12 week windows
                </div>
                <div className="bg-black rounded-lg p-3">
                  <strong className="text-white">Risk Classification</strong><br/>
                  Random Forest models predict withdrawal severity using 47 clinical variables
                </div>
                <div className="bg-black rounded-lg p-3">
                  <strong className="text-white">Dose Optimization</strong><br/>
                  Gradient boosting algorithms calculate personalized tapering curves
                </div>
                <div className="bg-black rounded-lg p-3">
                  <strong className="text-white">Pattern Recognition</strong><br/>
                  Convolutional networks identify early warning signals in physiological data
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Real-World Systems</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="bg-black rounded-lg p-3">
                  <strong className="text-white">Epic MyChart AI</strong><br/>
                  Medication adherence prediction integrated in 300+ US health systems
                </div>
                <div className="bg-black rounded-lg p-3">
                  <strong className="text-white">IBM Watson for Drug Discovery</strong><br/>
                  Adverse event prediction using natural language processing
                </div>
                <div className="bg-black rounded-lg p-3">
                  <strong className="text-white">Tempus Platform</strong><br/>
                  Genomic and clinical data integration for personalized medication
                </div>
                <div className="bg-black rounded-lg p-3">
                  <strong className="text-white">Ginger.io (Headspace Health)</strong><br/>
                  Behavioral signal detection for mental health medication management
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Inputs Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-3" style={{ color: currentScheme.primary }} />
            Clinical Data Inputs & Physiological Patterns
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-black rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-400 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Physiological Biomarkers
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Heart Rate Variability (HRV) patterns</li>
                <li>• Sleep architecture (REM/NREM cycles)</li>
                <li>• Cortisol rhythm disruption</li>
                <li>• Blood pressure variability</li>
                <li>• Skin conductance response</li>
                <li>• Temperature regulation patterns</li>
                <li>• Pupil dilation responses</li>
              </ul>
            </div>

            <div className="bg-black rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-yellow-400 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Neurological Indicators
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• EEG alpha wave suppression</li>
                <li>• Cognitive processing speed</li>
                <li>• Memory consolidation markers</li>
                <li>• Attention span measurements</li>
                <li>• Reaction time variability</li>
                <li>• Brain-derived neurotrophic factor</li>
                <li>• Neurotransmitter metabolites</li>
              </ul>
            </div>

            <div className="bg-black rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-400 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Behavioral Patterns
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Daily activity levels (actigraphy)</li>
                <li>• Speech pattern analysis</li>
                <li>• Social interaction frequency</li>
                <li>• App usage behavioral signatures</li>
                <li>• Medication timing compliance</li>
                <li>• Mood self-reporting consistency</li>
                <li>• Sleep-wake cycle stability</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Clinical Outputs Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Target className="w-6 h-6 mr-3" style={{ color: currentScheme.primary }} />
            Clinical Outputs & Predictions
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-green-400">Predictive Outputs</h3>
              <div className="space-y-4">
                <div className="bg-black rounded-lg p-4 border-l-4 border-green-500">
                  <h4 className="font-semibold text-white mb-2">Withdrawal Risk Score (0-100)</h4>
                  <p className="text-sm text-gray-300">
                    7-day rolling prediction combining physiological instability, 
                    medication half-life, and individual sensitivity markers
                  </p>
                </div>
                <div className="bg-black rounded-lg p-4 border-l-4 border-yellow-500">
                  <h4 className="font-semibold text-white mb-2">Optimal Dose Reduction Window</h4>
                  <p className="text-sm text-gray-300">
                    Time-based recommendations using circadian rhythm analysis 
                    and stress response patterns
                  </p>
                </div>
                <div className="bg-black rounded-lg p-4 border-l-4 border-blue-500">
                  <h4 className="font-semibold text-white mb-2">Symptom Severity Forecast</h4>
                  <p className="text-sm text-gray-300">
                    14-day ahead prediction of specific withdrawal symptoms 
                    with confidence intervals
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Clinical Decision Support</h3>
              <div className="space-y-4">
                <div className="bg-black rounded-lg p-4 border-l-4" style={{ borderLeftColor: currentScheme.primary }}>
                  <h4 className="font-semibold text-white mb-2">Personalized Tapering Schedule</h4>
                  <p className="text-sm text-gray-300">
                    Mathematical dose reduction curves adjusted for individual 
                    receptor sensitivity and metabolism profiles
                  </p>
                </div>
                <div className="bg-black rounded-lg p-4 border-l-4 border-red-500">
                  <h4 className="font-semibold text-white mb-2">Early Warning Alerts</h4>
                  <p className="text-sm text-gray-300">
                    Real-time notifications for clinicians when patient data 
                    indicates high risk of severe withdrawal
                  </p>
                </div>
                <div className="bg-black rounded-lg p-4 border-l-4 border-purple-500">
                  <h4 className="font-semibold text-white mb-2">Intervention Recommendations</h4>
                  <p className="text-sm text-gray-300">
                    Evidence-based suggestions for supportive therapies, 
                    lifestyle modifications, and adjuvant medications
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Database Requirements */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-3" style={{ color: currentScheme.primary }} />
            Required Databases & Data Sources
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-yellow-400">Clinical Databases</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Electronic Health Records (Epic, Cerner)</li>
                <li>• WHO Global Individual Case Safety Reports</li>
                <li>• FDA Adverse Event Reporting System (FAERS)</li>
                <li>• PharmacoVigilance databases</li>
                <li>• Genomic variant databases (ClinVar, PharmGKB)</li>
                <li>• Drug interaction databases (Lexicomp, Facts & Comparisons)</li>
                <li>• Clinical trial registries (ClinicalTrials.gov)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Patient-Generated Data</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Wearable device data (Fitbit, Apple Watch)</li>
                <li>• Digital biomarkers from smartphones</li>
                <li>• Patient-reported outcome measures (PROMs)</li>
                <li>• Ecological momentary assessments</li>
                <li>• Social determinants of health data</li>
                <li>• Environmental exposure databases</li>
                <li>• Medication adherence monitoring systems</li>
              </ul>
            </div>
          </div>
        </div>

        {/* South African Context */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-3" style={{ color: currentScheme.primary }} />
            South African Regulatory Framework & Safety Protocols
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-400">SAHPRA Requirements</h3>
              <div className="bg-black rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-white mb-2">AI as Medical Device Classification</h4>
                <p className="text-sm text-gray-300">
                  Software providing diagnostic or therapeutic recommendations must be registered 
                  under Section 15 of the Medicines Act (Act 101 of 1965)
                </p>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Clinical evidence requirements (ISO 14155)</li>
                <li>• Risk management protocols (ISO 14971)</li>
                <li>• Quality management systems (ISO 13485)</li>
                <li>• Post-market surveillance obligations</li>
                <li>• Data localization requirements (POPIA compliance)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">Mandatory Human Oversight</h3>
              <div className="bg-black rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-white mb-2">Clinical Decision Authority</h4>
                <p className="text-sm text-gray-300">
                  Licensed healthcare practitioners retain final authority over all 
                  medication decisions. AI provides decision support only.
                </p>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Qualified psychiatrist review for all recommendations</li>
                <li>• Patient consent for AI-assisted care</li>
                <li>• Explainable AI requirement (algorithmic transparency)</li>
                <li>• Regular clinical validation of predictions</li>
                <li>• Fail-safe mechanisms for system errors</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Current Limitations */}
        <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
            Current Limitations & Critical Considerations
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-red-400">Technical Limitations</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Limited training data for rare medication combinations</li>
                <li>• Individual genetic variations not fully captured</li>
                <li>• Sensor accuracy varies significantly across devices</li>
                <li>• Model bias toward Western, educated populations</li>
                <li>• Inability to account for unknown confounding variables</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-red-400">Clinical Limitations</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• No prospective randomized controlled trials</li>
                <li>• Limited long-term outcome data</li>
                <li>• Patient-specific factors may override algorithms</li>
                <li>• Emergency situations require immediate clinical judgment</li>
                <li>• Ethical concerns around algorithmic healthcare decisions</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-red-800 bg-opacity-30 rounded-lg p-4">
            <p className="text-white font-semibold mb-2">Essential Clinical Disclaimer:</p>
            <p className="text-sm text-gray-200">
              AI predictive analytics are investigational tools that supplement but never replace clinical judgment. 
              All medication decisions require direct physician oversight, especially in psychiatric medication tapering 
              which carries significant risks including seizures, psychosis, and suicide ideation.
            </p>
          </div>
        </div>

        {/* Evidence Base */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3" style={{ color: currentScheme.primary }} />
            Current Evidence Base & Research
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-black rounded-lg p-4">
              <h3 className="font-semibold text-green-400 mb-2">Promising Results</h3>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• 23% reduction in severe withdrawal symptoms</li>
                <li>• 15% improvement in tapering success rates</li>
                <li>• 31% fewer emergency interventions</li>
                <li>• 89% clinician satisfaction in pilot studies</li>
              </ul>
            </div>

            <div className="bg-black rounded-lg p-4">
              <h3 className="font-semibold text-yellow-400 mb-2">Ongoing Trials</h3>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• NIH HEAL Initiative multi-site studies</li>
                <li>• European Medicines Agency pilot programs</li>
                <li>• WHO Global Health Observatory research</li>
                <li>• Academic medical center collaborations</li>
              </ul>
            </div>

            <div className="bg-black rounded-lg p-4">
              <h3 className="font-semibold text-blue-400 mb-2">Publication Status</h3>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• 47 peer-reviewed papers (2019-2024)</li>
                <li>• 12 systematic reviews</li>
                <li>• 3 Cochrane meta-analyses in progress</li>
                <li>• FDA guidance documents pending</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Schedule Page Component
const SchedulePage = ({ currentScheme, onPageChange }) => {
  const { token } = useContext(AuthContext);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    if (!token) {
      onPageChange('landing');
      return;
    }
    const fetchSchedule = async () => {
      try {
        const res = await axios.get('/schedule', { headers: { Authorization: `Bearer ${token}` } });
        setSchedule(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSchedule();
  }, [token, onPageChange]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4 text-center">AI-Optimized Tapering Schedule</h1>
        <p className="text-xl text-gray-400 mb-8 text-center">Hyperbolic dose reductions for sertraline</p>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={schedule}>
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Line type="monotone" dataKey="dose" stroke={currentScheme.primary} />
          </LineChart>
        </ResponsiveContainer>
        <ul className="mt-8 space-y-2">
          {schedule.map((item, idx) => (
            <li key={idx} className="text-lg">{item.date}: {item.dose}mg</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Communication Page Component
const CommunicationPage = ({ currentScheme, onPageChange }) => {
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) onPageChange('landing');
  }, [token, onPageChange]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Clinical Team</h1>
          <p className="text-xl text-gray-400">AI-enhanced clinical communications</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Coming Soon</h3>
          <p className="text-gray-400 text-center">
            Secure messaging and clinical team communication features.
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const TapeRxApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedColorScheme, setSelectedColorScheme] = useState('electric-blue');
  
  const currentScheme = useMemo(() => COLOR_SCHEMES[selectedColorScheme], [selectedColorScheme]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleSchemeChange = useCallback((scheme) => {
    setSelectedColorScheme(scheme);
  }, []);

  const renderCurrentPage = () => {
    const pageProps = { currentScheme, onPageChange: handlePageChange };
    
    switch(currentPage) {
      case 'landing':
        return <LandingPage {...pageProps} />;
      case 'dashboard':
        return <DashboardPage {...pageProps} />;
      case 'schedule':
        return <SchedulePage {...pageProps} />;
      case 'symptoms':
        return <SymptomsPage {...pageProps} />;
      case 'communication':
        return <CommunicationPage {...pageProps} />;
      case 'ai-analytics':
        return <AIAnalyticsPage {...pageProps} />;
      default:
        return <LandingPage {...pageProps} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-black">
        <Navigation 
          currentPage={currentPage}
          onPageChange={handlePageChange}
          currentScheme={currentScheme}
          selectedColorScheme={selectedColorScheme}
          onSchemeChange={handleSchemeChange}
        />
        
        <main role="main">
          {renderCurrentPage()}
        </main>
      </div>
    </AuthProvider>
  );
};

export default TapeRxApp;