import { useState } from 'react';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
  }
  return(
    <div className='OuterContainer'>
      <div>
        <h1 className='loginHeading'>Welcome back</h1>
        <p className='loginPara'>Welcome back! Please enter your details.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Enter your email" name="email" required/>
          <label htmlFor="password">Password</label>
          <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" required/>
          <button type="submit" className='loginButton'>Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login;