# TabMan
A Chrome extension designed to help users manage and organize their browser tabs efficiently. TabMan allows users to categorize tabs, save their sessions for future use, analyze browsing habits, and improve productivity.

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Technical Stack](#technical-stack)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Project Structure](#project-structure)
7. [Feature Details](#feature-details)
8. [Customization](#customization)
9. [Troubleshooting](#troubleshooting)
10. [Contributing](#contributing)
11. [Contact](#contact)

## Overview
TabMan is a user-friendly Chrome extension that enhances productivity by allowing users to categorize and save tabs, track usage patterns, and access frequently visited websites. This tool aims to declutter the browsing experience and facilitate better tab management, making it ideal for professionals, students, and anyone who uses multiple tabs daily.

## Features
- **Tab Categorization**: Organize tabs into customizable categories for quick access.
- **Session Saving**: Save and restore current tabs for seamless workflow.
- **Tab Usage Analytics**: Analyze browsing patterns, including most visited sites and time spent on each.
- **Bookmark Integration**: Convert saved tabs into permanent bookmarks for easy retrieval.
- **Dark Mode**: Aesthetic customization for better visibility in low-light environments.
- **Search Functionality**: Quickly find tabs based on keywords or categories.
- **Tab Grouping**: Group tabs by time or date to manage work sessions efficiently.
- **User-Friendly Interface**: Intuitive design that makes it easy to manage tabs without clutter.

## Technical Stack
- **React**: Front-end library for building interactive user interfaces.
- **JavaScript**: Programming language for extension functionality.
- **Chrome APIs**: For accessing browser features such as bookmarks and storage.
- **HTML/CSS**: For structuring and styling the extension.
- **Chart.js**: For visualizing analytics data in an engaging way.

## Installation
1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/tabman.git
   cd tabman
   ```

2. Open Chrome and navigate to `chrome://extensions/`.

3. Enable "Developer mode" (toggle in the upper right).

4. Click on "Load unpacked" and select the `dist` folder in your cloned repository.

## Usage
1. Click on the TabMan icon in your Chrome toolbar to open the extension.

2. Use the interface to categorize, save, and manage your tabs.

3. Explore the analytics dashboard to view your browsing habits and get insights.


## Project Structure
- `dist/`: Contains the compiled extension files.
- `src/`: Source code for the extension.
  - `components/`: React components for the UI.
  - `background.js`: Background script for managing extension functionality.
  - `tabCategories.js`: Logic for categorizing tabs.
- `assets/`: Images and icons used in the extension.
- `package.json`: Project metadata and dependencies.
- `README.md`: Project documentation (this file).

## Feature Details

### Tab Categorization
Users can create custom categories for tabs, making it easier to organize and access them. Categories can be color-coded for better visualization.

### Session Saving
Allows users to save the current set of open tabs and restore them later, streamlining the workflow for repetitive tasks.

### Tab Usage Analytics
Provides insights into browsing patterns, helping users identify the most visited sites and time spent on each, facilitating better time management.

### Bookmark Integration
Users can convert their saved tabs into bookmarks using the Chrome bookmarks API, ensuring important links are easily accessible.


## Customization
Users can customize various aspects of the TabMan interface, including:
- Tab categories and their colors.
- Dark mode settings.
- Notification preferences.
- Default views for the analytics dashboard.

## Troubleshooting
- **Extension Not Loading**: Ensure the extension is correctly loaded in Chrome's extensions page and that "Developer mode" is enabled.
- **Analytics Not Displaying**: Verify that data tracking is enabled and that you have sufficient browsing history.
- **Performance Issues**: If the extension runs slowly, try clearing your browser's cache or disabling other extensions that might interfere.

## Contributing
Contributions to TabMan are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## Contact
For any queries or suggestions, please open an issue on the GitHub repository or reach out via email at prafulrai522@gmail.com
