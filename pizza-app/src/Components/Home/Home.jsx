import React, { useEffect, useState } from 'react';
import './Home.css'
import Header from '../Header/Header.jsx'

import Display from '../Display/Display.jsx'
import Footer from '../Footer/Footer.jsx'


const Home = () => {

  const [food_items, setfood_items] = useState([]);
  const [AdminData, setAdminData] = useState([]);


  const display_data = async () => {
    try {
      let response = await fetch(`https://pizzadoe-mern.onrender.com/api/foodData`, {
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
      const pizzacategory = response[0].map((category) => ({
        ...category,
        pizzas: category.pizzas.map((pizza) => ({
          ...pizza,
          qty: 1,
          size: 'small',
          totalPrice: pizza.options.small || 0,
        })),
      }));

      console.log(pizzacategory);
      setfood_items(pizzacategory);


      // const foodItemsWithState = response[0].map((food) => ({
      //   ...food,
      //   qty: 1,
      //   size: 'small',
      //   totalPrice: food.options.small || 0,
      // }));
      // setfood_items(foodItemsWithState);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };


  const displayAdminData = async () => {
    try {
      let response = await fetch(`https://pizzadoe-mern.onrender.com/api/AdminData`, {
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


  useEffect(() => {
    console.log('Effect is running');
    const role = localStorage.getItem("Role");

    if (role === "admin") {
      displayAdminData();
      console.log(role)

    } else if (role !== "admin" || !role) {
      console.log(role)

      display_data();
    }

  }, []);

  return (
    <div className='home-container'>
      <Header data={food_items}/>
      <Display Userdata={food_items} AdminData={AdminData}/>
      <Footer/>
    </div>
  )
}

export default Home
