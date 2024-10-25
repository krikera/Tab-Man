import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaFacebook, FaBook, FaPlusCircle, FaTrash, FaSadCry } from 'react-icons/fa';
import CollapsibleSection from './CollapsibleSection';
import tabCategories from '../tabCategories';
import DOMPurify from 'dompurify';
import escapeHtml from 'escape-html';

const TabList = () => {
  const [tabs, setTabs] = useState([]);
  const [savedTabs, setSavedTabs] = useState([]);
  const [groupedTabs, setGroupedTabs] = useState({ Work: [], Social: [], Research: [] });
  const [customCategories, setCustomCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [categoryColors, setCategoryColors] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTab, setSelectedTab] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const defaultColors = {
    Work: '#FF6347',
    Social: '#1E90FF',
    Research: '#32CD32',
  };

  useEffect(() => {
    chrome.tabs.query({}, (tabs) => {
      const categorizedTabs = tabs.map((tab) => ({
        ...tab,
        category: categorizeTabs(tab),
      }));

      const grouped = {
        Work: [],
        Social: [],
        Research: [],
      };

      categorizedTabs.forEach((tab) => {
        grouped[tab.category].push(tab);
      });

      setGroupedTabs(grouped);
      setTabs(categorizedTabs);

      chrome.storage.local.get(['savedTabs', 'customCategories', 'categoryColors', 'groupedTabs'], (result) => {
        if (result.savedTabs) setSavedTabs(result.savedTabs);
        if (result.customCategories) setCustomCategories(result.customCategories);
        if (result.categoryColors) {
          setCategoryColors(result.categoryColors);
        } else {
          setCategoryColors(defaultColors);
        }

        const fetchedGroupedTabs = result.groupedTabs || { Work: [], Social: [], Research: [] };
        setGroupedTabs({
          Work: fetchedGroupedTabs.Work || [],
          Social: fetchedGroupedTabs.Social || [],
          Research: fetchedGroupedTabs.Research || [],
          ...fetchedGroupedTabs,
        });
      });
    });
  }, []);

  const categorizeTabs = (tab) => {
    if (!tab || !tab.url) return 'Research';
    const url = tab.url.toLowerCase();
    for (const category in tabCategories) {
      if (tabCategories[category].some(keyword => url.includes(keyword))) {
        return category;
      }
    }
    return 'Research';
  };

  const saveTabToBookmarks = (tab) => {
    chrome.bookmarks.create({
      title: tab.title,
      url: escapeHtml(tab.url),
    }, () => {
      alert('Tab saved as bookmark!');
    });
  };

  const handlePinTab = (tabId, shouldPin) => {
    chrome.tabs.update(tabId, { pinned: shouldPin });
  };

  const saveTab = (tab) => {
    const newSavedTabs = [...savedTabs, tab];
    setSavedTabs(newSavedTabs);
    chrome.storage.local.set({ savedTabs: newSavedTabs });
  };

  const addCustomCategory = () => {
    if (newCategory.trim() === '') return;

    const newCustomCategories = [...customCategories, DOMPurify.sanitize(newCategory)];
    setCustomCategories(newCustomCategories);
    chrome.storage.local.set({ customCategories: newCustomCategories });

    setNewCategory('');
    setIsCreatingCategory(false);
  };

  const handleCategoryColorChange = (category, color) => {
    const updatedCategoryColors = { ...categoryColors, [category]: color };
    setCategoryColors(updatedCategoryColors);
    chrome.storage.local.set({ categoryColors: updatedCategoryColors });
  };

  const assignTabToCategory = (tabId, category) => {
    chrome.tabs.get(tabId, (tab) => {
      const updatedTab = { ...tab, category };
      const updatedGroupedTabs = { ...groupedTabs };

      Object.keys(updatedGroupedTabs).forEach((cat) => {
        updatedGroupedTabs[cat] = updatedGroupedTabs[cat].filter((t) => t.id !== tabId);
      });

      updatedGroupedTabs[category].push(updatedTab);
      setGroupedTabs(updatedGroupedTabs);
      chrome.storage.local.set({ groupedTabs: updatedGroupedTabs });
    });
  };

  const deleteTabFromCategory = (tabId, category) => {
    const updatedGroupedTabs = { ...groupedTabs };
    updatedGroupedTabs[category] = updatedGroupedTabs[category].filter((tab) => tab.id !== tabId);
    setGroupedTabs(updatedGroupedTabs);
    chrome.storage.local.set({ groupedTabs: updatedGroupedTabs });
  };

  const deleteCustomCategory = (category) => {
    const updatedCustomCategories = customCategories.filter((cat) => cat !== category);
    setCustomCategories(updatedCustomCategories);

    const updatedGroupedTabs = { ...groupedTabs };
    if (updatedGroupedTabs[category]) {
      updatedGroupedTabs.Research = [...updatedGroupedTabs.Research, ...updatedGroupedTabs[category]];
      delete updatedGroupedTabs[category];
    }
    setGroupedTabs(updatedGroupedTabs);
    chrome.storage.local.set({ groupedTabs: updatedGroupedTabs, customCategories: updatedCustomCategories });
  };

  const filterTabs = () => {
    return Object.values(groupedTabs).flat().filter((tab) => {
      const matchesQuery = tab.title.toLowerCase().includes(DOMPurify.sanitize(searchQuery).toLowerCase()) || tab.url.toLowerCase().includes(DOMPurify.sanitize(searchQuery).toLowerCase());
      const matchesCategory = selectedCategory ? tab.category === selectedCategory : true;
      const matchesPinned = isPinned ? tab.pinned : true;
      return matchesQuery && matchesCategory && matchesPinned;
    });
  };

  const TabItem = ({ tab, categoryIcon, categoryColor, category }) => (
    <div
      className="p-4 mb-3 border rounded-lg shadow hover:shadow-lg transition-shadow duration-300 flex justify-between items-center"
      style={{ backgroundColor: categoryColor || '#FFFFFF' }}
    >
      <div className="flex items-center space-x-2">
        {categoryIcon}
        <a href={escapeHtml(tab.url)} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {tab.title || escapeHtml(tab.url)}
        </a>
      </div>
      <div className="flex space-x-2">
        <button
          className={`p-2 rounded ${tab.pinned ? 'bg-yellow-500' : 'bg-gray-300'} hover:bg-yellow-600 text-white font-semibold`}
          onClick={() => handlePinTab(tab.id, !tab.pinned)}
        >
          {tab.pinned ? 'Unpin' : 'Pin'}
        </button>
        <button
          className="p-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded"
          onClick={() => deleteTabFromCategory(tab.id, tab.category)}
        >
          Delete
        </button>
        <button
          className="p-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded"
          onClick={() => saveTabToBookmarks(tab)}
        >
          Save as Bookmark
        </button>
      </div>
    </div>
  );

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);

    if (value === 'new') {
      setIsCreatingCategory(true);
    } else {
      setIsCreatingCategory(false);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Manage Tabs</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(DOMPurify.sanitize(e.target.value))}
          className="p-2 border rounded w-full"
          placeholder="Search tabs..."
        />
      </div>

      {/* Filter Options */}
      <div className="mb-4 flex items-center">
        <label className="mr-2">
          <input
            type="checkbox"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
          />
          Show Pinned Tabs
        </label>

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded ml-4"
        >
          <option value=""> All Categories</option>
          {Object.keys(groupedTabs).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
          {customCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
          <option value="new">Create a New Category</option>
        </select>
      </div>

      {/* Dropdown for selecting a tab */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Select a Tab</h3>
        <select
          value={selectedTab}
          onChange={(e) => setSelectedTab(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="" disabled>Select a tab</option>
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.title || escapeHtml(tab.url)}
            </option>
          ))}
        </select>
      </div>


      <div className="mb-4">
        <h3 className="text-lg font-semibold">Select a Category</h3>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded"
        >
          <option value="" disabled>Select a category</option>
          {Object.keys(groupedTabs).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
          {customCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
          <option value="new">Create a New Category</option>
        </select>
      </div>


      {isCreatingCategory && (
        <div className="mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(DOMPurify.sanitize(e.target.value))}
            className="p-2 border rounded"
            placeholder="Enter new category"
          />
          <button
            className="ml-2 p-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded"
            onClick={addCustomCategory}
          >
            Add Category
          </button>
        </div>
      )}


      <button
        onClick={() => selectedTab && selectedCategory && assignTabToCategory(parseInt(selectedTab, 10), selectedCategory)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={!selectedTab || !selectedCategory}
      >
        Assign Tab to Category
      </button>


      {filterTabs().map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          category={tab.category}
          categoryColor={categoryColors[tab.category]}
          categoryIcon={
            tab.category === 'Work' ? <FaBriefcase /> :
              tab.category === 'Social' ? <FaFacebook /> : <FaBook />
          }
        />
      ))}


      {Object.keys(groupedTabs).map((category) => (
        <div key={category} className="mb-6">
          <CollapsibleSection
            title={category}
            tabs={groupedTabs[category]}
            icon={
              category === 'Work' ? <FaBriefcase /> :
                category === 'Social' ? <FaFacebook /> : <FaBook />
            }
            categoryColor={categoryColors[category] || defaultColors[category]}
            onCategoryColorChange={handleCategoryColorChange}
          >
            {(groupedTabs[category] || []).map((tab) => (
              <TabItem
                key={tab.id}
                tab={tab}
                category={category}
                categoryColor={categoryColors[category]}
                categoryIcon={
                  category === 'Work' ? <FaBriefcase /> :
                    category === 'Social' ? <FaFacebook /> : <FaBook />
                }
              />
            ))}

            {customCategories.includes(category) && (
              <button
                className="mt-4 p-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded"
                onClick={() => deleteCustomCategory(category)}
              >
                Delete Category
              </button>
            )}
          </CollapsibleSection>
        </div>
      ))}
    </div>
  );
};
export default TabList;