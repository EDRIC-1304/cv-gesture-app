let lastGesture = "none";
let stableGesture = "none";
let gestureStartTime = 0;

const STABILITY_TIME = 300;

export function getStableGesture(gesture) {
  const now = performance.now();

  if (gesture !== lastGesture) {
    lastGesture = gesture;
    gestureStartTime = now;

    if (gesture === "none") {
      stableGesture = "none";
    }

    return stableGesture;
  }

  if (
    gesture !== "none" &&
    now - gestureStartTime >= STABILITY_TIME
  ) {
    stableGesture = gesture;
  }

  if (gesture === "none") {
    stableGesture = "none";
  }

  return stableGesture;
}

export function resetGestureStability() {
  lastGesture = "none";
  stableGesture = "none";
  gestureStartTime = 0;
}