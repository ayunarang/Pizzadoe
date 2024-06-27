
import React from 'react';
import { toast } from 'react-toastify';
import GreenIcon from './GreenIcon';
import RedAlertIcon from './RedAlertIcon';

export const CustomToast = ({ message, type }) => {
  const icon = type === 'success' ? <GreenIcon /> : <RedAlertIcon />;

  return toast[type](<div>{message}</div>, {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
  });
};

export const CustomToastCartItem = ({ message, cartItem }) => {

  return toast(
    <div>
    <div>{message}</div>
    {cartItem && (
      <div style={{ fontWeight: '500'}}>
      <div style={{ display: 'flex', marginTop: '10px' }}>
        <img src={cartItem.img} alt={cartItem.name} style={{ width: '50px', height: '50px' , marginRight: '20px', borderRadius:'5px'}} />
        <div style={{ display: 'flex', flexDirection:"column"}}>

        <div style={{ fontWeight: '600'}}>{cartItem.name}</div>
      <div  style={{ marginTop: '3px' }}>
        {cartItem.qty} - {cartItem.size}</div>
        </div>
        </div>
      </div>
    )}
  </div>, 
  {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
  });

};

