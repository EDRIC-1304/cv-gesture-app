"use client";

import { useEffect, useRef } from "react";

import {
  FilesetResolver,
  HandLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

import { detectGesture } from "../utils/gestureDetection";

import {
  getStableGesture,
  resetGestureStability,
} from "../utils/gestureStability";

import {
  updateRectangleSelection,
  resetRectangleSelection,
} from "../utils/rectangleSelection";

import {
  updateFreehandSelection,
  resetFreehandSelection,
} from "../utils/freehandSelection";

export default function HandTracker() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const streamRef = useRef(null);
  const handLandmarkerRef =
    useRef(null);

  const animationFrameRef =
    useRef(null);

  // ============================================================
  // RECTANGLE MODE LOCK
  // ============================================================
  //
  // false = freehand is allowed
  // true  = rectangle system owns the interaction
  //
  // Once rectangle creation starts, freehand is blocked until
  // a FIST resets everything.
  // ============================================================

  const rectangleModeRef =
    useRef(false);

  // ============================================================
  // PERSISTENT RECTANGLE
  // ============================================================

  const persistentRectangleRef =
    useRef({
      rectangle: null,
      state: "idle",
      isDragging: false,
      pinchInside: false,
    });

  // ============================================================
  // PERSISTENT FREEHAND
  // ============================================================

  const persistentFreehandRef =
    useRef({
      points: [],
      state: "idle",
      rectangle: null,
      isDragging: false,
    });

  useEffect(() => {
    let cancelled = false;

    // ==========================================================
    // DRAW RECTANGLE
    // ==========================================================

    function drawRectangle(
      ctx,
      rectangle,
      state,
      width,
      height
    ) {
      if (!rectangle) {
        return;
      }

      ctx.save();

      ctx.strokeStyle =
        state === "selected"
          ? "#00ff66"
          : "#ff3333";

      ctx.lineWidth = 4;

      ctx.strokeRect(
        rectangle.x * width,
        rectangle.y * height,
        rectangle.width * width,
        rectangle.height * height
      );

      ctx.restore();
    }

    // ==========================================================
    // DRAW FREEHAND
    // ==========================================================

    function drawFreehand(
      ctx,
      points,
      state,
      width,
      height
    ) {
      if (
        !points ||
        points.length < 2
      ) {
        return;
      }

      ctx.save();

      ctx.beginPath();

      points.forEach(
        (point, index) => {
          const x =
            point.x * width;

          const y =
            point.y * height;

          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      );

      if (
        state === "selected"
      ) {
        ctx.closePath();
      }

      ctx.strokeStyle =
        state === "selected"
          ? "#00ff66"
          : "#ff3333";

      ctx.lineWidth = 4;

      ctx.stroke();

      ctx.restore();
    }

    // ==========================================================
    // POINT INSIDE RECTANGLE
    // ==========================================================

    function isInsideRectangle(
      point,
      rectangle
    ) {
      if (
        !point ||
        !rectangle
      ) {
        return false;
      }

      return (
        point.x >= rectangle.x &&
        point.x <=
          rectangle.x +
            rectangle.width &&
        point.y >= rectangle.y &&
        point.y <=
          rectangle.y +
            rectangle.height
      );
    }

    // ==========================================================
    // DEBUGGER
    // ==========================================================

    function drawDebugger(
      ctx,
      gesture,
      stableGesture,
      rectangleResult,
      freehandResult,
      pinchPoint,
      pinchInsideRectangle,
      pinchInsideFreehand
    ) {
      ctx.save();

      ctx.fillStyle =
        "rgba(0, 0, 0, 0.75)";

      ctx.fillRect(
        10,
        10,
        390,
        260
      );

      ctx.fillStyle =
        "white";

      ctx.font =
        "14px Arial";

      ctx.fillText(
        `Gesture: ${gesture}`,
        20,
        35
      );

      ctx.fillText(
        `Stable: ${stableGesture}`,
        20,
        55
      );

      ctx.fillText(
        `Rectangle: ${rectangleResult.state}`,
        20,
        75
      );

      ctx.fillText(
        `Rectangle mode: ${
          rectangleModeRef.current
        }`,
        20,
        95
      );

      ctx.fillText(
        `Freehand: ${freehandResult.state}`,
        20,
        115
      );

      ctx.fillText(
        `Rectangle dragging: ${
          rectangleResult.isDragging ??
          false
        }`,
        20,
        135
      );

      ctx.fillText(
        `Freehand dragging: ${
          freehandResult.isDragging ??
          false
        }`,
        20,
        155
      );

      ctx.fillText(
        `Pinch in rectangle: ${
          pinchInsideRectangle
        }`,
        20,
        175
      );

      ctx.fillText(
        `Pinch in freehand: ${
          pinchInsideFreehand
        }`,
        20,
        195
      );

      if (pinchPoint) {
        ctx.fillText(
          `Pinch: ${pinchPoint.x.toFixed(
            2
          )}, ${pinchPoint.y.toFixed(
            2
          )}`,
          20,
          215
        );
      } else {
        ctx.fillText(
          "Pinch: none",
          20,
          215
        );
      }

      ctx.fillText(
        "POINT = DRAW",
        20,
        240
      );

      ctx.fillText(
        "PINCH = MOVE",
        140,
        240
      );

      ctx.fillText(
        "FIST = RESET",
        270,
        240
      );

      ctx.restore();
    }

    // ==========================================================
    // CAMERA + MEDIAPIPE
    // ==========================================================

    async function setup() {
      try {
        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: {
                facingMode: "user",
              },
              audio: false,
            }
          );

        if (cancelled) {
          stream
            .getTracks()
            .forEach((track) =>
              track.stop()
            );

          return;
        }

        streamRef.current =
          stream;

        const video =
          videoRef.current;

        if (!video) {
          return;
        }

        video.srcObject =
          stream;

        await new Promise(
          (resolve) => {
            video.onloadedmetadata =
              resolve;
          }
        );

        await video.play();

        console.log(
          "Camera started:",
          video.videoWidth,
          video.videoHeight
        );

        const vision =
          await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
          );

        const handLandmarker =
          await HandLandmarker.createFromOptions(
            vision,
            {
              baseOptions: {
                modelAssetPath:
                  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",

                delegate: "GPU",
              },

              runningMode:
                "VIDEO",

              numHands: 2,

              minHandDetectionConfidence:
                0.5,

              minHandPresenceConfidence:
                0.5,

              minTrackingConfidence:
                0.5,
            }
          );

        if (cancelled) {
          handLandmarker.close();
          return;
        }

        handLandmarkerRef.current =
          handLandmarker;

        detectFrame();
      } catch (error) {
        console.error(
          "Hand tracking setup failed:",
          error
        );
      }
    }

    // ==========================================================
    // FRAME LOOP
    // ==========================================================

    function detectFrame() {
      if (cancelled) {
        return;
      }

      const video =
        videoRef.current;

      const canvas =
        canvasRef.current;

      const handLandmarker =
        handLandmarkerRef.current;

      if (
        !video ||
        !canvas ||
        !handLandmarker
      ) {
        animationFrameRef.current =
          requestAnimationFrame(
            detectFrame
          );

        return;
      }

      if (
        video.readyState < 2
      ) {
        animationFrameRef.current =
          requestAnimationFrame(
            detectFrame
          );

        return;
      }

      const width =
        video.videoWidth;

      const height =
        video.videoHeight;

      if (
        !width ||
        !height
      ) {
        animationFrameRef.current =
          requestAnimationFrame(
            detectFrame
          );

        return;
      }

      // --------------------------------------------------------
      // CANVAS SIZE
      // --------------------------------------------------------

      if (
        canvas.width !== width ||
        canvas.height !== height
      ) {
        canvas.width = width;
        canvas.height = height;
      }

      const ctx =
        canvas.getContext("2d");

      if (!ctx) {
        animationFrameRef.current =
          requestAnimationFrame(
            detectFrame
          );

        return;
      }

      // --------------------------------------------------------
      // CLEAR OVERLAY
      // --------------------------------------------------------

      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      // ========================================================
      // MEDIAPIPE
      // ========================================================

      const results =
        handLandmarker.detectForVideo(
          video,
          performance.now()
        );

      const landmarks =
        results.landmarks || [];

      // ========================================================
      // GESTURE
      // ========================================================

      let gesture = "none";

      if (
        landmarks.length > 0
      ) {
        gesture =
          detectGesture(
            landmarks[0]
          );
      }

      const stableGesture =
        getStableGesture(
          gesture
        );

      // ========================================================
      // DRAW LANDMARKS
      // ========================================================

      if (
        landmarks.length > 0
      ) {
        const drawingUtils =
          new DrawingUtils(ctx);

        for (
          const hand of landmarks
        ) {
          drawingUtils.drawConnectors(
            hand,
            HandLandmarker.HAND_CONNECTIONS,
            {
              color: "#ffffff",
              lineWidth: 2,
            }
          );

          drawingUtils.drawLandmarks(
            hand,
            {
              color: "#00ffff",
              radius: 3,
            }
          );
        }
      }

      // ========================================================
      // FIST = COMPLETE RESET
      // ========================================================

      if (
        landmarks.length > 0 &&
        stableGesture === "fist"
      ) {
        resetRectangleSelection();

        resetFreehandSelection();

        // Unlock rectangle mode.
        rectangleModeRef.current =
          false;

        // Clear persistent rectangle.
        persistentRectangleRef.current =
          {
            rectangle: null,
            state: "idle",
            isDragging: false,
            pinchInside: false,
          };

        // Clear persistent freehand.
        persistentFreehandRef.current =
          {
            points: [],
            state: "idle",
            rectangle: null,
            isDragging: false,
          };

        animationFrameRef.current =
          requestAnimationFrame(
            detectFrame
          );

        return;
      }

      // ========================================================
      // RECTANGLE UPDATE
      // ========================================================

      const rectangleUpdate =
        updateRectangleSelection(
          landmarks,
          stableGesture
        );

      // ========================================================
      // LOCK RECTANGLE MODE
      // ========================================================
      //
      // As soon as rectangle creation begins, rectangle mode
      // becomes exclusive.
      //
      // This prevents:
      //
      // 2 hands
      //   ↓
      // rectangle
      //   ↓
      // remove one hand
      //   ↓
      // FREEHAND
      //
      // That transition is no longer possible.
      // ========================================================

      if (
        rectangleUpdate.state ===
          "creating" ||
        rectangleUpdate.state ===
          "selected"
      ) {
        rectangleModeRef.current =
          true;
      }

      // ========================================================
      // PERSIST RECTANGLE
      // ========================================================

      if (
        rectangleUpdate.rectangle
      ) {
        persistentRectangleRef.current =
          {
            rectangle: {
              ...rectangleUpdate.rectangle,
            },

            state:
              rectangleUpdate.state,

            isDragging:
              rectangleUpdate.isDragging ??
              false,

            pinchInside:
              rectangleUpdate.pinchInside ??
              false,
          };
      }

      /*
       * If there are NO HANDS and the rectangle was already
       * selected, rectangleUpdate still contains the rectangle.
       *
       * But even if MediaPipe temporarily gives us an empty
       * result, this cached object remains available.
       */

      let rectangleResult =
        persistentRectangleRef.current;

      // ========================================================
      // PINCH POINT
      // ========================================================

      let pinchPoint = null;

      if (
        landmarks.length > 0
      ) {
        const hand =
          landmarks[0];

        const thumbTip =
          hand[4];

        const indexTip =
          hand[8];

        if (
          thumbTip &&
          indexTip
        ) {
          pinchPoint = {
            x:
              (thumbTip.x +
                indexTip.x) /
              2,

            y:
              (thumbTip.y +
                indexTip.y) /
              2,
          };
        }
      }

      // ========================================================
      // RECTANGLE PINCH CHECK
      // ========================================================

      const pinchInsideRectangle =
        pinchPoint &&
        rectangleResult.rectangle
          ? isInsideRectangle(
              pinchPoint,
              rectangleResult.rectangle
            )
          : false;

      // ========================================================
      // FREEHAND
      // ========================================================
      //
      // CRITICAL:
      //
      // If rectangle mode is active, freehand DOES NOT receive
      // the detected hand landmarks.
      //
      // Therefore removing one hand cannot accidentally start
      // freehand drawing.
      // ========================================================

      let freehandResult;

      if (
        rectangleModeRef.current
      ) {
        /*
         * Rectangle mode owns the interaction.
         *
         * Do NOT pass the actual hand to freehand.
         *
         * Passing [] makes freehand preserve its existing
         * state without drawing anything.
         */

        freehandResult =
          updateFreehandSelection(
            [],
            "none"
          );
      } else {
        /*
         * Rectangle mode is not active.
         *
         * Freehand is allowed to operate normally.
         */

        freehandResult =
          updateFreehandSelection(
            landmarks,
            stableGesture
          );
      }

      // ========================================================
      // PERSIST FREEHAND
      // ========================================================

      if (
        freehandResult.points &&
        freehandResult.points
          .length > 0
      ) {
        persistentFreehandRef.current =
          {
            ...freehandResult,

            points: [
              ...freehandResult.points,
            ],
          };
      } else if (
        freehandResult.state ===
          "selected" &&
        persistentFreehandRef.current
          .points.length > 0
      ) {
        persistentFreehandRef.current =
          {
            ...persistentFreehandRef.current,

            state: "selected",

            isDragging:
              freehandResult.isDragging ??
              false,

            rectangle:
              freehandResult.rectangle ??
              persistentFreehandRef
                .current.rectangle,
          };
      } else if (
        freehandResult.state ===
          "drawing"
      ) {
        persistentFreehandRef.current =
          {
            ...freehandResult,

            points: [
              ...(freehandResult.points ||
                []),
            ],
          };
      }

      freehandResult =
        persistentFreehandRef.current;

      // ========================================================
      // FREEHAND PINCH CHECK
      // ========================================================

      const pinchInsideFreehand =
        pinchPoint &&
        freehandResult.rectangle
          ? isInsideRectangle(
              pinchPoint,
              freehandResult.rectangle
            )
          : false;

      // ========================================================
      // DRAW RECTANGLE
      // ========================================================

      drawRectangle(
        ctx,
        rectangleResult.rectangle,
        rectangleResult.state,
        width,
        height
      );

      // ========================================================
      // DRAW FREEHAND
      // ========================================================

      /*
       * Another explicit protection:
       *
       * If rectangle mode is active, DO NOT DRAW FREEHAND.
       *
       * This means even if some stale freehand points exist,
       * they will not appear while rectangle mode owns the UI.
       */

      if (
        !rectangleModeRef.current
      ) {
        drawFreehand(
          ctx,
          freehandResult.points,
          freehandResult.state,
          width,
          height
        );
      }

      // ========================================================
      // DEBUGGER
      // ========================================================

      drawDebugger(
        ctx,
        gesture,
        stableGesture,
        rectangleResult,
        freehandResult,
        pinchPoint,
        pinchInsideRectangle,
        pinchInsideFreehand
      );

      // ========================================================
      // NEXT FRAME
      // ========================================================

      animationFrameRef.current =
        requestAnimationFrame(
          detectFrame
        );
    }

    // ==========================================================
    // START
    // ==========================================================

    setup();

    // ==========================================================
    // CLEANUP
    // ==========================================================

    return () => {
      cancelled = true;

      if (
        animationFrameRef.current
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      if (
        streamRef.current
      ) {
        streamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      }

      if (
        handLandmarkerRef.current
      ) {
        handLandmarkerRef.current.close();
      }

      resetGestureStability();

      resetRectangleSelection();

      resetFreehandSelection();

      rectangleModeRef.current =
        false;

      persistentRectangleRef.current =
        {
          rectangle: null,
          state: "idle",
          isDragging: false,
          pinchInside: false,
        };

      persistentFreehandRef.current =
        {
          points: [],
          state: "idle",
          rectangle: null,
          isDragging: false,
        };
    };
  }, []);

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "500px",
        background: "black",
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          zIndex: 1,
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}