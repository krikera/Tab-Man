import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Layout from './components/Layout';
import TabList from './components/TabList';
import AnalyticsDashboard from './components/AnalyticsDashboard';

const Popup = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <Layout />

      <button
        className="p-2 bg-blue-500 text-white rounded mb-4"
        onClick={() => setShowAnalytics(!showAnalytics)}
      >
        {showAnalytics ? 'Back to Tabs' : 'Show Analytics'}
      </button>

      {showAnalytics ? <AnalyticsDashboard /> : <TabList />}
    </div>
  );
};



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Popup />);
