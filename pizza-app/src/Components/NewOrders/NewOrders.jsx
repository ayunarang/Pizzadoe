import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import backArrow from '../../images/icons8-back-arrow-32.png';
import '../Cart/Cart.css';
import '../Display/Display.css'
import '../NewOrders/NewOrders.css'

const NewOrders = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://pizzadoe-mern.onrender.com/api/neworders');
        const data = await response.json();
        setCustomers(...data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (customerId, selectedStatus) => {
    console.log(`Customer ID: ${customerId}, Status: ${selectedStatus}`);

    const orderStatusData = {
      customerId: customerId,
      status: selectedStatus,
    };



    try {
      const response = await fetch('https://pizzadoe-mern.onrender.com/api/update-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderStatusData),
      });

      const data = await response.json();
      console.log('Server response:', data);
      console.log(orderStatusData);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  

  const renderOrders = (customer) => (
    <ul class="order-list">
      {customer.Order.map((orderGroup, index) => (
        <li key={index} class="order">
          <h4>Order {index + 1}</h4>
          <ul>
            {orderGroup.map((order) => (
              <li key={order._id}>
                <img src={order.img} height="100" width="135" alt={order.name}></img>
                <div className="item">
                  <div className="order-column">
                    <h4>{order.name}</h4>
                    <p>Size: {order.size}, Qty: {order.qty}</p>
                    <p className='price'>Rs. {order.price}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );

  return (
    <div className='custom-container'>
      <Link to="/"><button className='back-to-home'><img src={backArrow} className='back-arrow' alt="Back"></img>Back to Home</button></Link>
      <div className="screen">
        <h1>New Orders</h1>
        {customers.map((customer) => (
          <div key={customer._id}>
            <div className="order-row">
            <div className="left-side">
            <h4>{customer.name}</h4>
            <p class="custom-detail">Email: {customer.email}</p>
            <p class="custom-detail">Location: {customer.location}</p>
            </div>

            <div className="right-custom-side">
            
            <button class="custom-button-stock rounded text-white" onClick={() => setSelectedCustomer(customer)}>See Order</button>

            <div class="admin-status">
              <label>Status: </label>
              <select
              value={customer.status}
                onChange={(e) => handleStatusChange(customer.customer_id ,e.target.value)}
              >
                <option value="order_received">Order Received</option>
                <option value="in_kitchen">In the Kitchen</option>
                <option value="sent_to_delivery">Sent to Delivery</option>
              </select>
            </div>
            </div>
            
          </div>
          {selectedCustomer && selectedCustomer._id === customer._id && renderOrders(selectedCustomer)}
          </div>
        ))}
       
      </div>
    </div>
  );
};

export default NewOrders;
