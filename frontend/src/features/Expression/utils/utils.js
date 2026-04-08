import {
  FaceLandmarker,
  FilesetResolver
} from "@mediapipe/tasks-vision";

/* ============================= */
/* INIT CAMERA + LANDMARKER */
/* ============================= */

export const init = async ({ landmarkerRef, videoRef, streamRef }) => {

  const video = videoRef?.current;
  if (!video) return; // prevent null crash

  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    landmarkerRef.current = await FaceLandmarker.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1
      }
    );

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    });

    streamRef.current = stream;

    video.srcObject = stream;

    await new Promise((resolve) => {
      video.onloadedmetadata = () => resolve();
    });

    await video.play().catch(() => { });

  } catch (error) {
    console.error("Camera initialization failed:", error);
  }
};


/* ============================= */
/* FACE DETECTION */
/* ============================= */

export const detect = ({ landmarkerRef, videoRef, setExpression }) => {

  if (!landmarkerRef.current || !videoRef.current) return;
  if (videoRef.current.readyState < 2) return;

  const results = landmarkerRef.current.detectForVideo(
    videoRef.current,
    performance.now()
  );

  const categories = results?.faceBlendshapes?.[0]?.categories;

  if (!categories) return;

  /* OPTIMIZED LOOKUP MAP */

  const map = {};
  for (const c of categories) {
    map[c.categoryName] = c.score;
  }

  const getScore = (name) => map[name] || 0;

  /* ============================= */
  /* YOUR ORIGINAL EXPRESSION LOGIC */
  /* ============================= */

  const smile =
    (getScore("mouthSmileLeft") + getScore("mouthSmileRight")) / 2;

  const frown =
    (getScore("mouthFrownLeft") + getScore("mouthFrownRight")) / 2;

  const browInnerUp = getScore("browInnerUp") / 2;

  const browDown =
    (getScore("browDownLeft") + getScore("browDownRight")) / 2;

  const noseSneer =
    (getScore("noseSneerLeft") + getScore("noseSneerRight")) / 2;

  const jawOpen = getScore("jawOpen");

  const browOuterUp =
    (getScore("browOuterUpLeft") + getScore("browOuterUpRight")) / 2;

  let currentExpression = "neutral";

  if (smile > 0.18) {
    currentExpression = "happy";
  }

  else if (browDown > 0.25 || noseSneer > 0.25) {
    currentExpression = "angry";
  }

  else if (jawOpen > 0.25 && browOuterUp > 0.2) {
    currentExpression = "surprise";
  }

  else if (frown > 0.15 || browInnerUp > 0.25) {
    currentExpression = "sad";
  }

  else if (
    smile < 0.08 &&
    frown < 0.08 &&
    jawOpen < 0.05 &&
    browDown < 0.08
  ) {
    currentExpression = "calm";
  }

  else {
    currentExpression = "neutral";
  }

  setExpression(currentExpression);

  return currentExpression;
};