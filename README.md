# Responsive Image Gallery with React JS

## Objective:

Create a responsive image gallery using React JS with the following features: reordering, deleting multiple images, uploading image and setting a feature image. The gallery should be visually appealing and provide a seamless user experience.

Live URL: https://ollyo-gallery.netlify.app/

## Table of Contents

- [Features](#features)
- [File Structure](#file-structure)
- [Usage](#usage)
- [Customization](#customization)
- [Technologies Used](#technologies-used)
- [Credits](#credits)

## Features:

1. **Gallery Layout:** Grid-based image gallery with a featured image larger than the others.
2. **Sorting:** Users can rearrange the order of images via drag-and-drop or alternative intuitive methods.
3. **Deleting Multiple Images:** Select and delete multiple images with visual cues for selection.
4. **Uploading Image:** Upload image to click on Add Images.
5. **Setting Feature Image:** Set a feature image via sorting (first image from LTR direction).
6. **User Experience:** Smooth and responsive experience with transitions or animations.

## Technologies Used

### Frontend

- **ReactJS**: JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.

### Backend (Additional)

- **Express.js**: Minimal and flexible Node.js web application framework used for server-side APIs.
- **MongoDB**: NoSQL database used to store and manage data.

### Additional Implementations

Although not required, the project voluntarily includes backend functionalities for server-side processing and data storage, along with an image upload feature. These additional aspects leverage Express.js for API handling and MongoDB for data storage, allowing users to upload and manage images via the application.

## File Structure

```plaintext
react-image-gallery/
│
├── public/
│ ├──
│
├── src/
│ ├── Components/
│ │ ├── Container/
│ │ │ ├── Container.jsx # Component for the main container
│ │ │
│ │ ├── ImageLoadingCompo/
│ │ │ ├── ImageLoadingCompo.jsx # Component for image loading
│ │ │
│ ├── Pages/
│ │ ├── Gallery/
│ │ │ ├── Gallery.jsx # Page or component for the image gallery
│ │ │
│ ├── App.jsx # Main application component
│ ├── index.css # Styles for the app
│ ├── main.jsx # Entry point
│
├── index.html # Main HTML file
├── package-lock.json # Dependency lock file
├── package.json # Project configuration and dependencies
├── tailwind.config.js # Tailwind CSS configuration
├── README.md             # Project documentation
└── ...                   # Other directories and files
```

## Usage:

Clone or download this repository.
Navigate to the project directory.
Run npm install to install necessary dependencies.
Run npm run dev to start the development server.
Access the application via your web browser.

## Credits

Special thanks to the creators and maintainers of the following libraries and frameworks used in this project:

- **axios**: Used for handling HTTP requests.
- **React**: The fundamental library for building user interfaces in this project.
- **react-dom**: Provides methods specific to the Document Object Model (DOM) in React.
- **react-hot-toast**: Facilitates lightweight and customizable toast notifications.
- **react-icons**: Library providing a collection of icons for React applications.
- **react-loader-spinner**: Used for adding loading spinners in the application.
