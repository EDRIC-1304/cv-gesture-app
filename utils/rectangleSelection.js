let state = "idle";
let rectangle = null;

let lastRectangle = null;
let lastChangeTime = 0;

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

const START_DISTANCE = 0.06;
const MIN_WIDTH = 0.08;
const MIN_HEIGHT = 0.08;
const HOLD_TIME = 700;

function distance(point1, point2) {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function getPinchPoint(landmarks) {
  const thumb = landmarks[4];
  const index = landmarks[8];

  if (!thumb || !index) return null;

  return {
    x: (thumb.x + index.x) / 2,
    y: (thumb.y + index.y) / 2,
  };
}

function isPointInsideRectangle(point, rect) {
  if (!point || !rect) return false;

  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

export function updateRectangleSelection(
  landmarks,
  gesture = "none"
) {
  // --------------------------------
  // NO HANDS
  // --------------------------------

  if (!landmarks || landmarks.length === 0) {
    return {
      rectangle,
      state,
      isDragging,
      pinchInside: false,
    };
  }

  // --------------------------------
  // RECTANGLE CREATION
  // --------------------------------

  if (landmarks.length >= 2) {
    const finger1 = landmarks[0][8];
    const finger2 = landmarks[1][8];

    if (finger1 && finger2) {
      const fingerDistance = distance(
        finger1,
        finger2
      );

      const currentRectangle = {
        x: Math.min(finger1.x, finger2.x),
        y: Math.min(finger1.y, finger2.y),
        width: Math.abs(finger1.x - finger2.x),
        height: Math.abs(finger1.y - finger2.y),
      };

      // Start creating
      if (
        state === "idle" &&
        fingerDistance < START_DISTANCE
      ) {
        state = "creating";

        lastRectangle = currentRectangle;
        lastChangeTime = performance.now();

        return {
          rectangle: currentRectangle,
          state,
          isDragging,
          pinchInside: false,
        };
      }

      // Grow rectangle
      if (state === "creating") {
        const changed =
          !lastRectangle ||
          Math.abs(
            currentRectangle.width -
              lastRectangle.width
          ) > 0.01 ||
          Math.abs(
            currentRectangle.height -
              lastRectangle.height
          ) > 0.01 ||
          Math.abs(
            currentRectangle.x -
              lastRectangle.x
          ) > 0.01 ||
          Math.abs(
            currentRectangle.y -
              lastRectangle.y
          ) > 0.01;

        if (changed) {
          lastChangeTime = performance.now();
          lastRectangle = currentRectangle;
        }

        // Finish selection
        if (
          currentRectangle.width >= MIN_WIDTH &&
          currentRectangle.height >= MIN_HEIGHT &&
          performance.now() -
            lastChangeTime >= HOLD_TIME
        ) {
          rectangle = {
            ...currentRectangle,
          };

          state = "selected";
        }

        return {
          rectangle:
            rectangle || currentRectangle,
          state,
          isDragging,
          pinchInside: false,
        };
      }
    }
  }

  // --------------------------------
  // MOVE SELECTED RECTANGLE
  // --------------------------------

  if (
    state === "selected" &&
    rectangle &&
    landmarks.length > 0
  ) {
    const pinchPoint =
      getPinchPoint(landmarks[0]);

    const pinchInside =
      isPointInsideRectangle(
        pinchPoint,
        rectangle
      );

    // Start dragging
    if (
      gesture === "pinch" &&
      !isDragging &&
      pinchInside
    ) {
      isDragging = true;

      dragOffsetX =
        pinchPoint.x - rectangle.x;

      dragOffsetY =
        pinchPoint.y - rectangle.y;
    }

    // Continue dragging
    if (
      gesture === "pinch" &&
      isDragging &&
      pinchPoint
    ) {
      rectangle.x =
        pinchPoint.x - dragOffsetX;

      rectangle.y =
        pinchPoint.y - dragOffsetY;

      // Keep inside camera
      rectangle.x = Math.max(
        0,
        Math.min(
          rectangle.x,
          1 - rectangle.width
        )
      );

      rectangle.y = Math.max(
        0,
        Math.min(
          rectangle.y,
          1 - rectangle.height
        )
      );
    }

    // Release pinch
    if (
      gesture !== "pinch" &&
      isDragging
    ) {
      isDragging = false;

      dragOffsetX = 0;
      dragOffsetY = 0;
    }

    return {
      rectangle,
      state,
      isDragging,
      pinchInside,
    };
  }

  return {
    rectangle,
    state,
    isDragging,
    pinchInside: false,
  };
}

export function resetRectangleSelection() {
  state = "idle";
  rectangle = null;

  lastRectangle = null;
  lastChangeTime = 0;

  isDragging = false;
  dragOffsetX = 0;
  dragOffsetY = 0;
}