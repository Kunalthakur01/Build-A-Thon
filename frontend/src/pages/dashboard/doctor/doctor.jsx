import React, { useState, useEffect } from 'react';
import './doctor.css';
import { getDashboardStats, getAllPatients, getPatientStats } from './api';

function DoctorDash() {
    const [patients, setPatients] = useState([]);
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalSessions: 0,
        averageAccuracy: 0,
        sessionsToday: 0
    });
    const [selectedTimeframe, setSelectedTimeframe] = useState('week');
    const [selectedMetric, setSelectedMetric] = useState('sessions');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsData, patientsData] = await Promise.all([
                    getDashboardStats(),
                    getAllPatients()
                ]);
                
                setStats(statsData);
                setPatients(patientsData);
                setError(null);
            } catch (err) {
                setError(err.message || 'Failed to fetch dashboard data');
                if (err.message === 'Not authorized to access this route') {
                    window.location.href = '/';
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    useEffect(() => {
        const fetchPatientStats = async () => {
            try {
                setLoading(true);
                const patientStats = await getPatientStats(selectedTimeframe);
                // Update patient data with stats
                const updatedPatients = patients.map(patient => {
                    const stats = patientStats.find(stat => stat._id.toString() === patient._id.toString());
                    return {
                        ...patient,
                        completedSessions: stats?.completedSessions || 0,
                        accuracy: stats?.averageAccuracy || 0,
                        lastActive: stats?.lastActive ? new Date(stats.lastActive).toLocaleString() : 'Never'
                    };
                });
                setPatients(updatedPatients);
                setError(null);
            } catch (err) {
                setError(err.message || 'Failed to fetch patient statistics');
            } finally {
                setLoading(false);
            }
        };

        if (patients.length > 0) {
            fetchPatientStats();
        }
    }, [selectedTimeframe, patients.length]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className='doctor-dash'>
            <nav className="doctor-nav">
                <h2>Doctor Dashboard</h2>
                <button
                    className='logout-btn'
                    onClick={() => {
                        try {
                            localStorage.removeItem('doctorToken');
                        } finally {
                            window.location.href = '/login';
                        }
                    }}
                >
                    Logout
                </button>
            </nav>

            <div className="dashboard-content">
                {/* Statistics Overview */}
                <div className="dashboard-card">
                    <h3>Overview</h3>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>{stats.totalPatients}</h3>
                            <p>Active Patients</p>
                        </div>
                        <div className="stat-card">
                            <h3>{stats.totalSessions}</h3>
                            <p>Total Sessions</p>
                        </div>
                        <div className="stat-card">
                            <h3>{Math.round(stats.averageAccuracy)}%</h3>
                            <p>Average Accuracy</p>
                        </div>
                        <div className="stat-card">
                            <h3>{stats.sessionsToday}</h3>
                            <p>Sessions Today</p>
                        </div>
                    </div>
                </div>

                {/* Patient List */}
                <div className="dashboard-card">
                    <h3>Patients</h3>
                    <div className="filters">
                        <select 
                            className="filter-select"
                            value={selectedTimeframe}
                            onChange={(e) => setSelectedTimeframe(e.target.value)}
                        >
                            <option value="week">Last Week</option>
                            <option value="month">Last Month</option>
                            <option value="year">Last Year</option>
                        </select>
                        <select 
                            className="filter-select"
                            value={selectedMetric}
                            onChange={(e) => setSelectedMetric(e.target.value)}
                        >
                            <option value="sessions">Sessions</option>
                            <option value="accuracy">Accuracy</option>
                        </select>
                    </div>
                    <div className="patient-list">
                        {patients.map(patient => (
                            <div key={patient._id} className="patient-card">
                                <div className="patient-info">
                                    <h4>{patient.username}</h4>
                                    <p>Last Active: {patient.lastActive}</p>
                                </div>
                                <div className="patient-stats">
                                    <div className="stat">
                                        <label>Sessions:</label>
                                        <span>{patient.completedSessions}</span>
                                    </div>
                                    <div className="stat">
                                        <label>Accuracy:</label>
                                        <span>{Math.round(patient.accuracy)}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorDash;
//                             <div key={patient.id} className="patient-item">
//                                 <div className="patient-info">
//                                     <h4>{patient.name}</h4>
//                                     <p>Last active: {patient.lastActive}</p>
//                                     <p>Sessions: {patient.completedSessions}</p>
//                                     <div className="patient-progress">
//                                         <div 
//                                             className="progress-bar" 
//                                             style={{width: `${patient.progress}%`}}
//                                         ></div>
//                                     </div>
//                                 </div>
//                                 <div className="patient-actions">
//                                     <button onClick={() => console.log('View details', patient.id)}>
//                                         Details
//                                     </button>
//                                     <button onClick={() => console.log('Assign poses', patient.id)}>
//                                         Assign
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default DoctorDash;