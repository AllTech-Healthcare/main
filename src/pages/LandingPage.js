import React, { useState, useEffect, useContext } from 'react';
import { Shield, Brain, TrendingDown, Users, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';

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

export default LandingPage;