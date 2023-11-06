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
