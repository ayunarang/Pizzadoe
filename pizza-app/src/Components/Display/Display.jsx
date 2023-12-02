import React, { useEffect, useState } from 'react';
import custompizza from'../../images/custom-removebg-preview (1) (1) (1).png'
import homepizza from '../../images/1170805d-75a7-4328-af57-17c697faf225_2k.jpeg';
import './Display.css';
import 'react-toastify/dist/ReactToastify.css';
import CustomToast from './CustomToast';
import { Link, useNavigate } from 'react-router-dom';



const Display = () => {
  const navigate= useNavigate();

  const [food_items, setfood_items] = useState([]);
  const [AdminData, setAdminData] = useState([]);

  const display_data = async () => {
    try {
      let response = await fetch(`http://localhost:5000/api/foodData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      response = await response.json();
      // Adding local state variables for each food item
      const foodItemsWithState = response[0].map((food) => ({
        ...food,
        qty: 1,
        size: 'small',
        totalPrice: food.options.small || 0,
      }));
      setfood_items(foodItemsWithState);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const displayAdminData = async () => {
    try {
      let response = await fetch(`http://localhost:5000/api/AdminData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setAdminData([...data]);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const role = localStorage.getItem("Role");
  useEffect(() => {
    console.log('Effect is running');

    if (role === "Admin") {
      displayAdminData();

    } else if (role !== "Admin" || !role) {

      display_data();
    }

  }, []);




  const addToCart = (selectedFood) => {
    if (selectedFood) {
      const currentTime = new Date();

      const cartItem = {
        id: selectedFood._id,
        name: selectedFood.name,
        price: selectedFood.totalPrice,
        qty: selectedFood.qty,
        size: selectedFood.size,
        img: selectedFood.image_url,
        timeAdded: currentTime.toLocaleString(),
      };

      console.log('Sending to server:', cartItem); // Log the data being sent to the server
      const userId = localStorage.getItem('userID');
      console.log(userId);

      fetch(`http://localhost:5000/api/add-to-cart/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Server response:', data);

          if (data.error) {

            if (data.error === 'Item already in cart') {
              showToastForCaseOne();
            } else if (data.message === 'Item already in cart. Please select different size option') {
              showToastForCaseTwo();
            }
            else if(data.error === 'User not found'){
              showToastForCaseThree();
            }
          }
          else if (data.message) {
            if (data.message === 'Item added to cart') {
              showToast();
            }
          }
        })
        .catch(error => console.error('Error adding to cart:', error));
    }
  };


  const calculatePrice = (food) => {
    const { qty, size, options } = food;
    const selectedOption = options[size] || 0;
    const totalPrice = selectedOption * qty;

    return totalPrice;
  };

  const handleQtyChange = (index, qty) => {
    setfood_items((prevFoodItems) =>
      prevFoodItems.map((food, i) =>
        i === index
          ? { ...food, qty, totalPrice: calculatePrice({ ...food, qty }) }
          : food
      )
    );
  };

  const handleSizeChange = (index, size) => {
    setfood_items((prevFoodItems) =>
      prevFoodItems.map((food, i) =>
        i === index
          ? { ...food, size, totalPrice: calculatePrice({ ...food, size }) }
          : food
      )
    );
  };


  const checkuser = async () => {
    try {
      const userId= localStorage.getItem("userID");
      const response = await fetch(`http://localhost:5000/api/checkuser/${userId}`);
      const data = await response.json();
      if (data.error) {
        if (data.error === 'User not found') {
          showToastForCaseThree();
        }
      } else {
        navigate("/custompizza"); 
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  const showToastForCaseOne = () => {
    CustomToast({ message: 'Item already in cart', type: 'error' });
  };

  const showToastForCaseTwo = () => {
    CustomToast({ message: 'Item already in cart. Please select different quantity', type: 'error' });
  };

  const showToastForCaseThree = () => {
    CustomToast({ message: 'You need to sign in first!', type: 'error' });
  };

  const showToast = () => {
    CustomToast({ message: 'Item added to cart', type: 'success' });
  };

  const increaseStock = async (id) => {
    const response = await fetch(`http://localhost:5000/api/stock/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(),
    })
    if (response.ok) {
      await displayAdminData();
      console.log('Stock increased successfully');

    } else {
      console.error('Failed to increase stock:', response.statusText);
    }
  }


  return (
    <>
    
      <div className="image-container">
        <div className="image-wrapper">
          <img src={homepizza} alt="Pizza" className="image home-pizza"  />
          <div className="overlay"></div>
        </div>
        <div className="text-on-right">
          <h1>A taste that unmistakably speaks for itself.</h1>

        </div>
      </div>
  
      {role !== "Admin" && (
        <>
          {food_items.length !== 0 ? (
            <>
            <div className="menu-section" id="menu">
              <div className="row px-3">
                {food_items.map((data, index) => (
                  <div key={index} className="col-sm-6 mb-4 px-4 py-2">
                    <div className="card bg-dark text-white">
                      <img
                        src={data.image_url}
                        className="card-img"
                        alt={data.name}
                        height="300"
                        width="290"
                      />
                      <div className="card-img-overlay custom-overlay d-grid">
                        <div className="row">
                          <div className="price mb-2">
                            Price : <span>Rs. {data.totalPrice}</span>
                          </div>
                          <h5 className="card-title pizza-name">{data.name}</h5>
                          <p className="card-text custom">{data.description}</p>
                        </div>
                        <div className="align-self-end d-flex">
                          <div className="category">
                            <select
                              className="m-2 outline-none px-1 py-1 custom outline-none"
                              onChange={(e) =>
                                handleQtyChange(index, e.target.value)
                              }
                            >
                              {Array.from(Array(6), (e, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>
  
                            <select
                              className="m-2 outline-none px-1 py-1 custom outline-none"
                              onChange={(e) =>
                                handleSizeChange(index, e.target.value)
                              }
                            >
                              <option value="small">Small</option>
                              <option value="regular">Regular</option>
                              <option value="large">Large</option>
                            </select>
                          </div>
                          <button
                            className="text-white outline-none custom-button rounded"
                            onClick={() => {
                              addToCart(data);
                            }}
                          >
                            Add to cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            
            </div>
            <div class="custom-pizza-div" id="custom-pizza">
            
              <div class="custom-pizza-text">
              <div class="new-feature">Try our new feature</div>
              <div class="left-part">Choose from our menu or customize your own pizza!</div>
                <button onClick={checkuser}>Try now</button></div>
                <img src={custompizza} class="custom-pizza-image"></img>
                </div>

            </>
          ) : (
            <p>No food items available</p>
          )}
        </>
      )}
  
      <div>
        <div>
          {role === "Admin" && (
            <>
              {AdminData.length !== 0 ? (
                <div className="menu-section" id="store">
                  <div className="row px-3" >
                    {AdminData[0].map((data, index) => (
                      <div key={index} className="col-sm-4 mb-4 px-4 py-2">
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
                              {/* Add any additional fields you want to display */}
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
              ) : (
                <p>No admin data available</p>
              )}
            </>
          )}
        </div>
      </div>
      
      
    </>
  );
  };
  
  export default Display;
  