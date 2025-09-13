import { Calendar, Home, Activity, MessageCircle } from 'lucide-react';

export const COLOR_SCHEMES = {
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

export const NAVIGATION_ITEMS = [
  { key: 'dashboard', label: 'Overview', icon: Home },
  { key: 'schedule', label: 'Schedule', icon: Calendar },
  { key: 'symptoms', label: 'Daily', icon: Activity },
  { key: 'communication', label: 'Clinical', icon: MessageCircle }
];