export function getRectangleFromHands(landmarks) {
  if (!landmarks || landmarks.length < 2) {
    return null;
  }

  const hand1 = landmarks[0];
  const hand2 = landmarks[1];

  const point1 = hand1[8];
  const point2 = hand2[8];

  if (!point1 || !point2) {
    return null;
  }

  const x1 = Math.min(point1.x, point2.x);
  const x2 = Math.max(point1.x, point2.x);

  const y1 = Math.min(point1.y, point2.y);
  const y2 = Math.max(point1.y, point2.y);

  const width = x2 - x1;
  const height = y2 - y1;

  /*
   * Ignore extremely small rectangles.
   */
  if (width < 0.05 || height < 0.05) {
    return {
      x: x1,
      y: y1,
      width,
      height,
      valid: false,
    };
  }

  return {
    x: x1,
    y: y1,
    width,
    height,
    valid: true,
  };
}