import React from 'react';
import { Form, useLoaderData, redirect, useNavigation, useActionData, Link } from 'react-router-dom';
import axios from 'axios';

import './signup.css';

async function action({ request }) {
  const formData = await request.formData();
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');
  const role = formData.get('role');
  try {
    const res = await axios.post('http://localhost:3000/api/v1/signup', { username, email, password, role });
    const data = res.data;
    
    if(data.user.role === 'doctor') {
      localStorage.setItem('doctorToken', data.token);
      return redirect('/doctor');
    }

    if (data.user.role === 'patient') {
      localStorage.setItem('patientToken', data.token);
      return redirect('/patient');
    }
  } catch (err) {
    console.error(err);
    return err.message;
  }
}

function SignupPage() {
  const status = useNavigation().state;
  const err = useActionData();

  return (
    <div className='signup-container'>
      <h1>Create your account</h1>
      { err && <h3 className='red'>{ err }</h3> }
      <Form method='post' replace={ true } className='signup-form'>
          <input name='username' type='text' placeholder='Username' className='username-input'/>
          <input name='email' type='email' placeholder='Email' className='email-input'/>
          <input name='password' type='password' placeholder='Password' className='password-input'/>
          <select name="role" className='role-select'>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
          <button disabled={ status === 'submitting' }>{ status === 'submitting' ? 'Signing up...' : 'Signup' }</button>
      </Form>
      <Link to='/login' className='login-link'>Already have an account? Login</Link>
    </div>
  );
}

SignupPage.action = action;
export default SignupPage;