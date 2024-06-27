import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import backArrow from '../../images/icons8-back-arrow-32.png';
import '../Cart/Cart.css';
import '../Orders/Orders.css';
import custompizza from '../../images/Your Custom Pizza.png';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const userID = localStorage.getItem('userID');

  const fetchOrders = () => {
    fetch(`https://pizzadoe-mern.onrender.com/api/orders/${userID}`)
      .then(response => response.json())
      .then(data => {
        setOrders(data.Orders);
      })
      .catch(error => console.error('Error fetching cart items:', error));
  };

  useEffect(() => {
    fetchOrders();
  }, []); 

  return (
    <div className='custom-container'>
      <Link to="/">
        <button className='back-to-home'>
          <img src={backArrow} className='back-arrow' alt='Back'></img>
          Back to Home
        </button>
      </Link>
      <div className="screen">
        <h1>Your Orders</h1>
        {orders.length === 0 ? (
          <p>No orders made</p>
        ) : (
          <ul>
            {orders.map(item => (
              <li key={item.id}>
                {item.img !== "" ? (
                  <>
                    <img src={item.img} height="100" width="135" alt={item.name}></img>
                  </>
                ) : (
                  <>
                    <img src={custompizza} height="150" width="135" alt={item.name}></img>
                  </>
                )}
                <div className="item">
                  <div className="item-description">
                    <h4>{item.name}</h4>
                    <p>Size: {item.size} , Qty: {item.qty}</p>
                    <p className='price'> Rs. {item.price} </p>
                  </div>
                  <div className="status">
                    {item.Status}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Orders;
