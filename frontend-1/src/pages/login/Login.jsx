import { useState } from 'react';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDataSubmitted(true)
  }
  return(
    <div className='OuterContainer'>
      <div>
        {!isDataSubmitted ? (
          <>
            <h1 className='loginHeading'>Welcome back</h1>
            <p className='loginPara'>Welcome back! Please enter your details.</p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Enter your email" name="email" required/>
              <label htmlFor="password">Password</label>
              <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" required/>
              <button type="submit" className='loginButton'>Login</button>
            </form>
          </>
        ) : (
          <h1>You're logged in success</h1>
        )}
      </div>
    </div>
  )
}

export default Login;