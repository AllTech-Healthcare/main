import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Activity, Check, X } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';

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
        setQuestions(questions.map(q => {
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

export default SymptomsPage;