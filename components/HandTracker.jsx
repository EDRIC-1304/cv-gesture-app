"use client";

import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  HandLandmarker,
} from "@mediapipe/tasks-vision";

export default function HandTracker() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [status, setStatus] = useState("Loading hand tracking...");

  useEffect(() => {
    let stream;
    let animationFrameId;
    let handLandmarker;

    async function setup() {
      try {
        // Load MediaPipe vision runtime
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm"
        );

        // Load the pretrained Hand Landmarker
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        });

        // Start front-facing camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: false,
        });

        if (!videoRef.current) return;

        videoRef.current.srcObject = stream;

        videoRef.current.onloadeddata = () => {
          setStatus("Hand tracking active");
          detectHands();
        };
      } catch (error) {
        console.error("Hand tracking setup failed:", error);
        setStatus("Unable to start hand tracking");
      }
    }

    function detectHands() {
      if (!videoRef.current || !canvasRef.current || !handLandmarker) {
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (video.readyState >= 2) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const result = handLandmarker.detectForVideo(
          video,
          performance.now()
        );

        context.clearRect(0, 0, canvas.width, canvas.height);

        for (const landmarks of result.landmarks) {
          for (const point of landmarks) {
            context.beginPath();
            context.arc(
              point.x * canvas.width,
              point.y * canvas.height,
              5,
              0,
              Math.PI * 2
            );
            context.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(detectHands);
    }

    setup();

    return () => {
      cancelAnimationFrame(animationFrameId);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (handLandmarker) {
        handLandmarker.close();
      }
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

      <div className="absolute left-4 top-4 rounded-full bg-black/60 px-4 py-2 text-sm text-white backdrop-blur">
        {status}
      </div>
    </div>
  );
}