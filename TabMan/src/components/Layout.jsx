import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import DOMPurify from 'dompurify';

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {

    chrome.storage.sync.get('darkMode', (result) => {
      const darkModePref = result.darkMode || false;
      setDarkMode(darkModePref);
      if (darkModePref) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }, []);

  const handleSearch = (query) => {

    const sanitizedQuery = DOMPurify.sanitize(query);
    setSearchQuery(sanitizedQuery);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    chrome.storage.sync.set({ darkMode: newDarkMode });
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    console.log('Dark mode toggled:', newDarkMode);
  };

  return (
    <div className="w-96 p-6 mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Tab Man</h1>
        <button
          className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          onClick={toggleDarkMode}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <SearchBar onSearch={handleSearch} />

    </div>
  );
};

export default Layout;