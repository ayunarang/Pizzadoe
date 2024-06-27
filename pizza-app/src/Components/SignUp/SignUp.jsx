import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../LogIn/Login.css'; 
import '../SignUp/SignUp.css'
import 'react-toastify/dist/ReactToastify.css';
import {CustomToast} from '../Display/CustomToast';
import showPasswordImg from '../../images/icons8-show-24.png'
import hidePasswordImg from '../../images/icons8-hide-24.png'

const SignUp = () => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", location: "" });
const [showPassword, setshowPassword] = useState("password");
const [HideImg, setHideImg] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      const response = await fetch("https://pizzadoe-mern.onrender.com/api/createuser", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          location: credentials.location,
        })
      });
    
      const jsonData = await response.json();
      console.log('Response:', jsonData);
      console.log('Credentials:', credentials);
    
      if (!jsonData.success) {
        if (jsonData.errors) {
          // Check for specific error messages and show toasts accordingly
          jsonData.errors.forEach(error => {
            if (error.msg === 'Invalid email format' || error.msg ===  'Name is required' || error.msg === 'Location is required') {
              showToastCaseOne();
            } else if (error.msg === 'Password must be at least 8 characters') {
              showToastCaseTwo();
            } 
          });
        } else {
          showToastCaseFour();
        }
      } else {
        showToastCaseFour();
        localStorage.setItem("authtoken", jsonData.authtoken);
        localStorage.setItem("Role", jsonData.Role);
        localStorage.setItem("userID", jsonData.userId);
      }
    };
    


  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const showToastCaseOne = () => {
    CustomToast({ message: 'Enter valid credentials in all fields', type: 'error' });
  };

  const showToastCaseTwo = () => {
    CustomToast({ message: 'Password must contain 8 characters', type: 'error' });
  };


  const showToastCaseFour = () => {
    CustomToast({ message: 'User signed in!', type: 'success' });
    setTimeout(() => {
      navigate('/');
    },2000)
    
  };


  return (
    <div className="custom-body">
    <div className="custom-login-container">
            <p class="custom-login-title">Sign Up</p>
      <form>
        <div className="form-group custom-div">
          <input
            type="text"
            className="custom-input"
            placeholder="Enter Name"
            name="name"
            value={credentials.name}
            onChange={onChange}
          />
        </div>
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
        <div className="form-group custom-div">
          <input
            type="text"
            className="custom-input" 
            placeholder="Enter address"
            name="location"
            value={credentials.location}
            onChange={onChange}
          />
        </div>
        <div className="custom-wrapper">
        <button type="submit" className="custom-button custom-login" onClick={handleSubmit}>Submit</button>
        <Link to="/login" className="m-3 text-black custom-signin">Already a user ?</Link>
        </div>
        
      </form>
    </div>
    </div>
  );
}

export default SignUp;
