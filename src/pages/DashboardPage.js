import React, { useState, useEffect, useContext } from 'react';
import { BarChart3, Target, Activity, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';

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
              <p className="text-xs text-blue-400 font-medium">GOOD</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                <circle
                  cx="50" cy="50" r="40" stroke="#8B5CF6" strokeWidth="8" fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - 6 / 10)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">6</span>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-sm font-semibold text-white">Mood Quality</p>
              <p className="text-xs text-gray-400">out of 10</p>
            </div>
            <div className="bg-purple-900 bg-opacity-30 rounded-lg p-2">
              <p className="text-xs text-purple-400 font-medium">STABLE</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">AI-Enhanced Insights</h3>
              
              <button 
                onClick={() => onPageChange('ai-analytics')}
                className="w-full bg-black rounded-2xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 text-left group"
              >
                <h4 className="font-medium text-blue-400 mb-3 flex items-center">
                  <div className="bg-blue-600 rounded-xl p-2 mr-3 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  Predictive Analytics
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

export default DashboardPage;