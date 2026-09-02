"use client";

import { useEffect, useRef } from "react";
import {
  FilesetResolver,
  HandLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

import { detectGesture } from "../utils/gestureDetection";
import { getStableGesture } from "../utils/gestureStability";

import {
  updateRectangleSelection,
  resetRectangleSelection,
} from "../utils/rectangleSelection";

export default function HandTracker() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let handLandmarker = null;
    let animationFrameId = null;
    let stream = null;
    let stopped = false;

    const setup = async () => {
      try {
        console.log("Starting hand tracker...");

        const vision =
          await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
          );

        console.log("MediaPipe WASM loaded");

        handLandmarker =
          await HandLandmarker.createFromOptions(
            vision,
            {
              baseOptions: {
                modelAssetPath:
                  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                delegate: "GPU",
              },

              runningMode: "VIDEO",
              numHands: 2,

              minHandDetectionConfidence: 0.5,
              minHandPresenceConfidence: 0.5,
              minTrackingConfidence: 0.5,
            }
          );

        console.log("Hand model loaded");

        if (stopped) return;

        stream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
            },
            audio: false,
          });

        console.log("Camera started");

        const video = videoRef.current;

        if (!video) return;

        video.srcObject = stream;

        video.onloadedmetadata = async () => {
          if (stopped) return;

          console.log(
            "Video dimensions:",
            video.videoWidth,
            video.videoHeight
          );

          try {
            await video.play();

            console.log("Video playing");

            startDetection();
          } catch (error) {
            console.error(
              "Video play failed:",
              error
            );
          }
        };
      } catch (error) {
        console.error(
          "Hand tracking setup failed:",
          error
        );
      }
    };

    const startDetection = () => {
      if (stopped) return;

      const video = videoRef.current;

      if (!video) return;

      if (
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
      ) {
        detectHands();
      } else {
        requestAnimationFrame(startDetection);
      }
    };

    const detectHands = () => {
      if (stopped) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || !handLandmarker) {
        animationFrameId =
          requestAnimationFrame(detectHands);

        return;
      }

      if (
        video.readyState < 2 ||
        video.videoWidth === 0 ||
        video.videoHeight === 0
      ) {
        animationFrameId =
          requestAnimationFrame(detectHands);

        return;
      }

      if (
        canvas.width !== video.videoWidth ||
        canvas.height !== video.videoHeight
      ) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const context =
        canvas.getContext("2d");

      if (!context) return;

      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const results =
        handLandmarker.detectForVideo(
          video,
          performance.now()
        );

      const drawingUtils =
        new DrawingUtils(context);

      // --------------------------------
      // DRAW HAND LANDMARKS
      // --------------------------------

      if (results.landmarks) {
        for (const landmarks of results.landmarks) {
          drawingUtils.drawConnectors(
            landmarks,
            HandLandmarker.HAND_CONNECTIONS,
            {
              color: "#00FF00",
              lineWidth: 2,
            }
          );

          drawingUtils.drawLandmarks(
            landmarks,
            {
              color: "#FF0000",
              lineWidth: 1,
              radius: 3,
            }
          );
        }
      }

      // --------------------------------
      // GESTURE DETECTION
      // --------------------------------

      let gesture = "none";

      if (
        results.landmarks &&
        results.landmarks.length > 0
      ) {
        gesture = detectGesture(
          results.landmarks[0]
        );
      }

      /*
        IMPORTANT:

        Always pass the current gesture into
        stability, including "none".

        This prevents an old "fist" or "pinch"
        from remaining active after the hand
        disappears.
      */
      const stableGesture =
        getStableGesture(gesture);

      // --------------------------------
      // FIST = CANCEL
      // --------------------------------

      if (
        stableGesture === "fist" &&
        results.landmarks &&
        results.landmarks.length > 0
      ) {
        resetRectangleSelection();
      }

      // --------------------------------
      // RECTANGLE
      // --------------------------------

      const selection =
        updateRectangleSelection(
          results.landmarks,
          stableGesture
        );

      if (selection?.rectangle) {
        const rectangle =
          selection.rectangle;

        const x =
          rectangle.x * canvas.width;

        const y =
          rectangle.y * canvas.height;

        const width =
          rectangle.width * canvas.width;

        const height =
          rectangle.height * canvas.height;

        context.strokeStyle =
          selection.state === "selected"
            ? "lime"
            : "red";

        context.lineWidth =
          selection.isDragging ? 6 : 4;

        context.strokeRect(
          x,
          y,
          width,
          height
        );
      }

      // --------------------------------
      // DEBUGGER
      // --------------------------------

      context.fillStyle =
        "rgba(0, 0, 0, 0.7)";

      context.fillRect(
        10,
        45,
        300,
        145
      );

      context.font = "16px Arial";
      context.fillStyle = "white";

      context.fillText(
        `Gesture: ${gesture}`,
        20,
        70
      );

      context.fillText(
        `Stable: ${stableGesture}`,
        20,
        94
      );

      context.fillText(
        `Pinch inside box: ${
          selection?.pinchInside
            ? "YES"
            : "NO"
        }`,
        20,
        118
      );

      context.fillText(
        `Box grabbed: ${
          selection?.isDragging
            ? "YES"
            : "NO"
        }`,
        20,
        142
      );

      context.fillText(
        `State: ${
          selection?.state || "idle"
        }`,
        20,
        166
      );

      animationFrameId =
        requestAnimationFrame(
          detectHands
        );
    };

    setup();

    return () => {
      stopped = true;

      if (animationFrameId) {
        cancelAnimationFrame(
          animationFrameId
        );
      }

      if (stream) {
        stream
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      }

      if (handLandmarker) {
        handLandmarker.close();
      }

      resetRectangleSelection();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px] bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
    </div>
  );
}