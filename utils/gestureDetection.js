function distance(pointA, pointB) {
  const x = pointA.x - pointB.x;
  const y = pointA.y - pointB.y;

  return Math.sqrt(x * x + y * y);
}

function isFingerExtended(landmarks, tipIndex, pipIndex) {
  const wrist = landmarks[0];

  const tipDistance = distance(
    landmarks[tipIndex],
    wrist
  );

  const pipDistance = distance(
    landmarks[pipIndex],
    wrist
  );

  return tipDistance > pipDistance * 1.15;
}

function isOpenPalm(landmarks) {
  return (
    isFingerExtended(landmarks, 8, 6) &&
    isFingerExtended(landmarks, 12, 10) &&
    isFingerExtended(landmarks, 16, 14) &&
    isFingerExtended(landmarks, 20, 18)
  );
}

export function detectGesture(landmarks) {
  if (!landmarks || landmarks.length !== 21) {
    return "none";
  }

  const indexExtended = isFingerExtended(landmarks, 8, 6);
  const middleExtended = isFingerExtended(landmarks, 12, 10);
  const ringExtended = isFingerExtended(landmarks, 16, 14);
  const pinkyExtended = isFingerExtended(landmarks, 20, 18);

  const palmSize = distance(
    landmarks[0],
    landmarks[9]
  );

  const thumbIndexDistance = distance(
    landmarks[4],
    landmarks[8]
  );

  const normalizedPinchDistance =
    thumbIndexDistance / palmSize;

  // -------------------------
  // PINCH
  // -------------------------

  if (
    normalizedPinchDistance < 0.45 &&
    indexExtended
  ) {
    return "pinch";
  }

  // -------------------------
  // OPEN PALM
  // -------------------------

  if (
    indexExtended &&
    middleExtended &&
    ringExtended &&
    pinkyExtended
  ) {
    return "open_palm";
  }

  // -------------------------
  // POINT
  // -------------------------

  if (
    indexExtended &&
    !middleExtended &&
    !ringExtended &&
    !pinkyExtended
  ) {
    return "point";
  }

  // -------------------------
  // FIST
  // -------------------------

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

export function isPalm(landmarks) {
  if (!landmarks || landmarks.length !== 21) {
    return false;
  }

  return isOpenPalm(landmarks);
}