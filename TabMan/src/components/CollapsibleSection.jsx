import React, { useState } from 'react';
import DOMPurify from 'dompurify';

const CollapsibleSection = ({ title, icon, tabs }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300">
      <button
        className="flex justify-between items-center w-full p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors rounded-t-lg"
        onClick={toggleOpen}
      >
        <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
          {icon}
          <span className="text-lg font-semibold">{title}</span>
        </div>
        <span className="text-xl font-bold text-gray-600 dark:text-gray-300">{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && (
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 rounded-b-lg">
          {tabs.length === 0 ? (
            <p className="text-center text-gray-500">No tabs available</p>
          ) : (
            tabs.map((tab) => (
              <div key={tab.id} className="mb-3">
                <a
                  href={DOMPurify.sanitize(tab.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {DOMPurify.sanitize(tab.title) || DOMPurify.sanitize(tab.url)}
                </a>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;