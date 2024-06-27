import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'
import usericon from '../../images/icons8-user-48.png'
import logOuticon from '../../images/icons8-logout-48.png'
import hamburgerMenu from '../../images/icons8-menu-50.png'

const Header = ({data}) => {
  const [showProfileInfo, setshowProfileInfo] = useState(false);
  const [UserEmail, setUserEmail] = useState('');
  const navigate = useNavigate()
  const handleLogOut = () => {
    localStorage.removeItem("authtoken")
    localStorage.removeItem("userID")
    localStorage.removeItem("Role")

    navigate("/login")
  }

  const handleChangePassword=()=>{
    navigate("/changepassword")
  }

  const getUserEmail =()=>{
    const userId= localStorage.getItem("userID")
    fetch(`http://localhost:5000/api/getUserEmail/${userId}`).then(response=>response.json()).then(data=>setUserEmail(data.email)).catch(error=>console.log(error));
  }

  const handleShowProfile=()=>{
    if(showProfileInfo){
      setshowProfileInfo(false);
    }
    else{
      setshowProfileInfo(true);
    }
  }
  

  useEffect(() => {
    if(localStorage.getItem("authtoken")){
      getUserEmail();
    }
  }, []);



  return (
    <>
      <div class="header-container">
        <nav class="navbar navbar-expand-lg align-items-center custom-nav-class" >

          <a
            className="header-logo"
            href="#"
          >
            PizzaDoe
          </a>

          <div class="header-right" >
            {localStorage.getItem("Role") !== "Admin" && (<>
              <ul class="navbar-nav mt-lg-0 custom-links align-items-center" style={{
                fontSize: "0.75rem",
                fontWeight: "500",
              }}>

                <li class="nav-item ">
                  <a class="custom-item" 
                  onClick={() => navigate('/menu', { state: { data: data } })}>Menu</a>
                </li>
                <li class="nav-item ">
                  <a class="custom-item" href="#custom-pizza">Custom Pizza</a>
                </li>
                <li class="nav-item">
                  <a class="custom-item" href="#footer">Contact Us</a>
                </li>
              </ul>

              {(!localStorage.getItem("authtoken")) ?
                <div class="my-lg-0 d-flex align-items-center user-section">
                  <Link class="nav-link custom-title" to="/login">Log In</Link>
                  <Link class="text-decoration-none text-white" to="/createuser"><button class="btn btn-sm my-sm-0 custom-background custom-title" >Sign Up</button></Link></div>
                :
                <div class="my-lg-0 d-flex align-items-center user-section">
                  <Link class="nav-link custom-title" to="/orders">My Orders</Link>
                  <Link class="nav-link custom-title" to="/cart">Cart</Link>
                  <div className="background-div" onClick={handleShowProfile}>
                    <img src={usericon}
                      height="22"
                      width="22"
                      class="user-icon"
                    >

                    </img>
                    
                  </div>

                </div>

              }
            </>)}
            {localStorage.getItem("Role") === "admin" && (
              <><ul class="navbar-nav mr-auto mt-2 mt-lg-0" style={{
                fontSize: "0.75rem",
                fontWeight: "500",
              }}>

                <li class="nav-item align-items-center">
                  <a class="custom-item" 
                   onClick={() => navigate('/menu', { state: { data: data } })}>Menu</a>
                </li>
                <li class="nav-item align-items-center">
                  <a class="custom-item" href="#custom-pizza">Custom Pizza</a>
                </li>
                <li class="nav-item align-items-center">
                  <a class="custom-item" href="#footer">Contact Us</a>
                </li>
              </ul>
                <div class="my-lg-0 d-flex align-items-center user-section">
                  <Link class="nav-link custom-title" to="/neworders">New Orders</Link>
                  <a class="nav-link custom-title" href="#store">Store</a>
                  <div className="background-div" onClick={handleShowProfile}>
                    <img src={usericon}
                      height="22"
                      width="22"
                      class="user-icon">

                    </img>
                  </div >  
                  </div></>
            )
            }


          </div>

          {/* <img className="hamburger-menu"  src={hamburgerMenu}></img>             */}

        </nav>
       
        {(showProfileInfo?<><div className="profile-card">
  <ul>
    <li >{UserEmail}</li>
    <li class="item" onClick={handleChangePassword}>Change Password</li>
    <li class="item" onClick={handleLogOut}>Log Out <img src={logOuticon} height="19px" width="19px" class="logout-icon"></img></li>
  </ul>
</div></>:<></>)}

      </div>

    </>
  )
}

export default Header
