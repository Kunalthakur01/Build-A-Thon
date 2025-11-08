import { redirect } from 'react-router-dom';

async function patientAuthCheck({ request }) {
    const token = localStorage.getItem('patientToken');
    const pathname = new URL(request.url).pathname;

    if(!token) {
        throw redirect(`/login?message=You must login first&redirectTo=${pathname}`);
    }

    return null;
}

export default patientAuthCheck;