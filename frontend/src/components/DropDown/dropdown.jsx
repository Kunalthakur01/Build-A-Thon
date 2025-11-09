import React from 'react'

import './dropdown.css';

import { poseImages } from '../../assets/pose_images'

export default function DropDown({ poseList, currentPose, setCurrentPose }) {
return (
    <div className='dropdown-container'>
        <select 
            className="pose-select"
            value={currentPose}
            onChange={(e) => setCurrentPose(e.target.value)}
            aria-label="Select pose"
        >
            {poseList.map((pose) => (
                <option key={pose} value={pose}>
                    {pose}
                </option>
            ))}
        </select>
        <div className="selected-pose-preview">
            <img 
                src={poseImages[currentPose]}
                className="dropdown-img"
                alt={`${currentPose} pose`}
            />
        </div>
    </div>
    );
}