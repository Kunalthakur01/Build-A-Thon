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
import { POINTS, keypointConnections } from '../../../assets/data';
import { drawPoint, drawSegment } from '../../../assets/helper';

let skeletonColor = 'rgb(255,255,255)';
let poseList = [
    'Tree', 'Chair', 'Cobra', 'Warrior', 'Dog',
    'Shoulderstand', 'Traingle'
];

let interval;
let flag = false;

function Yoga() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const [startingTime, setStartingTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [poseTime, setPoseTime] = useState(0);
    const [bestPerform, setBestPerform] = useState(0);
    const [currentPose, setCurrentPose] = useState('Tree');
    const [isStartPose, setIsStartPose] = useState(false);
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
        const timeDiff = (currentTime - startingTime) / 1000;
        if (flag) {
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
    }, [currentTime]);

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

    function startYoga() {
        setIsStartPose(true);
        runMovenet();
    }

    function stopPose() {
        setIsStartPose(false);
        clearInterval(interval);
        saveCurrentSession();
    }

    // ... (keep existing pose detection code)

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