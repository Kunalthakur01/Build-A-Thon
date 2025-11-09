import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const getAuthHeader = () => {
    const token = localStorage.getItem('doctorToken');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const getDashboardStats = async () => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/doctor/stats`,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getAllPatients = async () => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/doctor/patients`,
            getAuthHeader()
        );
        return response.data.patients;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getPatientStats = async (timeframe = 'week') => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/doctor/patient-stats?timeframe=${timeframe}`,
            getAuthHeader()
        );
        return response.data.patientStats;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};