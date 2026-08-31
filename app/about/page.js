export default function About() {
  return (
    <main>
      <h1>About</h1>

      <p>
        This project is a browser-based computer vision experience that lets
        you interact with the camera using hand gestures.
      </p>

      <h2>Filters</h2>
      <p>
        Select an area of the camera view using a rectangle or by drawing a
        freehand shape, then apply different visual filters to that area.
      </p>

      <h2>Puzzle</h2>
      <p>
        Capture an image from the camera, turn it into a puzzle, and solve it
        using hand gestures.
      </p>

      <h2>Invisible</h2>
      <p>
        Use person segmentation to create an effect that makes the person
        appear invisible in the camera view.
      </p>

      <h2>Gestures</h2>

      <p>☝️ Point — Move the cursor and target objects.</p>
      <p>🤏 Pinch — Select, draw, or grab an existing selection.</p>
      <p>☝️☝️ Two index fingers — Create a rectangular selection.</p>
      <p>✋ Open palm — Show or hide the filter options.</p>
      <p>✋ Palm swipe — Cycle through filters after an area is created.</p>
      <p>✊ Closed fist — Reset the current mode.</p>

      <p>
        Selections start with a red border and turn green once they are
        correctly completed.
      </p>
    </main>
  );
}