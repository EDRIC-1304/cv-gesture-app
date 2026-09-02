let state = "idle";
let points = [];

let isDragging = false;
let dragOffset = { x: 0, y: 0 };

const MIN_POINTS = 10;
const CLOSE_DISTANCE = 0.05;
const MIN_AREA = 0.01;

function distance(point1, point2) {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function calculateBoundingBox(points) {
  if (!points.length) return null;

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function calculatePolygonArea(points) {
  if (points.length < 3) return 0;

  let area = 0;

  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];

    area +=
      current.x * next.y -
      next.x * current.y;
  }

  return Math.abs(area) / 2;
}

function isPointInsideRectangle(point, rectangle) {
  if (!point || !rectangle) return false;

  return (
    point.x >= rectangle.x &&
    point.x <= rectangle.x + rectangle.width &&
    point.y >= rectangle.y &&
    point.y <= rectangle.y + rectangle.height
  );
}

function moveShape(deltaX, deltaY) {
  points = points.map((point) => ({
    x: Math.max(0, Math.min(1, point.x + deltaX)),
    y: Math.max(0, Math.min(1, point.y + deltaY)),
  }));
}

export function updateFreehandSelection(
  landmarks,
  gesture = "none"
) {
  // -----------------------------
  // No hand detected
  // -----------------------------

  if (!landmarks || landmarks.length === 0) {
    isDragging = false;

    return {
      points,
      state,
      rectangle: calculateBoundingBox(points),
      isDragging,
    };
  }

  const hand = landmarks[0];

  const indexTip = hand[8];
  const thumbTip = hand[4];

  if (!indexTip) {
    return {
      points,
      state,
      rectangle: calculateBoundingBox(points),
      isDragging,
    };
  }

  // -----------------------------
  // FIST = RESET
  // -----------------------------

  if (gesture === "fist") {
    resetFreehandSelection();

    return {
      points: [],
      state: "idle",
      rectangle: null,
      isDragging: false,
    };
  }

  // -----------------------------
  // IDLE → start drawing
  // -----------------------------

  if (state === "idle" && gesture === "point") {
    state = "drawing";

    points = [
      {
        x: indexTip.x,
        y: indexTip.y,
      },
    ];

    return {
      points,
      state,
      rectangle: calculateBoundingBox(points),
      isDragging,
    };
  }

  // -----------------------------
  // DRAWING
  // -----------------------------

  if (state === "drawing" && gesture === "point") {
    const lastPoint = points[points.length - 1];

    if (
      !lastPoint ||
      distance(indexTip, lastPoint) > 0.008
    ) {
      points.push({
        x: indexTip.x,
        y: indexTip.y,
      });
    }

    // Check whether shape is closed
    if (points.length >= MIN_POINTS) {
      const startPoint = points[0];

      const closeDistance = distance(
        indexTip,
        startPoint
      );

      const area = calculatePolygonArea(points);

      if (
        closeDistance <= CLOSE_DISTANCE &&
        area >= MIN_AREA
      ) {
        state = "selected";
      }
    }

    return {
      points,
      state,
      rectangle: calculateBoundingBox(points),
      isDragging,
    };
  }

  // -----------------------------
  // SELECTED → PINCH TO MOVE
  // -----------------------------

  if (state === "selected") {
    const rectangle = calculateBoundingBox(points);

    if (
      gesture === "pinch" &&
      indexTip &&
      thumbTip
    ) {
      // Midpoint between thumb + index
      const pinchPoint = {
        x: (thumbTip.x + indexTip.x) / 2,
        y: (thumbTip.y + indexTip.y) / 2,
      };

      // Start dragging only when pinch
      // begins inside the shape
      if (!isDragging) {
        if (
          isPointInsideRectangle(
            pinchPoint,
            rectangle
          )
        ) {
          isDragging = true;

          dragOffset = {
            x: pinchPoint.x - rectangle.x,
            y: pinchPoint.y - rectangle.y,
          };
        }
      }

      // Move shape
      if (isDragging) {
        const currentRectangle =
          calculateBoundingBox(points);

        const newX =
          pinchPoint.x - dragOffset.x;

        const newY =
          pinchPoint.y - dragOffset.y;

        const deltaX =
          newX - currentRectangle.x;

        const deltaY =
          newY - currentRectangle.y;

        moveShape(deltaX, deltaY);
      }
    } else {
      // Pinch released
      isDragging = false;
    }

    return {
      points,
      state,
      rectangle: calculateBoundingBox(points),
      isDragging,
    };
  }

  return {
    points,
    state,
    rectangle: calculateBoundingBox(points),
    isDragging,
  };
}

export function resetFreehandSelection() {
  state = "idle";
  points = [];

  isDragging = false;

  dragOffset = {
    x: 0,
    y: 0,
  };
}