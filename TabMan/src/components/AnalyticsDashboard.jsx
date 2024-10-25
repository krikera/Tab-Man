import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import DOMPurify from 'dompurify';

const AnalyticsDashboard = () => {
  const [tabUsageData, setTabUsageData] = useState({});

  useEffect(() => {
    chrome.storage.local.get('tabUsageData', (result) => {
      if (result.tabUsageData) {
        setTabUsageData(result.tabUsageData);
      }
    });
  }, []);

  const prepareChartData = () => {
    const labels = [];
    const timeSpentData = [];
    const visitCountData = [];

    Object.entries(tabUsageData).forEach(([tabId, data]) => {
      labels.push(DOMPurify.sanitize(data.title) || `Tab ${tabId}`); // Use the tab title if available
      timeSpentData.push(data.timeSpent / 1000); // Convert ms to seconds
      visitCountData.push(data.visitCount);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Time Spent (seconds)',
          data: timeSpentData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Visit Count',
          data: visitCountData,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
      ],
    };
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tab Usage Analytics</h2>
      <div className="chart-container">
        <Bar data={prepareChartData()} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;