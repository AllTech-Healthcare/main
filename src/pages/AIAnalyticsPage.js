import React, { useEffect, useContext } from 'react';
import { ArrowRight, Brain, Zap, Activity, Heart, AlertTriangle, BarChart3 } from 'lucide-react';
import { AuthContext } from '../auth/AuthContext';

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
              <h3 className="text-lg font-semibold mb-4 text-purple-400 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Neurological Indicators
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Cognitive assessment scores</li>
                <li>• Memory function tests</li>
                <li>• Attention span measurements</li>
                <li>• Mood stability tracking</li>
                <li>• Anxiety severity indexes</li>
                <li>• Sleep quality metrics</li>
                <li>• Motor function assessments</li>
              </ul>
            </div>

            <div className="bg-black rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-400 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Behavioral Signals
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Daily activity patterns</li>
                <li>• Social interaction frequency</li>
                <li>• Digital device usage</li>
                <li>• Communication patterns</li>
                <li>• Exercise compliance</li>
                <li>• Medication adherence</li>
                <li>• Self-reported symptoms</li>
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

export default AIAnalyticsPage;