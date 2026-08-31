# Gesture-Controlled Computer Vision Web App

A mobile-first browser-based computer vision project that allows users to interact with real-time camera experiences using hand gestures.

## Current Status

### Completed

- Next.js project setup
- JavaScript (no TypeScript)
- Tailwind CSS setup
- Home page
- About page
- Filters / AR mode route
- Front-facing camera access
- Camera stream cleanup when leaving the mode
- Basic Filters mode UI
- Initial Git checkpoints

### In Progress

- Filters / AR mode
- Interactive gesture tutorial
- Hand tracking
- Rectangle selection
- Freehand selection
- Selection repositioning
- Visual filters
- Filter options menu
- Palm swipe filter switching

## Planned Modes

### 1. Filters / AR

Users can select an area of the live camera view using either:

- Two-index-finger rectangle selection
- Freehand drawing

The selected area can then be transformed using five visual filters.

### 2. Puzzle

The user captures an image from the front camera, which is converted into a puzzle. The puzzle is solved using hand gestures.

### 3. Invisible

Person segmentation is used to create an effect that makes the person appear invisible in the camera view.

## Gesture System

- Point — target objects and UI options
- Pinch — select, draw, or grab a selection
- Two index fingers — create a rectangular selection
- Open palm — show or hide the Filters options menu
- Palm swipe — cycle through filters after a valid selection exists
- Closed fist — reset the current mode
- Exit button — leave the current mode

### Selection Feedback

Selections use a red border while they are being created or are not yet valid.

A correctly completed selection changes to a green border.

Freehand selections must form a closed shape before they can be accepted.

## Technology

- Next.js
- JavaScript
- Tailwind CSS
- MediaPipe Tasks Vision
- OpenCV.js
- HTML Canvas API
- Browser MediaDevices API
- localStorage
- Git / GitHub
- Netlify

## Computer Vision Models

The project will use lightweight pretrained models that run directly in the visitor's browser.

Models will be loaded only when the relevant mode requires them rather than downloading all models when the homepage opens.

Planned models:

- MediaPipe Hand Landmarker
- MediaPipe Gesture Recognizer
- MediaPipe Image Segmenter

No backend or database is planned.

## Development Approach

The project is being developed one mode at a time.

Each completed mode will be:

1. Implemented
2. Tested locally
3. Deployed to Netlify
4. Tested on mobile and desktop
5. Stabilized before moving to the next mode
