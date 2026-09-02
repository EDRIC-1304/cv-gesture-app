let state = "idle";
let rectangle = null;

let lastRectangle = null;
let lastChangeTime = 0;

const START_DISTANCE = 0.06;
const MIN_WIDTH = 0.08;
const MIN_HEIGHT = 0.08;
const HOLD_TIME = 700;

function distance(point1, point2) {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;

  return Math.sqrt(dx * dx + dy * dy);
}

export function updateRectangleSelection(landmarks) {
  // No hands detected
  if (!landmarks || landmarks.length < 2) {
    return {
      rectangle,
      state,
    };
  }

  const finger1 = landmarks[0][8];
  const finger2 = landmarks[1][8];

  if (!finger1 || !finger2) {
    return {
      rectangle,
      state,
    };
  }

  const fingerDistance = distance(finger1, finger2);

  const currentRectangle = {
    x: Math.min(finger1.x, finger2.x),
    y: Math.min(finger1.y, finger2.y),
    width: Math.abs(finger1.x - finger2.x),
    height: Math.abs(finger1.y - finger2.y),
  };

  // Start creating a rectangle
  if (state === "idle" && fingerDistance < START_DISTANCE) {
    state = "creating";

    lastRectangle = currentRectangle;
    lastChangeTime = performance.now();

    return {
      rectangle: currentRectangle,
      state,
    };
  }

  // Create / grow rectangle
  if (state === "creating") {
    const changed =
      !lastRectangle ||
      Math.abs(
        currentRectangle.width - lastRectangle.width
      ) > 0.01 ||
      Math.abs(
        currentRectangle.height - lastRectangle.height
      ) > 0.01 ||
      Math.abs(
        currentRectangle.x - lastRectangle.x
      ) > 0.01 ||
      Math.abs(
        currentRectangle.y - lastRectangle.y
      ) > 0.01;

    if (changed) {
      lastChangeTime = performance.now();
      lastRectangle = currentRectangle;
    }

    // Finish when the user stops moving
    if (
      currentRectangle.width >= MIN_WIDTH &&
      currentRectangle.height >= MIN_HEIGHT &&
      performance.now() - lastChangeTime >= HOLD_TIME
    ) {
      rectangle = currentRectangle;
      state = "selected";
    }

    return {
      rectangle: rectangle || currentRectangle,
      state,
    };
  }

  // Once selected, keep the rectangle
  if (state === "selected") {
    return {
      rectangle,
      state,
    };
  }

  return {
    rectangle,
    state,
  };
}

export function resetRectangleSelection() {
  state = "idle";
  rectangle = null;
  lastRectangle = null;
  lastChangeTime = 0;
}