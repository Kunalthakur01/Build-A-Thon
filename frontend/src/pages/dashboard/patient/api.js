import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const getAuthHeader = () => {
    const token = localStorage.getItem('patientToken');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const saveSession = async (sessionData) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/sessions`,
            sessionData,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getMySessionHistory = async () => {
    try {
        const userId = JSON.parse(atob(localStorage.getItem('patientToken').split('.')[1])).id;
        const response = await axios.get(
            `${API_BASE_URL}/sessions/patient/${userId}`,
            getAuthHeader()
        );
        return response.data.sessions;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getMyStats = async () => {
    try {
        const userId = JSON.parse(atob(localStorage.getItem('patientToken').split('.')[1])).id;
        const response = await axios.get(
            `${API_BASE_URL}/sessions/patient/${userId}/stats`,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};