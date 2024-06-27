import React, { useState, useEffect } from 'react';
import './Cart.css';
import { Link } from 'react-router-dom'
import deleteIcon from '../../images/icons8-delete-32.png'
import backArrow from '../../images/icons8-back-arrow-32.png'
import axios from 'axios';
import custompizza from '../../images/Your Custom Pizza.png'

const Cart = () => {

  const [cart, setCart] = useState([]);
  const userID = localStorage.getItem('userID');

  const fetchCartItems = () => {
    fetch(`http://localhost:5000/api/cart/items/${userID}`)
      .then(response => response.json())
      .then(data => {
        setCart(data);
      })
      .catch(error => console.error('Error fetching cart items:', error));
  };

  const checkout = async () => {

    try {

      const { data: { key } } = await axios.get('http://localhost:5000/api/checkout/key');

      const { data: { order } } = await axios.post('http://localhost:5000/api/checkout');

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Ayushi Narang",
        description: "Test Transaction",
        image: "",
        order_id: order.id,
        callback_url: `http://localhost:5000/api/checkout/paymentVerification/${userID}`,
        prefill: {
          name: "Ayushi Narang",
          email: "ayushinarang21@gmail.com",
          contact: "8053225445"
        },
        notes: {
          address: "Pizzadoe Office"
        },
        theme: {
          color: "#3399cc"
        }
      };
      const razor = new window.Razorpay(options);

      razor.open();

      razor.on('payment.success', async (response) => {
        console.log('Payment Success:', response);
      }
      );

    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const removeItemFromCart = async (itemID) => {
    console.log(itemID)
    console.log("delete try")
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${userID}/${itemID}`);

      setCart(prevCart => prevCart.filter(item => item.id !== itemID));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const calculateTotalPrice = () => {
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    return totalPrice;
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div className='custom-container'>
      <Link to="/">
        <button className='back-to-home'>
          <img src={backArrow} className='back-arrow'></img>
          Back to Home
        </button>
      </Link>
      <div className="screen">
        <h1>Shopping Cart</h1>
        {cart.length === 0 ? (
          <p>Cart empty</p>
        ) : (
          <>
            <ul>
              {cart.map(item => (
                <li key={item.id}>
                  {item.img!==""?(<>
                    <img src={item.img} height="100" width="135" class="cart-img"></img>
                  </>):(<>
                    <img src={custompizza} height="150" width="135" class="custom-pizza-img"></img>
                  </>)}
                  <div className="item">
                    <div className="item-description">
                      <h4>{item.name}</h4>
                      <p>Size: {item.size} , Qty: {item.qty}</p>
                      <p className='price'> Rs. {item.price} </p>
                    </div>
                    <div className="delete-option">
                      <img src={deleteIcon} height={"22px"} width={"20px"} class="delete-button" onClick={() => removeItemFromCart(item._id)}></img>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div class="total-price">
              <h3>Total Price: Rs. {calculateTotalPrice()}</h3></div>
            <button className="checkout-button back-to-home" onClick={checkout}>Proceed to Checkout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;