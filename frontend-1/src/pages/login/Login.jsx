import React from 'react';
import { Form, redirect, useNavigation, useActionData } from 'react-router-dom';
import axios from 'axios';

import './login.css';

async function action({ request }) {
  const formData = await request.formData();
  const username = formData.get('username');
  const password = formData.get('password');
  try {
    const res = await axios.post('http://localhost:3000/api/v1/login', { username, password });
    const data = res.data;

    if(data.user.role === 'doctor') {
      localStorage.setItem('doctorToken', data.token);
      return redirect('/doctor/dashboard');
    }

    if (data.user.role === 'patient') {
      localStorage.setItem('patientToken', data.token);
      return redirect('/patient/dashboard');
    }
  } catch (err) {
    console.error(err);
    return err.message;
  }
}

function LoginPage() {
  const status = useNavigation().state;
  const err = useActionData();

  return (
    <div className='login-container'>
      <h1>Sign-in to Your Account</h1>
      { err && <h3 className='red'>{ err }</h3> }
      <Form method='post' replace={ true } className='login-form'>
          <input name='username' type='text' placeholder='Username'className='username-input'/>
          <br/>
          <input name='password' type='password' placeholder='Password'className='password-input'/>
          <br/>
          <button disabled={ status === 'submitting' }>{ status === 'submitting' ? 'Logging in...' : 'Login' }</button>
      </Form>
    </div>
  );
}

LoginPage.action = action;
export default LoginPage;