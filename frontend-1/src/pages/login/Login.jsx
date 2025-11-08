import React from 'react';
import { Form, useLoaderData, redirect, useNavigation, useActionData } from 'react-router-dom';
import axios from 'axios';

import './login.css';

async function action({ request }) {
  const formData = await request.formData();
  const username = formData.get('username');
  const password = formData.get('password');
  const pathname = new URL(request.url).searchParams.get('redirectTo') || '/host';
  try {
    const res = await axios.post('http://localhost:3000/api/v1/login', { username, password });
    console.log(res);
  } catch (err) {
    console.error(err);
    return err.message;
  }
}

function LoginPage() {
  const status = useNavigation().state;
  const message = useLoaderData();
  const err = useActionData();

  return (
    <div className='login-container'>
      <h1>Sign-in to Your Account</h1>
      { message && <h3 className='red'>{ message }</h3> }
      { err && <h3 className='red'>{ err }</h3> }
      <Form method='post' replace={ true } className='login-form'>
          <input name='username' type='text' placeholder='Username'/>
          <input name='password' type='password' placeholder='Password'/>
          <button disabled={ status === 'submitting' }>{ status === 'submitting' ? 'Logging in...' : 'Login' }</button>
      </Form>
    </div>
  );
}

LoginPage.action = action;
export default LoginPage;