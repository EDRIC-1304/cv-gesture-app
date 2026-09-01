function distance(pointA, pointB) {
  const x = pointA.x - pointB.x;
  const y = pointA.y - pointB.y;

  return Math.sqrt(x * x + y * y);
}

function isFingerExtended(landmarks, tipIndex, pipIndex) {
  const tip = landmarks[tipIndex];
  const pip = landmarks[pipIndex];

  return tip.y < pip.y;
}

export function detectGesture(landmarks) {
  if (!landmarks || landmarks.length !== 21) {
    return "none";
  }

  const indexExtended = isFingerExtended(landmarks, 8, 6);
  const middleExtended = isFingerExtended(landmarks, 12, 10);
  const ringExtended = isFingerExtended(landmarks, 16, 14);
  const pinkyExtended = isFingerExtended(landmarks, 20, 18);

  const thumbIndexDistance = distance(
    landmarks[4],
    landmarks[8]
  );

  // Pinch
  if (thumbIndexDistance < 0.06) {
    return "pinch";
  }

  // Open palm
  if (
    indexExtended &&
    middleExtended &&
    ringExtended &&
    pinkyExtended
  ) {
    return "open_palm";
  }

  // Point
  if (
    indexExtended &&
    !middleExtended &&
    !ringExtended &&
    !pinkyExtended
  ) {
    return "point";
  }

  // Fist
  if (
    !indexExtended &&
    !middleExtended &&
    !ringExtended &&
    !pinkyExtended
  ) {
    return "fist";
  }

  return "none";
}