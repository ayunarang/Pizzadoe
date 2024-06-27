import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../LogIn/Login.css'
import '../ForgotPassword/ForgotPassword.css'



const ForgotPassword = () => {
  const navigate= useNavigate();
  const [email, setemail] = useState(null)
  const [showmodal, setshowmodal] = useState(false);
  const [otp, setotp] = useState('');
  const [isnotpasting, setisnotpasting] = useState(true);
  const [verifiedmodal, setverifiedmodal] = useState(false);
  const [otpdeclined, setotpdeclined] = useState(false);
  const [NotAUser, setNotAUser] = useState(false);

  const handleEmailChange = (e) => {
    setemail(e.target.value);
    console.log(email);
  };

  const handleotp = (e) => {
    const enteredValue = e.target.value;
    const isNumeric = /^\d+$/.test(enteredValue);
  
    if (isNumeric && enteredValue.length <= 6 && isnotpasting) {
      setotp(enteredValue);
  
      if (enteredValue.length === 6) {
        verifyOTP(enteredValue);
      }
    }
  };
  

  const handlePaste=(e)=>{
    const pastedValue = e.clipboardData.getData('text');
    const isNumeric = /^\d+$/.test( pastedValue);

    if (isNumeric && pastedValue.length <= 6) {
      verifyOTP(pastedValue);
      setisnotpasting(false);
    }
  }

  const verifyOTP=async(otp)=>{
    try {
console.log("verifying otp:" , otp)
      const response = await fetch(`https://pizzadoe-mern.onrender.com/api/verifyotp/${otp}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ useremail: email}),
      });
      const data = await response.json();
      if(data.message==="OTP verified"){
        setshowmodal(false);
        setverifiedmodal(true);
        localStorage.setItem('userID', data.userId);
        localStorage.setItem('authtoken', data.authtoken);
        localStorage.setItem('Role', data.Role);
      }
      else if(data.message==="OTP declined"){
        setotpdeclined(true);
      }
    }
      catch(error){
        console.error('Error fetching user data:', error);
      }
  }
  

  const verifyuser = async (e) => {
    try {
      e.preventDefault();
  
      const response = await fetch(`https://pizzadoe-mern.onrender.com/api/forgotpassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ useremail: email}),
      });
  
      const data = await response.json();
      if(data.message==="User found!"){
        setshowmodal(true);
        const response = await fetch(`https://pizzadoe-mern.onrender.com/api/sendotp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ useremail: email }),
      }); 
      const data = await response.json();
      console.log(data);
      }
      else if(data.message==="User not registered!")
      setNotAUser(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  

  const closeModal=()=>{
    setshowmodal(false);
    setotpdeclined(false);
    setverifiedmodal(false);
    setNotAUser(false);
  }

  const navigateToHome=()=>{
    setTimeout(() => {
      navigate('/');
    }, 2000)
    
  }


  return (
    <div className="custom-body">
    <div className="custom-login-container">
      <p class="custom-login-title">Recover Account</p>
      <form>
        <div className="form-group custom-div">
          
          <input
            type="email"
            className="custom-input"
            placeholder="Enter email"
            name="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="custom-wrapper">
        <div className="first-buttons ">
          <button type="submit" className=" custom-button custom-login" onClick={verifyuser}>
            Submit
          </button>
        </div>
        <div className="second-buttons">
          <Link to="/createuser" class="custom-signin">
            
              Create account as new user
          </Link>
        </div>
        </div>
  
      </form>
    </div>
    {!NotAUser?(<></>):(
      <>
      <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        
        <p class="user-verified">You need to sign up first!</p>
        
      </div>
    </div>
      </>
    )}
    {!showmodal? (<></>):
    (<div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <div className="modal-custom-container">
        <p class="otp-title">Fill the OTP sent to your email</p>
        <input class="otp-field" 
        value={otp}
        onChange={handleotp}
        onPaste={handlePaste}
        maxLength={6}>

        </input>
        {!otpdeclined? (<>
        </>) : (<>
          <div class="not-match">
            OTP does not match!
          </div>
          {closeModal}</>
          
        )}
        </div>
        
      </div>
    </div>)}

    {!verifiedmodal? (<></>):
    (<><div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <p class="user-verified">User Verified! Navigating to home page...</p>
      </div>
    </div>
    {navigateToHome()}
    </>
    )}

    </div>
  );
}


  
  export default ForgotPassword;


