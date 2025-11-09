import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import { useRef, useState, useEffect } from 'react';
import '@tensorflow/tfjs-backend-webgl';
import Webcam from 'react-webcam';
import Instructions from '../../../components/instructions/instructions.jsx';
import { StatsPanel } from './StatsPanel.jsx';
import { saveSession, getMySessionHistory, getMyStats } from './api.js';

import './patient.css';
import './stats.css';
 
import DropDown from '../../../components/dropdown/dropdown.jsx';
import { poseImages } from '../../../assets/pose_images';
import { POINTS, connectedParts } from '../../../assets/data/connections';
import { drawPoint, drawSegment } from '../../../assets/helper';
import { checkPoseMatch } from '../../../assets/helper/poseChecking';

let skeletonColor = 'rgb(255,255,255)';
const correctPoseColor = 'rgb(0,255,0)';
let poseList = [
    'Tree', 'Chair', 'Cobra', 'Warrior', 'Dog',
    'Shoulderstand', 'Traingle'
];

let interval;
let flag = false;

// Define pose class numbers for classification
const CLASS_NO = {
    Tree: 6,
    Chair: 0,
    Cobra: 1,
    Warrior: 7,
    Dog: 2,
    Shoulderstand: 4,
    Traingle: 5,
    No_Pose: 3
};

function get_center_point(landmarks, left_bodypart, right_bodypart) {
    let left = tf.gather(landmarks, left_bodypart, 1);
    let right = tf.gather(landmarks, right_bodypart, 1);
    const center = tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5));
    return center;
}

function get_pose_size(landmarks, torso_size_multiplier=2.5) {
    let hips_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    let shoulders_center = get_center_point(landmarks, POINTS.LEFT_SHOULDER, POINTS.RIGHT_SHOULDER);
    let torso_size = tf.norm(tf.sub(shoulders_center, hips_center));
    let pose_center_new = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    pose_center_new = tf.expandDims(pose_center_new, 1);
    pose_center_new = tf.broadcastTo(pose_center_new, [1, 17, 2]);
    let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0);
    let max_dist = tf.max(tf.norm(d, 'euclidean', 0));
    let pose_size = tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist);
    return pose_size;
}

function normalize_pose_landmarks(landmarks) {
    let pose_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    pose_center = tf.expandDims(pose_center, 1);
    pose_center = tf.broadcastTo(pose_center, [1, 17, 2]);
    landmarks = tf.sub(landmarks, pose_center);
    let pose_size = get_pose_size(landmarks);
    landmarks = tf.div(landmarks, pose_size);
    return landmarks;
}

function landmarks_to_embedding(landmarks) {
    landmarks = tf.tensor(landmarks);
    landmarks = normalize_pose_landmarks(landmarks);
    return tf.reshape(landmarks, [1, 34]);
}

