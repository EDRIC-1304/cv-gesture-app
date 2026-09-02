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

// ============================================================
// DISTANCE
// ============================================================

function distance(point1, point2) {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;

  return Math.sqrt(
    dx * dx + dy * dy
  );
}

// ============================================================
// PINCH POINT
// ============================================================

function getPinchPoint(landmarks) {
  if (!landmarks) {
    return null;
  }

  const thumb = landmarks[4];
  const index = landmarks[8];

  if (!thumb || !index) {
    return null;
  }

  return {
    x: (thumb.x + index.x) / 2,
    y: (thumb.y + index.y) / 2,
  };
}

// ============================================================
// POINT INSIDE RECTANGLE
// ============================================================

function isPointInsideRectangle(
  point,
  rect
) {
  if (!point || !rect) {
    return false;
  }

  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

// ============================================================
// MAIN UPDATE
// ============================================================

export function updateRectangleSelection(
  landmarks,
  gesture = "none"
) {
  const hands =
    landmarks || [];

  // ==========================================================
  // NO HANDS
  // ==========================================================
  //
  // IMPORTANT:
  // NEVER reset the rectangle here.
  //
  // If a rectangle has already been selected, it remains
  // selected even when MediaPipe sees zero hands.
  // ==========================================================

  if (hands.length === 0) {
    if (
      state === "selected" &&
      rectangle
    ) {
      isDragging = false;

      return {
        rectangle,
        state: "selected",
        isDragging: false,
        pinchInside: false,
      };
    }

    return {
      rectangle,
      state,
      isDragging: false,
      pinchInside: false,
    };
  }

  // ==========================================================
  // RECTANGLE CREATION
  // ==========================================================

  if (hands.length >= 2) {
    const finger1 =
      hands[0]?.[8];

    const finger2 =
      hands[1]?.[8];

    if (finger1 && finger2) {
      const fingerDistance =
        distance(
          finger1,
          finger2
        );

      const currentRectangle = {
        x: Math.min(
          finger1.x,
          finger2.x
        ),

        y: Math.min(
          finger1.y,
          finger2.y
        ),

        width: Math.abs(
          finger1.x - finger2.x
        ),

        height: Math.abs(
          finger1.y - finger2.y
        ),
      };

      // --------------------------------------------------------
      // START CREATION
      // --------------------------------------------------------

      if (
        state === "idle" &&
        fingerDistance <
          START_DISTANCE
      ) {
        state = "creating";

        lastRectangle =
          currentRectangle;

        lastChangeTime =
          performance.now();

        return {
          rectangle:
            currentRectangle,
          state,
          isDragging: false,
          pinchInside: false,
        };
      }

      // --------------------------------------------------------
      // GROW RECTANGLE
      // --------------------------------------------------------

      if (
        state === "creating"
      ) {
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
          lastChangeTime =
            performance.now();

          lastRectangle =
            currentRectangle;
        }

        // ------------------------------------------------------
        // FINISH SELECTION
        // ------------------------------------------------------

        if (
          currentRectangle.width >=
            MIN_WIDTH &&
          currentRectangle.height >=
            MIN_HEIGHT &&
          performance.now() -
            lastChangeTime >=
            HOLD_TIME
        ) {
          rectangle = {
            ...currentRectangle,
          };

          state = "selected";

          isDragging = false;
        }

        return {
          rectangle:
            rectangle ||
            currentRectangle,

          state,

          isDragging,

          pinchInside: false,
        };
      }
    }
  }

  // ==========================================================
  // SELECTED → PINCH TO MOVE
  // ==========================================================

  if (
    state === "selected" &&
    rectangle
  ) {
    const pinchPoint =
      getPinchPoint(
        hands[0]
      );

    const pinchInside =
      isPointInsideRectangle(
        pinchPoint,
        rectangle
      );

    // --------------------------------------------------------
    // START DRAG
    // --------------------------------------------------------

    if (
      gesture === "pinch" &&
      !isDragging &&
      pinchInside
    ) {
      isDragging = true;

      dragOffsetX =
        pinchPoint.x -
        rectangle.x;

      dragOffsetY =
        pinchPoint.y -
        rectangle.y;
    }

    // --------------------------------------------------------
    // CONTINUE DRAG
    // --------------------------------------------------------

    if (
      gesture === "pinch" &&
      isDragging &&
      pinchPoint
    ) {
      rectangle.x =
        pinchPoint.x -
        dragOffsetX;

      rectangle.y =
        pinchPoint.y -
        dragOffsetY;

      // Keep inside camera
      rectangle.x =
        Math.max(
          0,
          Math.min(
            rectangle.x,
            1 - rectangle.width
          )
        );

      rectangle.y =
        Math.max(
          0,
          Math.min(
            rectangle.y,
            1 - rectangle.height
          )
        );
    }

    // --------------------------------------------------------
    // RELEASE PINCH
    // --------------------------------------------------------

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
      state: "selected",
      isDragging,
      pinchInside,
    };
  }

  // ==========================================================
  // DEFAULT
  // ==========================================================

  return {
    rectangle,
    state,
    isDragging,
    pinchInside: false,
  };
}

// ============================================================
// RESET
// ============================================================

export function resetRectangleSelection() {
  state = "idle";

  rectangle = null;

  lastRectangle = null;

  lastChangeTime = 0;

  isDragging = false;

  dragOffsetX = 0;
  dragOffsetY = 0;
}