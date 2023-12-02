import React from 'react'
import { Link , useNavigate} from 'react-router-dom'
import './Header.css'

const Header = () => {
  const navigate= useNavigate()
  const handleLogOut=()=>{
    localStorage.removeItem("authtoken")
    localStorage.removeItem("userID")
    localStorage.removeItem("Role")

    navigate("/login")
  }


  return (
    <>
    <div class="header-container">
    <nav class="navbar navbar-expand-lg d-flex align-items-center custom-nav-class" >
      
    <a
  className="navbar-brand navbar navbar-expand-lg d-flex align-items-center"
  style={{
    backgroundColor: "#f42b03",
    backgroundImage: "linear-gradient(316deg, #f42b03 0%, #ffbe0b 74%)",
    WebkitBackgroundClip: "text", 
    color: "transparent", 
    display: "inline-block", 
    fontSize: "1.8rem",
    fontWeight: "900"
  }}
  href="#"
>
  PizzaDoe
</a>

  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse header-right" id="navbarTogglerDemo02">
  {localStorage.getItem("Role") !== "Admin" && (<>
    <ul class="navbar-nav mt-lg-0 custom-links align-items-center" style={{
      fontSize:"0.75rem",
      fontWeight:"500",
    }}>
      
      <li class="nav-item ">
        <a class="custom-item" href="#menu">Menu</a>
      </li>
      <li class="nav-item ">
        <a class="custom-item" href="#custom-pizza">Custom Pizza</a>
      </li>
      <li class="nav-item">
        <a class="custom-item" href="#footer">Contact Us</a>
      </li>
    </ul>
    
      {(!localStorage.getItem("authtoken"))?
      <div class="my-lg-0 d-flex align-items-center user-section">
      <Link class="nav-link custom-title" to="/login">Log In</Link>
      <Link class="text-decoration-none custom-title text-white" to="/createuser"><button class="btn btn-sm my-sm-0 custom-background" >Sign Up</button></Link></div>
      :
      <div class="my-lg-0 d-flex align-items-center user-section">
      <Link class="nav-link custom-title" to="/orders">My Orders</Link>
      <Link class="nav-link custom-title" to="/cart">Cart</Link>
      <button class="btn btn-sm my-sm-0 custom-title custom-background" onClick={handleLogOut}>Log Out</button></div>
      }
      </> )}
      {localStorage.getItem("Role") === "Admin" && (
        <><ul class="navbar-nav mr-auto mt-2 mt-lg-0" style={{
          fontSize:"0.75rem",
          fontWeight:"500",
        }}>
          
          <li class="nav-item align-items-center">
            <a class="custom-item" href="#menu">Menu</a>
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
      <button class="btn btn-sm my-sm-0 custom-title custom-background" onClick={handleLogOut}>Log Out</button></div>
        </> 
  )
}
      
    
</div>


</nav>
</div>

    </>
  )
}

export default Header
