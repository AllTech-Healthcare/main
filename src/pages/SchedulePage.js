import React, { useState, useEffect, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';

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

export default SchedulePage;