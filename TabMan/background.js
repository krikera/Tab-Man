let activeTabId = null;
let tabUsageData = {};


chrome.tabs.onCreated.addListener((tab) => {
  const currentTime = Date.now();
  chrome.storage.local.get('tabTimestamps', (result) => {
    const tabTimestamps = result.tabTimestamps || {};
    tabTimestamps[tab.id] = currentTime;
    chrome.storage.local.set({ tabTimestamps });
  });
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const now = Date.now();

    chrome.storage.local.get('tabUsageData', (result) => {
      const storedTabUsageData = result.tabUsageData || {};

      if (storedTabUsageData[tabId]) {

        storedTabUsageData[tabId].title = tab.title || storedTabUsageData[tabId].title;
        storedTabUsageData[tabId].lastActivated = now;
      } else {

        storedTabUsageData[tabId] = {
          title: tab.title || 'Untitled',
          timeSpent: 0,
          visitCount: 1,
          lastActivated: now,
        };
      }


      chrome.storage.local.set({ tabUsageData: storedTabUsageData });
    });
  }
});


chrome.tabs.onRemoved.addListener((tabId) => {
  const now = Date.now();


  chrome.storage.local.get(['tabTimestamps', 'tabUsageData'], (result) => {
    const tabTimestamps = result.tabTimestamps || {};
    const storedTabUsageData = result.tabUsageData || {};

    if (tabTimestamps[tabId]) delete tabTimestamps[tabId];

    if (storedTabUsageData[tabId]) {
      const tabData = storedTabUsageData[tabId];
      tabData.timeSpent += now - tabData.lastActivated;
      delete storedTabUsageData[tabId];
    }


    chrome.storage.local.set({ tabTimestamps, tabUsageData: storedTabUsageData });
  });
});


chrome.tabs.onActivated.addListener((activeInfo) => {
  const { tabId } = activeInfo;
  const now = Date.now();


  if (activeTabId !== null) {
    chrome.storage.local.get('tabUsageData', (result) => {
      const storedTabUsageData = result.tabUsageData || {};

      if (storedTabUsageData[activeTabId]) {
        const tabData = storedTabUsageData[activeTabId];
        tabData.timeSpent += now - tabData.lastActivated;
      }


      activeTabId = tabId;
      if (!storedTabUsageData[tabId]) {
        storedTabUsageData[tabId] = { title: 'Untitled', timeSpent: 0, visitCount: 1, lastActivated: now };
      } else {
        storedTabUsageData[tabId].visitCount += 1;
      }


      chrome.tabs.get(tabId, (tab) => {
        if (tab && tab.title) {
          storedTabUsageData[tabId].title = tab.title;
        }
        storedTabUsageData[tabId].lastActivated = now;

        chrome.storage.local.set({ tabUsageData: storedTabUsageData });
      });
    });
  }
});


chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE && activeTabId !== null) {
    const now = Date.now();

    chrome.storage.local.get('tabUsageData', (result) => {
      const storedTabUsageData = result.tabUsageData || {};

      if (storedTabUsageData[activeTabId]) {
        const tabData = storedTabUsageData[activeTabId];
        tabData.timeSpent += now - tabData.lastActivated;
        activeTabId = null;


        chrome.storage.local.set({ tabUsageData: storedTabUsageData });
      }
    });
  }
});