// Constants for pose matching
const MIN_POSE_CONFIDENCE = 0.2;
const MIN_PART_CONFIDENCE = 0.5;
const POSE_SIMILARITY_THRESHOLD = 0.65;

// Reference angles for each pose
const poseAngles = {
    Tree: {
        leftHip: { min: 170, max: 190 },
        rightHip: { min: 170, max: 190 },
        rightKnee: { min: 80, max: 100 },
        // Tree pose specific - one leg should be bent
        leftKnee: { min: 0, max: 30 }
    },
    Warrior: {
        leftHip: { min: 130, max: 150 },
        rightHip: { min: 160, max: 180 },
        leftKnee: { min: 80, max: 100 },
        rightKnee: { min: 160, max: 180 }
    },
    // Add other poses...
};

// Calculate angle between three points
function calculateAngle(a, b, c) {
    if (!a || !b || !c) return 0;
    
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    
    if (angle > 180.0) {
        angle = 360 - angle;
    }
    return angle;
}

// Get angles for current pose
function getAngles(keypoints) {
    const angles = {};
    
    // Left Hip Angle
    if (keypoints[POINTS.LEFT_SHOULDER] && keypoints[POINTS.LEFT_HIP] && keypoints[POINTS.LEFT_KNEE]) {
        angles.leftHip = calculateAngle(
            keypoints[POINTS.LEFT_SHOULDER],
            keypoints[POINTS.LEFT_HIP],
            keypoints[POINTS.LEFT_KNEE]
        );
    }

    // Right Hip Angle
    if (keypoints[POINTS.RIGHT_SHOULDER] && keypoints[POINTS.RIGHT_HIP] && keypoints[POINTS.RIGHT_KNEE]) {
        angles.rightHip = calculateAngle(
            keypoints[POINTS.RIGHT_SHOULDER],
            keypoints[POINTS.RIGHT_HIP],
            keypoints[POINTS.RIGHT_KNEE]
        );
    }

    // Left Knee Angle
    if (keypoints[POINTS.LEFT_HIP] && keypoints[POINTS.LEFT_KNEE] && keypoints[POINTS.LEFT_ANKLE]) {
        angles.leftKnee = calculateAngle(
            keypoints[POINTS.LEFT_HIP],
            keypoints[POINTS.LEFT_KNEE],
            keypoints[POINTS.LEFT_ANKLE]
        );
    }

    // Right Knee Angle
    if (keypoints[POINTS.RIGHT_HIP] && keypoints[POINTS.RIGHT_KNEE] && keypoints[POINTS.RIGHT_ANKLE]) {
        angles.rightKnee = calculateAngle(
            keypoints[POINTS.RIGHT_HIP],
            keypoints[POINTS.RIGHT_KNEE],
            keypoints[POINTS.RIGHT_ANKLE]
        );
    }

    return angles;
}

// Check if the pose matches the expected pose
export function checkPoseMatch(keypoints, poseName) {
    if (!keypoints || !poseName || !poseAngles[poseName]) {
        return false;
    }

    // Check if we have enough confidence in the key points
    const confidentPose = keypoints.every(keypoint => keypoint.score > MIN_POSE_CONFIDENCE);
    if (!confidentPose) return false;

    const currentAngles = getAngles(keypoints);
    const expectedAngles = poseAngles[poseName];
    let matchedAngles = 0;
    let totalAngles = 0;

    // Compare each angle with expected range
    for (const [angleName, range] of Object.entries(expectedAngles)) {
        if (currentAngles[angleName]) {
            totalAngles++;
            if (currentAngles[angleName] >= range.min && currentAngles[angleName] <= range.max) {
                matchedAngles++;
            }
        }
    }

    // Calculate similarity score
    const similarityScore = matchedAngles / totalAngles;
    return similarityScore > POSE_SIMILARITY_THRESHOLD;
}