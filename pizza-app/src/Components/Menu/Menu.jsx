import React from 'react'
import Explore from '../Explore/Explore'
import { useLocation } from 'react-router-dom';
import '../Explore/Explore.css'


const Menu = () => {
  const location = useLocation();
  const { data } = location.state || { data: [] };

  return (
    <div className='menu-box'>
      <Explore data={data} pageType="menu" />
    </div>
  )
}

export default Menu
