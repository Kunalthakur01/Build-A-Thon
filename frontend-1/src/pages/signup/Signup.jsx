import React from 'react';
import { Form, useLoaderData, redirect, useNavigation, useActionData } from 'react-router-dom';
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
    console.log(res);
  } catch (err) {
    console.error(err);
    return err.message;
  }
}

function SignupPage() {
  const status = useNavigation().state;
  const message = useLoaderData();
  const err = useActionData();

  return (
    <div className='signup-container'>
      <h1>Create your account</h1>
      { message && <h3 className='red'>{ message }</h3> }
      { err && <h3 className='red'>{ err }</h3> }
      <Form method='post' replace={ true } className='signup-form'>
          <input name='username' type='text' placeholder='Username'/>
          <input name='email' type='email' placeholder='Email'/>
          <input name='password' type='password' placeholder='Password'/>
          <select name="role">
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
          <button disabled={ status === 'submitting' }>{ status === 'submitting' ? 'Signing up...' : 'Signup' }</button>
      </Form>
    </div>
  );
}

SignupPage.action = action;
export default SignupPage;