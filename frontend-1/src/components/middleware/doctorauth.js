import { redirect } from 'react-router-dom';

async function doctorAuthCheck({ request }) {
    const token = localStorage.getItem('doctorToken');
    const pathname = new URL(request.url).pathname;

    if(!token) {
        throw redirect(`/login?message=You must login first&redirectTo=${pathname}`);
    }

    return null;
}

export default doctorAuthCheck;