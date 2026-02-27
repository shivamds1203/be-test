import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import Webcam from 'react-webcam';

export const useProctoring = (webcamRef: React.RefObject<Webcam | null>) => {
    const [warnings, setWarnings] = useState(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const [isModelLoading, setIsModelLoading] = useState(true);

    const [lastWarningTime, setLastWarningTime] = useState<number>(0);

    const addWarning = (reason: string) => {
        const now = Date.now();
        const FIVE_MINUTES = 5 * 60 * 1000;
        
        // Only allow a warning if 5 minutes have passed since the last one
        if (now - lastWarningTime < FIVE_MINUTES) {
            console.log(`Warning suppressed. Next warning allowed in ${Math.ceil((FIVE_MINUTES - (now - lastWarningTime)) / 1000)} seconds.`);
            return;
        }

        setLastWarningTime(Date.now());
        
        setWarnings(prev => {
            const newWarnings = prev + 1;
            alert(`Warning: ${reason} (${newWarnings}/3 warnings). Next warning can only occur after 5 minutes.`);
            return newWarnings;
        });
    };

    // Tab switching anti-cheat
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                addWarning("You have switched tabs!");
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [lastWarningTime]);

    // Audio & Face Tracking
    useEffect(() => {
        let animationFrameId: number;
        let detector: faceLandmarksDetection.FaceLandmarksDetector;

        const setupProctoring = async () => {
            try {
                await tf.setBackend('webgl');
                const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
                const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshTfjsModelConfig = {
                    runtime: 'tfjs', // Use tfjs runtime directly to avoid CDN issues
                    refineLandmarks: false,
                };
                detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
                setIsModelLoading(false);

                // Setup Audio context once user grants permission
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                const source = audioContextRef.current.createMediaStreamSource(stream);
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 256;
                source.connect(analyserRef.current);

                detectProctoring();
            } catch (err) {
                console.error("Proctoring setup error:", err);
                setIsModelLoading(false);
            }
        };

        let anomalousFrames = 0;
        let audioSpikes = 0;

        const detectProctoring = async () => {
            if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4 && detector) {
                const video = webcamRef.current.video;

                // --- Face Detection ---
                try {
                    const faces = await detector.estimateFaces(video, { flipHorizontal: false });

                    if (faces.length === 0) {
                        anomalousFrames++;
                    } else if (faces.length > 1) {
                        // Multiple people detected
                        anomalousFrames += 2;
                    } else {
                        // Check head pose
                        const face = faces[0];
                        const keypoints = face.keypoints;

                        // Simplistic heuristic: nose should be roughly between eyes
                        const nose = keypoints.find(k => k.name === 'noseTip');
                        const leftEye = keypoints.find(k => k.name === 'leftEye');
                        const rightEye = keypoints.find(k => k.name === 'rightEye');

                        if (nose && leftEye && rightEye) {
                            const eyeDist = Math.abs(leftEye.x - rightEye.x);
                            const noseToLeft = Math.abs(nose.x - leftEye.x);
                            // If ratio is extremely skewed, they are turned away
                            const ratio = noseToLeft / (eyeDist || 1);
                            if (ratio < 0.2 || ratio > 0.8) {
                                anomalousFrames++;
                            } else {
                                anomalousFrames = Math.max(0, anomalousFrames - 1);
                            }
                        }
                    }

                    if (anomalousFrames > 50) { // ~1.5 seconds at 30fps
                        addWarning("Face not strictly visible or looking away continuously.");
                        anomalousFrames = 0; // Reset after warning
                    }
                } catch (e) {
                    console.error(e);
                }

                // --- Audio Detection ---
                if (analyserRef.current) {
                    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                    analyserRef.current.getByteFrequencyData(dataArray);

                    // Calculate RMS
                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        sum += dataArray[i] * dataArray[i];
                    }
                    const rms = Math.sqrt(sum / dataArray.length);

                    if (rms > 50) { // Rough threshold for background noise/speech
                        audioSpikes++;
                    } else {
                        audioSpikes = Math.max(0, audioSpikes - 1);
                    }

                    if (audioSpikes > 60) { // Continuous noise for ~2 seconds
                        addWarning("Continuous anomalous background noise or speaking detected.");
                        audioSpikes = 0;
                    }
                }
            }
            animationFrameId = requestAnimationFrame(detectProctoring);
        };

        setupProctoring();

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [lastWarningTime]);

    return { warnings, isModelLoading };
};
