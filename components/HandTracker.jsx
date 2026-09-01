"use client";

import {
  getStableGesture,
  resetGestureStability,
} from "../utils/gestureStability";

import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  HandLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

import { detectGesture } from "../utils/gestureDetection";

export default function HandTracker() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [status, setStatus] = useState("Loading hand tracking...");
  const [gesture, setGesture] = useState("none");

  useEffect(() => {
    let stream = null;
    let animationFrameId = null;
    let handLandmarker = null;

    async function setup() {
      try {
        setStatus("Loading MediaPipe...");

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );

        setStatus("Loading hand model...");

        handLandmarker = await HandLandmarker.createFromOptions(vision, {
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
        });

        setStatus("Starting camera...");

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: false,
        });

        const video = videoRef.current;

        if (!video) {
          throw new Error("Video element not found");
        }

        video.srcObject = stream;

        await video.play();

        setStatus("Hand tracking active");

        detectHands();
      } catch (error) {
        console.error("Hand tracking setup failed:", error);

        setStatus(
          `Error: ${error?.message || "Unable to initialize hand tracking"}`
        );
      }
    }

    function detectHands() {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || !handLandmarker) {
        return;
      }

      if (video.readyState >= 2) {
        const canvasWidth = video.videoWidth;
        const canvasHeight = video.videoHeight;

        if (canvas.width !== canvasWidth) {
          canvas.width = canvasWidth;
        }

        if (canvas.height !== canvasHeight) {
          canvas.height = canvasHeight;
        }

        const context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);

        const results = handLandmarker.detectForVideo(
          video,
          performance.now()
        );

        const drawingUtils = new DrawingUtils(context);

        if (results.landmarks?.length > 0) {
          for (const landmarks of results.landmarks) {
            drawingUtils.drawConnectors(
              landmarks,
              HandLandmarker.HAND_CONNECTIONS,
              {
                lineWidth: 3,
              }
            );

            drawingUtils.drawLandmarks(landmarks, {
              radius: 5,
            });
          }

          // Detect gesture from the first detected hand
          const detectedGesture = detectGesture(results.landmarks[0]);
          const stableGesture = getStableGesture(detectedGesture);

          setGesture(stableGesture);

          setStatus(`Hand detected: ${results.landmarks.length}`);
        } else {
          setGesture("none");
          setStatus("Show your hand to the camera");
        }
      }

      animationFrameId = requestAnimationFrame(detectHands);
    }

    setup();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (handLandmarker) {
        handLandmarker.close();
      }
      resetGestureStability();
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Tracking status */}
      <div className="absolute left-4 top-4 rounded-full bg-black/60 px-4 py-2 text-sm text-white backdrop-blur">
        {status}
      </div>

      {/* Gesture */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-2xl bg-black/70 px-6 py-4 text-center backdrop-blur">
        <p className="text-xs uppercase tracking-widest text-white/40">
          Detected gesture
        </p>

        <p className="mt-1 text-xl font-semibold text-white">
          {gesture === "open_palm"
            ? "OPEN PALM"
            : gesture === "point"
            ? "POINT"
            : gesture === "pinch"
            ? "PINCH"
            : gesture === "fist"
            ? "FIST"
            : "NONE"}
        </p>
      </div>
    </div>
  );
}