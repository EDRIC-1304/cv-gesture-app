# Computer Vision Gesture Web App

A browser-based computer vision project focused on real-time camera interaction through hand gestures.

The application is being developed primarily for mobile devices, while also supporting laptops/desktops.

The project runs computer vision directly in the user's browser. No backend, authentication system, or database is required.

---

## Current Project Status

### Completed

- Next.js project setup
- JavaScript implementation
- Home page
- About page
- AR / Filters mode UI
- AR mode tutorial UI
- Tutorial exit option
- Tutorial skip option
- Camera startup when entering the mode
- Camera shutdown when exiting the mode
- MediaPipe Hand Landmarker integration
- Real-time hand landmark detection
- Hand landmark visualization
- Gesture detection system
- Gesture stability system
- Point gesture detection
- Pinch gesture detection
- Fist gesture detection
- Open-palm gesture detection

### Currently Being Implemented

- AR area selection
- Rectangular area selection
- Free-hand area selection
- Area positioning using point + pinch
- AR filters

### Removed

- Palm swipe for changing filters
- Index-finger swipe for changing filters
- AR filter selection menu
- Separate filter-options gesture

The swipe approaches were tested but were not reliable enough for the project, so they have been removed to keep the application simple and reliable.

---

# Project Modes

The application will eventually contain three modes.

## 1. AR / Filters Mode

The user views themselves through the front-facing camera and can select an area of the camera view.

Two selection methods are planned:

### Rectangular Selection

The user uses both index fingers.

The two index fingertips initially meet and move apart to create the rectangle.

The rectangle grows as the fingers move apart.

### Free-Hand Selection

The user uses their index finger to draw an area in the air.

The shape must eventually be closed before it can be used.

The exact shape does not need to be geometrically perfect.

A valid area is shown with a green border.

An incomplete or invalid selection remains red.

### Moving the Selected Area

After creating the rectangle or free-hand area:

1. Use the index finger to point at/select the area.
2. Use pinch to grab the selected area.
3. Move the hand to reposition the area.
4. Release the pinch to stop moving it.

The size of the area is not changed during repositioning.

---

# AR Filter Selection

The filter menu has been removed.

There is no separate filter-options screen or palm gesture for selecting filters.

Instead, after an area has been successfully created, the user can use:

**Pinch → Next Filter**

Each completed pinch advances to the next filter.

The filters cycle continuously:

Filter 1 → Filter 2 → Filter 3 → Filter 4 → Filter 5 → Filter 1

This keeps the AR interaction simple and avoids unreliable swipe detection.

---

# AR Filters

Five visually different filters are planned for the AR mode.

1. Pixelation
2. Black & White
3. Cartoon
4. Thermal / Heat-map style
5. Edge / Sketch effect

The final filter implementation will be completed after area selection is working.

---

# AR Gesture Summary

| Gesture | Purpose |
|---|---|
| Point ☝️ | Select/create an area |
| Pinch 🤏 | Grab/reposition selected area |
| Pinch 🤏 after area creation | Cycle to next filter |
| Fist ✊ | Cancel/reset the current AR interaction |
| Open Palm ✋ | No longer assigned to a filter menu |
| Swipe | Removed |

---

# Gesture Validation

The application uses gesture stability so that a gesture must remain consistently detected instead of reacting to a single incorrect frame.

This helps reduce accidental actions caused by temporary prediction changes.

---

# Tutorial System

Each mode will have its own tutorial.

The tutorial is designed to work similarly to an interactive game tutorial.

Each tutorial:

- Explains the required gesture
- Shows text instructions
- Uses the live camera
- Detects the user's gesture
- Does not move to the next step until the required gesture is correctly detected
- Provides an Exit option
- Provides a Skip option

The temporary Continue button used during early UI development will not be part of the final interactive model-based tutorial.

The tutorial will eventually advance automatically after the required gesture is correctly detected.

---

# Computer Vision

## MediaPipe Hand Landmarker

MediaPipe Hand Landmarker is currently being used for real-time hand tracking.

It provides:

- Hand detection
- 21 hand landmarks
- Fingertip positions
- Joint positions
- Real-time tracking

The landmarks are then used by our own JavaScript gesture-detection logic.

---

# Current Gesture Detection

The current system detects:

- Point
- Pinch
- Fist
- Open Palm

Gesture stability is applied to reduce accidental changes caused by individual frames.

---

# Camera Handling

The camera is started only when entering a mode that requires it.

The application stops the camera tracks when leaving the mode.

This prevents the camera from remaining active after exiting the mode.

---

# Planned Modes

## AR / Filters

Status:

**In progress**

Current focus:

- Area selection
- Area validation
- Area positioning
- Filter effects

---

## Invisibility Mode

Planned functionality:

The user appears in front of the camera and performs a designated gesture to activate the invisibility effect.

Status:

**Not implemented yet**

---

## Puzzle Mode

Planned functionality:

The front-facing camera captures the user's image and turns it into a live puzzle.

The user solves the puzzle using hand gestures instead of a mouse.

Status:

**Not implemented yet**

---

# Technology Stack

## Frontend

- Next.js
- JavaScript
- React
- Tailwind CSS

## Computer Vision

- MediaPipe Tasks Vision
- Hand Landmarker

## Deployment

The project is planned to be deployed using Netlify.

Computer vision models will run on the user's device/browser rather than on a backend server.

---

# Architecture

The project is intentionally kept simple.

There is:

- No backend
- No database
- No authentication
- No user accounts

Computer vision processing happens in the browser.

High-level flow:

Camera
↓
MediaPipe Hand Landmarker
↓
21 Hand Landmarks
↓
Gesture Detection
↓
Gesture Stability
↓
Application Action

---

# Development Approach

The project is being implemented one mode at a time.

Current order:

1. AR / Filters Mode
2. Invisibility Mode
3. Puzzle Mode

Each mode will be:

1. Implemented
2. Tested
3. Deployed to Netlify

Only after a mode is working properly will development move to the next mode.

The Home and About pages will also be updated as new modes and functionality are completed.

---

# Development Notes

The project prioritizes:

- Simplicity
- Real-time browser performance
- Mobile usability
- Clear gesture interactions
- Pretrained/open-source computer vision models
- No unnecessary backend infrastructure
- Portfolio-quality UI and UX

The project uses JavaScript rather than TypeScript.