function Yoga() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const [startingTime, setStartingTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [poseTime, setPoseTime] = useState(0);
    const [bestPerform, setBestPerform] = useState(0);
    const [currentPose, setCurrentPose] = useState('Tree');
    const [isStartPose, setIsStartPose] = useState(false);
    const [isPoseCorrect, setIsPoseCorrect] = useState(false);
    const [stats, setStats] = useState(null);
    const [sessionHistory, setSessionHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sessionData, setSessionData] = useState({
        poses: [],
        currentPoseData: null
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [statsData, historyData] = await Promise.all([
                getMyStats(),
                getMySessionHistory()
            ]);
            setStats(statsData);
            setSessionHistory(historyData);
        } catch (error) {
            console.error('Failed to load statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentTime > 0 && startingTime > 0) {
            const timeDiff = (currentTime - startingTime) / 1000;
            if (flag && isPoseCorrect) {
                setPoseTime(timeDiff);
                // Update current pose data
                setSessionData(prev => ({
                    ...prev,
                    currentPoseData: {
                        poseName: currentPose,
                        accuracy: 97, // This should be dynamic based on actual accuracy
                        duration: timeDiff,
                        completed: timeDiff >= 10 // Consider pose completed after 10 seconds
                    }
                }));
            }
            if (timeDiff > bestPerform) {
                setBestPerform(timeDiff);
            }
        }
    }, [currentTime, isPoseCorrect, startingTime, flag]);

    useEffect(() => {
        setCurrentTime(0);
        setPoseTime(0);
        setBestPerform(0);
        // Reset session data for new pose
        setSessionData(prev => ({
            ...prev,
            currentPoseData: null
        }));
    }, [currentPose]);

    const saveCurrentSession = async () => {
        if (sessionData.currentPoseData) {
            const updatedPoses = [...sessionData.poses, sessionData.currentPoseData];
            const averageAccuracy = updatedPoses.reduce((acc, pose) => acc + pose.accuracy, 0) / updatedPoses.length;
            
            try {
                await saveSession({
                    poses: updatedPoses,
                    overallAccuracy: averageAccuracy
                });
                loadStats(); // Reload stats after saving
            } catch (error) {
                console.error('Failed to save session:', error);
            }
        }
    };

    async function runMovenet() {
        try {
            console.log('Initializing pose detection...');
            const detectorConfig = {
                modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER
            };

            const detector = await poseDetection.createDetector(
                poseDetection.SupportedModels.MoveNet,
                detectorConfig
            );
            console.log('Pose detector initialized successfully');

            const poseClassifier = await tf.loadLayersModel('https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json');
            console.log('Pose classifier model loaded successfully');

            interval = setInterval(() => {
                detectPose(detector, poseClassifier);
            }, 100);
        } catch (error) {
            console.error('Error in runMovenet:', error);
        }
    }

    async function detectPose(detector, poseClassifier) {
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            const video = webcamRef.current.video;
            const pose = await detector.estimatePoses(video);
            
            if (pose.length > 0) {
                try {
                    // Convert keypoints to input format for classifier
                    const keypoints = pose[0].keypoints;
                    const keypointsArray = keypoints.map(point => [point.x, point.y]);
                    
                    // Log keypoints for debugging
                    console.log('Keypoints detected:', keypointsArray.length);
                    
                    // Process input for classification
                    const processedInput = landmarks_to_embedding(keypointsArray);
                    console.log('Processed input shape:', processedInput.shape);
                    
                    // Get pose prediction
                    const predictions = await poseClassifier.predict(processedInput).array();
                    console.log('Raw predictions:', predictions[0]);
                    
                    const classNo = CLASS_NO[currentPose];
                    const confidence = predictions[0][classNo];
                    console.log('Current pose:', currentPose, 'Class number:', classNo, 'Confidence:', confidence);
                    
                    // Lower threshold for testing
                    const isCorrect = confidence > 0.4;
                    setIsPoseCorrect(isCorrect);
                    
                    // Update timer and color based on pose correctness
                    const currentTimeStamp = new Date(Date.now()).getTime();
                    if (isCorrect) {
                        console.log('Pose is correct! Confidence:', confidence);
                        skeletonColor = correctPoseColor;
                        
                        if (!flag) {
                            console.log('Starting timer for correct pose...');
                            setStartingTime(currentTimeStamp);
                            flag = true;
                        }
                        setCurrentTime(currentTimeStamp);
                    } else {
                        console.log('Pose is incorrect. Confidence:', confidence);
                        skeletonColor = 'rgb(255,255,255)';
                        
                        if (flag) {
                            console.log('Pose lost, resetting timer...');
                            flag = false;
                        }
                    }
                    
                    // Draw canvas with current pose state
                    drawCanvas(pose[0], video, isCorrect);
                } catch (error) {
                    console.error('Error in pose detection:', error);
                    skeletonColor = 'rgb(255,255,255)';
                }
            }
        }
    }

    function drawCanvas(pose, video, isCorrect) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Set the color based on pose correctness
        const currentColor = isCorrect ? correctPoseColor : skeletonColor;
        console.log('Drawing with color:', currentColor, 'isCorrect:', isCorrect, 'skeletonColor:', skeletonColor);

        try {
            // Draw keypoints
            let visibleKeypoints = 0;
            pose.keypoints.forEach(keypoint => {
                if (keypoint.score > 0.4) {
                    drawPoint(ctx, keypoint.x, keypoint.y, 8, currentColor);
                    visibleKeypoints++;
                }
            });
            console.log('Visible keypoints drawn:', visibleKeypoints);

            // Draw skeleton
            let visibleConnections = 0;
            connectedParts.forEach(([firstPart, secondPart]) => {
                const firstPointIndex = POINTS[firstPart];
                const secondPointIndex = POINTS[secondPart];

                const firstKeypoint = pose.keypoints[firstPointIndex];
                const secondKeypoint = pose.keypoints[secondPointIndex];

                if (firstKeypoint && secondKeypoint && 
                    firstKeypoint.score > 0.4 && secondKeypoint.score > 0.4) {
                    drawSegment(
                        ctx,
                        [firstKeypoint.x, firstKeypoint.y],
                        [secondKeypoint.x, secondKeypoint.y],
                        currentColor
                    );
                    visibleConnections++;
                }
            });
            console.log('Visible connections drawn:', visibleConnections);
        } catch (error) {
            console.error('Error drawing canvas:', error);
        }
    }

    function startYoga() {
        setIsStartPose(true);
        runMovenet();
    }

    function stopPose() {
        setIsStartPose(false);
        setIsPoseCorrect(false);
        clearInterval(interval);
        saveCurrentSession();
        flag = false;  // Reset the flag when stopping
        setStartingTime(0);
        setCurrentTime(0);
        setPoseTime(0);
    }

    // Cleanup effect when component unmounts
    useEffect(() => {
        return () => {
            if (interval) {
                clearInterval(interval);
            }
            flag = false;
        };
    }, []);

    return (
        <>
            <nav className="yoga-nav">
                <h2>Yoga Pose Practice</h2>
                <button
                    className='logout-btn'
                    onClick={() => {
                        try {
                            localStorage.removeItem('patientToken');
                        } finally {
                            window.location.href = '/';
                        }
                    }}
                >
                    Logout
                </button>
            </nav>
            <div className="yoga-container">
                <div className="main-content">
                    <div className="controls">
                        <DropDown
                            poseList={poseList}
                            currentPose={currentPose}
                            setCurrentPose={setCurrentPose}
                        />
                        <Instructions currentPose={currentPose} />
                        <button
                            onClick={isStartPose ? stopPose : startYoga}
                            className="start-btn"
                        >
                            {isStartPose ? 'Stop Pose' : 'Start Pose'}
                        </button>
                    </div>

                    {isStartPose && (
                        <div className="practice-area">
                            <div className="performance-container">
                                <div className="performance-text">
                                    <span>Pose Time: {poseTime} s</span>
                                </div>
                                <div className="performance-text">
                                    <span>Best: {bestPerform} s</span>
                                </div>
                            </div>
                        <div className="webcam-container">
                            <Webcam
                                width='640px'
                                height='480px'
                                id="webcam"
                                ref={webcamRef}
                            />
                            <canvas
                                ref={canvasRef}
                                id="my-canvas"
                                width='640px'
                                height='480px'
                            />
                        </div>
                        <div>
                            <img
                                src={poseImages[currentPose]}
                                className="pose-img"
                            />
                        </div>
                        </div>
                    )}
                </div>
                <StatsPanel stats={stats} sessionHistory={sessionHistory} />
            </div>
        </>
    );
}

export default Yoga;