import React, { useEffect, useRef, useState } from 'react'
import './Explore.css'
import menuIcon from '../../images/icons8-cutlery-50.png'
import cartIcon from '../../images/icons8-cart-32.png'
import rightArrowIcon from '../../images/right-arrow.png'
import closeOverlayIcon from '../../images/close.png'
import { CustomToast, CustomToastCartItem } from '../Display/CustomToast';


const Explore = ({ data, pageType }) => {

  //false
  const isMenuPage = pageType === 'menu';


  const [selectedSize, setselectedSize] = useState(0);
  const [selectedOverlaySize, setselectedOverlaySize] = useState(0);
  const [PizzaOverlay, setPizzaOverlay] = useState(false);
  const [PizzaOverlayId, setPizzaOverlayId] = useState();


  // const [isOverflowing, setisOverflowing] = useState(false);
  const [selectedQty, setselectedQty] = useState(0);
  const [selectedOverlayQty, setselectedOverlayQty] = useState(0);


  const containerRef = useRef(null);

  const handleselectedSize = (pizzaId, size, price, optionIndex) => {

    setselectedSize(prevSizes => ({
      ...prevSizes,
      [pizzaId]: { size, price, optionIndex }
    }));
  }

  const handleselectedOverlaySize = (pizzaId, size, price, optionIndex) => {

    setselectedOverlaySize(prevSizes => ({
      ...prevSizes,
      [pizzaId]: { size, price, optionIndex }
    }));
  }


  const handleselectedQty = (pizzaId, change) => {

    setselectedQty(() => {
      const newQty = (selectedQty[pizzaId] || 1) + change
      if (newQty < 1) {
        return {
          [pizzaId]: 1
        }
      }
      if (newQty > 6) {
        return {
          [pizzaId]: 6
        }
      }
      return {
        [pizzaId]: newQty
      }
    })

  }

  const handleselectedOverlayQty = (pizzaId, change) => {

    setselectedOverlayQty(() => {
      const newQty = (selectedOverlayQty[pizzaId] || 1) + change
      if (newQty < 1) {
        return {
          [pizzaId]: 1
        }
      }
      if (newQty > 6) {
        return {
          [pizzaId]: 6
        }
      }
      return {
        [pizzaId]: newQty
      }
    })

  }

  // useEffect(() => {
  //   const checkOverflow = () => {
  //     if (containerRef.current) {
  //       const { scrollWidth, clientWidth } = containerRef.current;
  //       console.log(scrollWidth);
  //       console.log(clientWidth)
  //       setisOverflowing(scrollWidth > clientWidth);
  //     }
  //   };


  //   // Check overflow on mount and on window resize
  //   checkOverflow();
  // }, []);




  // const checkuser = async () => {
  //   try {
  //     const userId = localStorage.getItem("userID");
  //     const response = await fetch(`http://localhost:5000/api/checkuser/${userId}`);
  //     const data = await response.json();
  //     if (data.error) {
  //       if (data.error === 'User not found') {
  //         showToastForCaseThree();
  //       }
  //     } else {
  //       navigate("/custompizza");
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //   }
  // };

  const showToastForCaseOne = () => {
    CustomToast({ message: 'Item already in cart', type: 'error' });
  };

  const showToastForCaseTwo = () => {
    CustomToast({ message: 'Item already in cart. Please select different size option', type: 'error' });
  };

  const showToastForCaseThree = () => {
    CustomToast({ message: 'You need to sign in first!', type: 'error' });
  };

  const showToast = (cartItem) => {
    CustomToastCartItem({ message: "Item added to cart", cartItem });
  };

  const addToCart = (selectedFood) => {
    if (selectedFood) {
      const currentTime = new Date();
      let cartItem;

      if(PizzaOverlay){
        cartItem = {
          id: selectedFood._id,
          name: selectedFood.name,
          price: selectedOverlaySize[selectedFood._id]?.price || selectedFood.totalPrice,
          qty: selectedOverlayQty[selectedFood._id] || 1,
          size: selectedOverlaySize[selectedFood._id]?.size || Object.entries(selectedFood.options)[0][0],
          img: selectedFood.image_url,
          timeAdded: currentTime.toLocaleString(),
        };
      }
      else{
         cartItem = {
          id: selectedFood._id,
          name: selectedFood.name,
          price: selectedSize[selectedFood._id]?.price || selectedFood.totalPrice,
          qty: selectedQty[selectedFood._id] || 1,
          size: selectedSize[selectedFood._id]?.size || Object.entries(selectedFood.options)[0][0],
          img: selectedFood.image_url,
          timeAdded: currentTime.toLocaleString(),
        };
      }
      

      console.log('Sending to server:', cartItem); // Log the data being sent to the server
      const userId = localStorage.getItem('userID');
      console.log(userId);

      fetch(`https://pizzadoe-mern.onrender.com/api/add-to-cart/${userId}`, {
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
            } else if (data.error === 'Item already in cart. Please select different size option') {
              showToastForCaseTwo();
            }
            else if (data.error === 'User not found') {
              showToastForCaseThree();
            }
          }
          else if (data.message) {
            if (data.message === 'Item added to cart') {
              showToast(cartItem);
            }
          }
        })
        .catch(error => console.error('Error adding to cart:', error));
    }
  };

  return (
    <>

      <div className="section-containers">
        <div className="menu-heading-container">MENU<img src={menuIcon} className='menu-icon'></img></div>

        {data.map((pizzaCategory, index) => (
          <>
            <div className={(isMenuPage) ? 'section-menu-header' : "section-header"}>{pizzaCategory.categoryName}</div>
            <div className={(isMenuPage) ? 'menu-container' : "section-container"} ref={containerRef}>

              <div className={(isMenuPage) ? "menu-items-container" : "section-items-container"}>
                {pizzaCategory?.pizzas?.map((pizzas, index) => {
                  return (
                    <div className="pizza-card-container">
                      <div className="pizza-card-image-container">
                        <img src={pizzas.image_url} className="pizza-card-image"
                        onClick={() => {
                          setPizzaOverlay(true)
                          setPizzaOverlayId(pizzas);
                        }}></img>
                        <div className="card-qty-container">
                          <div className="pizza-card-qty"
                            onClick={() => { handleselectedQty(pizzas._id, -1) }}            >-</div>
                          <div className="pizza-card-qty">{selectedQty[pizzas._id] || 1}</div>
                          <div className="pizza-card-qty"
                            onClick={() => { handleselectedQty(pizzas._id, 1) }}            >+</div>

                        </div>
                      </div>
                      <div className="card-name-price-container">
                        <div className="pizza-card-name"
                          onClick={() => {
                            setPizzaOverlay(true);
                            setPizzaOverlayId(pizzas);
                          }}>{pizzas.name}</div>
                        <div className="pizza-card-price">
                          Rs. {(selectedSize[pizzas._id]) ? selectedSize[pizzas._id].price : pizzas.totalPrice}
                        </div>
                      </div>

                      <div className="add-to-cart-container">
                        <div className="pizza-size-container">
                          {Object.entries(pizzas.options).map(([size, price], optionIndex) => (
                            <div key={optionIndex} className={`pizza-size-option  ${(selectedSize[pizzas._id]?.optionIndex === optionIndex) || (!selectedSize[pizzas._id] && optionIndex === 0) ? 'selected-pizza-size' : ''}`}
                              onClick={() => { handleselectedSize(pizzas._id, size, price, optionIndex) }}>
                              {(selectedSize[pizzas._id]?.optionIndex === optionIndex || !selectedSize[pizzas._id] && optionIndex === 0) ? size.charAt(0).toUpperCase() + size.slice(1) : size.charAt(0).toUpperCase()}
                            </div>
                          ))}
                        </div>
                        <button
                          className="add-to-cart-btn"
                          onClick={() => {
                            addToCart(pizzas);
                          }}
                        >
                          Cart <img src={cartIcon}></img>
                        </button>
                      </div>
                    </div>)
                })}

              </div>
              {/* {(isOverflowing)?
<div className="right-arrow-overlay"><img src={rightArrowIcon} className='right-arrow-icon'></img></div>
:''} */}

            </div>
          </>

        ))}

      </div>

      {(PizzaOverlay) ?
        <div class="pizza-overlay-container">
          <div class="pizza-description-overlay-container">
            <img className="close-overlay-icon" src={closeOverlayIcon}
            onClick={()=>{setPizzaOverlay(false);
            }}
            
            ></img>
            <div class="pizza-info-container">
              <div class="pizza-image-container">
                <img src={PizzaOverlayId.image_url} alt="Pizza Image"></img>
              </div>
              <div class="pizza-name-container">
                <div class="pizza-overlay-name">{PizzaOverlayId.name}</div>
                <div className="pizza-overlay-price">
                Rs. {(selectedOverlaySize[PizzaOverlayId._id]) ? selectedOverlaySize[PizzaOverlayId._id].price : PizzaOverlayId.totalPrice}

                </div>
                <div class="pizza-size-overlay-container">
                  {Object.entries(PizzaOverlayId.options).map(([size, price], optionIndex) => (
                    <div key={optionIndex} className={`pizza-overlay-size-option  ${(selectedOverlaySize[PizzaOverlayId._id]?.optionIndex === optionIndex) || (!selectedOverlaySize[PizzaOverlayId._id] && optionIndex === 0) ? 'selected-pizza-size' : ''}`}
                      onClick={() => { handleselectedOverlaySize(PizzaOverlayId._id, size, price, optionIndex) }}>
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </div>
                  ))}
                </div>
                <div className="add-to-cart-overlay">
                <div className="qty-overlay-container">
                  <div className="qty-overlay"
                    onClick={() => { handleselectedOverlayQty(PizzaOverlayId._id, -1) }}            >-</div>
                  <div className="qty-overlay">{selectedOverlayQty[PizzaOverlayId._id] || 1}</div>
                  <div className="qty-overlay"
                    onClick={() => { handleselectedOverlayQty(PizzaOverlayId._id, 1) }}            >+</div>

                </div>
                  <div className="add-to-cart-button-overlay" onClick={()=>{addToCart(PizzaOverlayId)}}>Add to Cart</div>
                </div>

              </div>
            </div>
            <div class="pizza-description-container">
              <p >{PizzaOverlayId.description}</p>
            </div>
          </div>
        </div>
        : ''}
    </>

  )
}

export default Explore
