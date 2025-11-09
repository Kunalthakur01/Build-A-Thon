import React, { useState } from 'react'

import './instructions.css';

import { poseInstructions } from '../../assets/data'

import { poseImages } from '../../assets/pose_images'

export default function Instructions({ currentPose }) {

    const [instructions, setInsntructions] = useState(poseInstructions)

    return (
        <div className="instructions-container">
            <ul className="instructions-list">
                {instructions[currentPose].map((instruction) => {
                    return(
                        <li className="instruction">{instruction}</li>
                    )
                    
                })}
            </ul>
            <img 
                className="pose-demo-img"
                src={poseImages[currentPose]}
            />
        </div>
    )
}