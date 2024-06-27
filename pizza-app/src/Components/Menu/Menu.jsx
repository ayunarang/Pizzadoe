import React from 'react'
import Explore from '../Explore/Explore'
import { useLocation } from 'react-router-dom';


const Menu = () => {
    const location = useLocation();
    const { data } = location.state || { data: [] };

  return (
    <Explore data ={data} pageType="menu"/>
)
}

export default Menu
