let state = "idle";
let points = [];

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

export function updateFreehandSelection(
  landmarks,
  gesture = "none"
) {
  // No hand
  if (!landmarks || landmarks.length === 0) {
    return {
      points,
      state,
      rectangle: calculateBoundingBox(points),
    };
  }

  const hand = landmarks[0];

  const indexTip = hand[8];

  if (!indexTip) {
    return {
      points,
      state,
      rectangle: calculateBoundingBox(points),
    };
  }

  // Fist cancels drawing
  if (gesture === "fist") {
    resetFreehandSelection();

    return {
      points: [],
      state: "idle",
      rectangle: null,
    };
  }

  // --------------------------------
  // START DRAWING
  // --------------------------------

  if (
    state === "idle" &&
    gesture === "point"
  ) {
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
    };
  }

  // --------------------------------
  // CONTINUE DRAWING
  // --------------------------------

  if (
    state === "drawing" &&
    gesture === "point"
  ) {
    const lastPoint =
      points[points.length - 1];

    // Only add point if finger actually moved
    if (
      !lastPoint ||
      distance(indexTip, lastPoint) > 0.008
    ) {
      points.push({
        x: indexTip.x,
        y: indexTip.y,
      });
    }

    // Check whether the user has returned
    // close to the starting point
    if (points.length >= MIN_POINTS) {
      const startPoint = points[0];

      const closeDistance =
        distance(
          indexTip,
          startPoint
        );

      const area =
        calculatePolygonArea(points);

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
    };
  }

  // --------------------------------
  // SELECTED
  // --------------------------------

  if (state === "selected") {
    return {
      points,
      state,
      rectangle: calculateBoundingBox(points),
    };
  }

  return {
    points,
    state,
    rectangle: calculateBoundingBox(points),
  };
}

export function resetFreehandSelection() {
  state = "idle";
  points = [];
}