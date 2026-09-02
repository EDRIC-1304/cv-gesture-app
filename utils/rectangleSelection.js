let isSelecting = false;
let selectedRectangle = null;
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
  if (!landmarks || landmarks.length < 2) {
    return {
      rectangle: selectedRectangle,
      selecting: isSelecting,
      selected: !!selectedRectangle,
    };
  }

  const finger1 = landmarks[0][8];
  const finger2 = landmarks[1][8];

  if (!finger1 || !finger2) return null;

  const x = Math.min(finger1.x, finger2.x);
  const y = Math.min(finger1.y, finger2.y);

  const width = Math.abs(finger1.x - finger2.x);
  const height = Math.abs(finger1.y - finger2.y);

  const currentRectangle = {
    x,
    y,
    width,
    height,
  };

  const fingerDistance = distance(finger1, finger2);

  // Start selection when fingertips are close
  if (!isSelecting && !selectedRectangle && fingerDistance < START_DISTANCE) {
    isSelecting = true;
    lastRectangle = currentRectangle;
    lastChangeTime = performance.now();
  }

  // Grow rectangle while selecting
  if (isSelecting) {
    const changed =
      !lastRectangle ||
      Math.abs(width - lastRectangle.width) > 0.01 ||
      Math.abs(height - lastRectangle.height) > 0.01;

    if (changed) {
      lastChangeTime = performance.now();
      lastRectangle = currentRectangle;
    }

    // Finish after the user stops moving
    if (
      width >= MIN_WIDTH &&
      height >= MIN_HEIGHT &&
      performance.now() - lastChangeTime >= HOLD_TIME
    ) {
      selectedRectangle = currentRectangle;
      isSelecting = false;
    }
  }

  return {
    rectangle: selectedRectangle || currentRectangle,
    selecting: isSelecting,
    selected: !!selectedRectangle,
  };
}

export function resetRectangleSelection() {
  isSelecting = false;
  selectedRectangle = null;
  lastRectangle = null;
  lastChangeTime = 0;
}
