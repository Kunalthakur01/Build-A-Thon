import React from 'react';
import './stats.css';

export function StatsPanel({ stats, sessionHistory }) {
    return (
        <div className="right-panel">
            {/* Overall Statistics */}
            <div className="stats-section">
                <h3 className="stats-header">Your Progress</h3>
                <div className="stat-item">
                    <span>Total Sessions</span>
                    <span className="stat-value">{stats?.totalSessions || 0}</span>
                </div>
                <div className="stat-item">
                    <span>Average Accuracy</span>
                    <span className="stat-value">{Math.round(stats?.averageAccuracy || 0)}%</span>
                </div>
                <div className="stat-item">
                    <span>Sessions Today</span>
                    <span className="stat-value">{stats?.sessionsToday || 0}</span>
                </div>
            </div>

            {/* Session History */}
            <div className="history-section">
                <h3 className="history-header">Recent Sessions</h3>
                {sessionHistory && sessionHistory.map((session) => (
                    <div key={session._id} className="session-item">
                        <div className="session-date">
                            {new Date(session.createdAt).toLocaleDateString()} at{' '}
                            {new Date(session.createdAt).toLocaleTimeString()}
                        </div>
                        <div className="session-poses">
                            {session.poses.map((pose, index) => (
                                <span key={index} className="pose-tag">
                                    {pose.poseName}
                                </span>
                            ))}
                        </div>
                        <div className="session-accuracy">
                            Accuracy: {Math.round(session.overallAccuracy)}%
                        </div>
                    </div>
                ))}
                {(!sessionHistory || sessionHistory.length === 0) && (
                    <div style={{ color: '#999', textAlign: 'center', marginTop: '20px' }}>
                        No sessions recorded yet
                    </div>
                )}
            </div>
        </div>
    );
}