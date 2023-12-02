import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import 'react-toastify/dist/ReactToastify.css';
import CustomToast from '../Display/CustomToast.jsx';
import showPasswordImg from '../../images/icons8-show-24.png'
import hidePasswordImg from '../../images/icons8-hide-24.png'

const LogIn = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [showPassword, setshowPassword] = useState("password");
const [HideImg, setHideImg] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/loginuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const jsonData = await response.json();
    console.log('Response:', jsonData);
    console.log('Credentials:', credentials);
    if (jsonData.success) {
      localStorage.setItem('Role', jsonData.Role);
      localStorage.setItem('authtoken', jsonData.authtoken);
      localStorage.setItem('userID', jsonData.userId);
      showToast();
    }
    else{
      if(jsonData.message==="Incorrect password"){
        showToastCaseOne();
      }
      else if(jsonData.message==="Try signing in first"){
        showToastCaseTwo();
      }
    }
  };

  const showToast = () => {
    CustomToast({ message: 'User Logged in!', type: 'success' });
    setTimeout(() => {
      navigate('/');
    },2000)
    
  };

  const showToastCaseOne = () => {
    CustomToast({ message: 'Incorrect password', type: 'error' });
  };

  const showToastCaseTwo = () => {
    CustomToast({ message: 'You need to sign up first', type: 'error' });
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="custom-body">
    <div className="custom-login-container">
      <p class="custom-login-title">Log In</p>
      <form>
        <div className="form-group custom-div">
          
          <input
            type="email"
            className="custom-input"
            placeholder="Enter email"
            name="email"
            value={credentials.email}
            onChange={onChange}
          />
        </div>
        <div className="form-group custom-div password-div">
          
          <input
            type={showPassword}
            className="custom-input"
            placeholder="Password"
            name="password"
            value={credentials.password}
            onChange={onChange}
          />
          {(!HideImg)?(<>
          <img src={showPasswordImg} class="password-img" onClick={() => {setshowPassword("text");
          setHideImg(true)}}></img></>):
          <><img src={hidePasswordImg} class="password-img"
          onClick={()=>{
            setshowPassword("password")
            setHideImg(false)}}></img></>}
        </div>
        <div className="custom-wrapper">
        <Link to="/forgotpassword" className="text-black custom-forgot-password">
            Forgot Password
          </Link>
        <div className="first-buttons ">
          <button type="submit" className=" custom-button custom-login" onClick={handleSubmit}>
            Log In
          </button>
        </div>
        <div className="second-buttons">
          <Link to="/createuser" class="custom-signin">
            
              Sign In as a new user
          </Link>
        </div>
        </div>

      </form>
    </div>
    </div>
  );
};

export default LogIn;
