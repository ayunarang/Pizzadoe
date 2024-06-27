import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import backArrow from '../../images/icons8-back-arrow-32.png'
import { useNavigate } from 'react-router-dom';
import '../Custompizza/CustomPizza.css'
import '../Cart/Cart.css'
import '../Display/Display.css'

const Custompizza = () => {
  const navigate=useNavigate();
  const [category, setCategory] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('Regular');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedItems, quantity, size]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/custompizza');
      const data = await response.json();
      setCategory(data);
    } catch (error) {
      console.error('Error fetching custom pizza:', error);
    }
  };

  const addToCart = (itemName, itemPrice, categoryName) => {
    console.log(`Added to cart: ${itemName} - Rs. ${itemPrice}`);

    // Update selected items for the current category
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [categoryName]: itemName,
    }));

    // Scroll to the next category section
    const nextCategoryIndex =
      category.findIndex((cat) => cat.name === categoryName) + 1;
    if (nextCategoryIndex < category.length) {
      const nextCategoryTop = document.getElementById(
        `category-${nextCategoryIndex}`
      ).offsetTop;
      window.scrollTo({
        top: nextCategoryTop,
        behavior: 'smooth',
      });
    }
  };

  const removeFromCart = (categoryName) => {
    const currentCategory = category.find(
      (cat) => cat.name === categoryName
    );
    console.log(`Removed from cart: ${selectedItems[categoryName]}`);
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [categoryName]: null,
    }));

    // If it's the last item of the current category, scroll back to the previous category
    if (currentCategory.options.length === 1) {
      const prevCategoryIndex =
        category.findIndex((cat) => cat.name === categoryName) - 1;
      if (prevCategoryIndex >= 0) {
        const prevCategoryTop = document.getElementById(
          `category-${prevCategoryIndex}`
        ).offsetTop;
        window.scrollTo({
          top: prevCategoryTop,
          behavior: 'smooth',
        });
      }
    }
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    for (const categoryName in selectedItems) {
      const selectedOption = selectedItems[categoryName];
      if (selectedOption) {
        const selectedCategory = category.find((cat) => cat.name === categoryName);
        const selectedOptionDetails = selectedCategory.options.find((opt) => opt.name === selectedOption);
        totalPrice += selectedOptionDetails.price;
      }
    }
    // Multiply by quantity
    totalPrice *= quantity;

    // Add extra cost based on size
    if (size === 'Small') {
      totalPrice += 50; // Add your small size price
    } else if (size === 'Large') {
      totalPrice += 100; // Add your large size price
    }

    setTotalPrice(totalPrice);
  };

  const pizzaName = () => {
    const selectedBase = selectedItems['Pizza Base'] || 'Select Base';
    const selectedSauce = selectedItems['Sauce'] || 'Select Sauce';
    const selectedCheese = selectedItems['Cheese'] || 'Select Cheese';
    const selectedVeggies = selectedItems['Veggies'] || 'Select Veggies';

    return `${selectedBase} - ${selectedSauce} - ${selectedCheese} - ${selectedVeggies} Pizza`;
  };

  const handleAddToCart = () => {
    if (Object.keys(selectedItems).length > 0) {
      const currentTime = new Date();
  
      const cartItem = {
        name: pizzaName(),
        price: totalPrice,
        qty: quantity,
        size: size,
        img:"",
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
          
  
          // // Handle response accordingly
          // if (data.error) {
          //   // Handle error cases
          //   if (data.error === 'Item already in cart') {
          //     showToastForCaseOne();
          //   } else if (data.message === 'Item already in cart. Please select a different size option') {
          //     showToastForCaseTwo();
          //   }
          // } else if (data.message) {
          //   // Handle success cases
          //   if (data.message === 'Item added to cart') {
          //     showToast();
          //   }
          // }
        })
        .catch(error => console.error('Error adding to cart:', error));
    }
    navigate('/cart');
  };
  

  return (
    <div class="custom-container">
      <Link to="/" ><button className='back-to-home'><img src={backArrow} className='back-arrow'></img>Back to Home</button></Link>
      <div className="screen">
      {category.map((items, index) => (
        <div key={index} id={`category-${index}`}>
          <h2 class="section-title">{items.name}</h2>
          <div className="row px-3 py-3">
            {items.options.map((options) => (
              <div className="col-sm-4 mb-6 px-4 py-2" key={options._id}>
                <div className="card text-white">
                  <img
                    src={options.img}
                    className="card-img"
                    alt={options.name}
                    height="210"
                    width="180"
                  />
                  <div className="card-img-overlay custom-overlay d-grid">
                    <div className="row">
                      <div className="price mb-2">
                        Price: <span>Rs. {options.price}</span>
                      </div>
                      <h5 className="card-title pizza-name">{options.name}</h5>
                    </div>
                    <div className="align-self-end d-flex">
                      {selectedItems[items.name] === options.name ? (
                        <button
                          className="text-white outline-none  px-3 py-2 custom-button rounded"
                          onClick={() => removeFromCart(items.name)}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          className="text-white outline-none px-3 py-2 custom-button rounded"
                          onClick={() =>
                            addToCart(options.name, options.price, items.name)
                          }
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="selected-items">
        <h2 class="section-title">Selected Pizza: {pizzaName()}</h2>
        <div className="select">
        <div class="input-custom">
          <label htmlFor="quantity" class="custom-label">Quantity:</label>
          <select
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          >
            {[...Array(10).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                {num + 1}
              </option>
            ))}
          </select>
        </div>
        <div >
          <label htmlFor="size" class="custom-label">Size:</label>
          <select
            id="size"
            name="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="Small">Small</option>
            <option value="Regular">Regular</option>
            <option value="Large">Large</option>
          </select>
        </div>
        </div>
        <div className="custom-new-div">
        <p class="custom-price">Total Price: Rs. {totalPrice}</p>
        <button className="btn btn-primary custom-button-cart" onClick={handleAddToCart}>
          Add to Cart
        </button>
        </div>
        
      </div>
      </div>
    </div>
  );
};

export default Custompizza;
