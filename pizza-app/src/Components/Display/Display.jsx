// eslint-disable react/jsx-no-undef 

import React, { useDebugValue, useEffect, useState } from 'react';
import custompizza from '../../images/custom-removebg-preview (1) (1) (1).png'
import homepizza from '../../images/1170805d-75a7-4328-af57-17c697faf225_2k_LE_auto_x2.jpg';
import './Display.css';
import 'react-toastify/dist/ReactToastify.css';
import { CustomToast } from './CustomToast';
import { Link, useNavigate } from 'react-router-dom';
import menuIcon from '../../images/icons8-cutlery-64.png'
import SpinWheel from './SpinningWheel/SpinTheWheel.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setDiscount } from '../Redux/reducers.js';
import Explore from '../Explore/Explore.jsx';
import Menu from '../Menu/Menu.jsx';



const Display = ({ Userdata, AdminData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [discountValue, setdiscountValue] = useState(0);

  const discount = useSelector((state) => state.discount.discount);

  const [showDiscountModal, setshowDiscountModal] = useState(false);

  useEffect(() => {
    if (discount !== 0) {
      console.log(discount);
      setdiscountValue(discount);
      setshowDiscountModal(true);
    }
  }, [discount]);

  const closeDiscountModal = () => {
    setshowDiscountModal(false);
  }


  const increaseStock = async (id) => {
    const response = await fetch(`https://pizzadoe-mern.onrender.com/api/stock/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(),
    })
    if (response.ok) {
      // await displayAdminData();
    } else {
      console.error('Failed to increase stock:', response.statusText);
    }
  }

  const checkuser = () => {
    const userId = localStorage.getItem("userID");
    if (!userId) {
      showToastForCaseThree();
    }
    else {
      navigate("/custompizza");

    }
  };

  const showToastForCaseThree = () => {
    CustomToast({ message: 'You need to sign in first!', type: 'error' });
  };


  return (
    <div className='display-body-container'>


      {(AdminData && AdminData.length > 0) ?

        <div className="menu-section" id="store">
          <div className="row px-2" >
            {AdminData[0].map((data, index) => (
              <div key={index} className="col-sm-3 mb-3 px-4 py-2">
                <div className="card bg-dark text-white">
                  <img
                    src={data.img}
                    className="card-img"
                    alt={data.name}
                    height="200"
                    width="150"
                  />
                  <div className="card-img-overlay custom-overlay d-grid">
                    <div className="row">
                      <div className="quantity mb-2">
                        Quantity: <span>{data.quantity}</span>
                      </div>
                      <h5 className="card-title pizza-name">{data.name}</h5>
                    </div>
                    <div className="align-self-end d-flex">
                      <button
                        className="text-white outline-none custom-button-stock rounded"
                        onClick={() => {
                          increaseStock(data._id);
                        }}
                      >
                        Increase stock
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        :

        <>

          <div className="image-container">
            <div className="image-wrapper">
              <img src={homepizza} alt="Pizza" className="image home-pizza" />
              <div className="overlay"></div>
            </div>
            <div className="text-on-right">
              <h1>A taste that unmistakably speaks for itself.</h1>
              <button className="head-to-menu"
                onClick={() => navigate('/menu', { state: { data: Userdata } })}
              >HEAD TO MENU
                <img src={menuIcon} className='menu-icon'></img></button>

            </div>
          </div>


          <div className="coupons-and-offers-section">
            <div className="coupons-and-offers-container">
              <div className="special-offer-heading-container">
                <p className='special-offer-heading'>
                  SPECIAL OFFERS</p>
              </div>

              <div className="special-offers-list-container">

                <div className="special-offers-list">
                  <p style={{ fontSize: "1.5rem", fontWeight: "500", marginBottom: "0.2rem" }}>1 + 1 Free</p>
                  <p>on Wednesdays.</p>
                </div>

                <hr className='vertical-hr'></hr>

                <div className="special-offers-list">
                  <p style={{ fontSize: "1.5rem", fontWeight: "500", marginBottom: "0.2rem" }}>Free Shipping</p>
                  <p>for new users.</p>
                </div>

                <hr className='vertical-hr'></hr>

                <div className="special-offers-list">
                  <p style={{ fontSize: "1.5rem", fontWeight: "500", marginBottom: "0.2rem" }}>10% Discount</p>
                  <p>with orders above 3 pizzas.</p>
                </div>

              </div>
            </div>
          </div>

          {(!localStorage.getItem("userID")) ? (
            <div className="new-customer-section">
              <div className="spinning-wheel-text-section">
                <p className='spinning-section-heading'>New <span style={{ color: "#198754", fontWeight: "600", fontSize: "2.4rem" }}>Lucky </span>User Discount!</p>
                <div className="try-your-luck">Click on "SPIN" and try your luck.</div>
                {!showDiscountModal ? <></> : (
                  <div className="discount-modal">
                    <div className="discount-modal-content">
                      <span className="discount-close-button" onClick={closeDiscountModal}>
                        &times;
                      </span>
                      <div className="discount-modal-custom-container">
                        <p class="discount-title">Congrats 🎉</p>
                        <div className="discount-description">You got {discountValue}% discount on your first order!</div>
                        <button className='signup-and-claim'
                          onClick={() => {
                            navigate("/createuser");
                            closeDiscountModal();
                          }}
                        >Signup and Claim</button>
                        <button className='dont-claim'
                          onClick={closeDiscountModal}>
                          Don't want to claim
                        </button>
                      </div>

                    </div>
                  </div>

                )}
              </div>

              <div className="spinning-wheel-section">
                <div className="spinning-wheel"><SpinWheel /></div>
              </div>

            </div>
          ) : ""}

          <Explore data={Userdata} pageType="explore" />
          <div class="custom-pizza-div" id="custom-pizza">

            <div class="custom-pizza-text">
              <div class="new-feature">Try our new feature</div>
              <div class="left-part">Choose from our menu or customize your own pizza!</div>
              <button onClick={checkuser}>Try now</button>

            </div>
            <img src={custompizza} class="custom-pizza-image"></img>
          </div>
        </>
      }





    </div>
  );
};

export default Display;
