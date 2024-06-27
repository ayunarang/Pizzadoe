/* eslint-disable react/jsx-no-undef */

import React, { useState } from 'react';
import './SpinTheWheel.css'
import { useDispatch } from 'react-redux';
import { setDiscount } from '../../Redux/reducers.js';

const SpinWheel = () => {

    const dispatch = useDispatch();

    const segments = [
        { minDegree: 0, maxDegree: 45, value: 5 },
        { minDegree: 45, maxDegree: 90, value: 10 },
        { minDegree: 90, maxDegree: 135, value: 15 },
        { minDegree: 135, maxDegree: 180, value: 20 },
        { minDegree: 180, maxDegree: 225, value: 25 },
        { minDegree: 225, maxDegree: 270, value: 30 },
        { minDegree: 270, maxDegree: 315, value: 35 },
        { minDegree: 315, maxDegree: 360, value: 40 },
    ];

    const [isSpinning, setIsSpinning] = useState(false);

    const getSpinnerValue= (totalRotation)=>{

        let resultedRotation = totalRotation % (360);
        if (resultedRotation < 0) {
            resultedRotation += 360;
        }

        let segmentIndex = segments.findIndex(segment => resultedRotation >= segment.minDegree && resultedRotation < segment.maxDegree);

        let discount = segments[segmentIndex].value;

        dispatch(setDiscount({discount}));
}

    const rotateWheel = () => {
        setIsSpinning(true);

        let value = Math.ceil(Math.random() * 8); 
        let totalRotation = 360 * value; 
        const wheel= document.getElementById('wheel');
        if(wheel){
            wheel.style.transform = `rotate(${totalRotation }deg)`;
        }
        
        setTimeout(() => {
            (getSpinnerValue(totalRotation));
            setIsSpinning(false); 
        }, 5000);
        
      };

  return(
    <>
    <div className="spinner-container">
        <button className="spinner-btn"
        onClick={(!isSpinning? rotateWheel : '')}
        >SPIN</button>
        <div className="wheel" id="wheel">
            <div className="number" style={{ '--i': 1, '--clr': '#198754' }}><span>5%</span></div>
            <div className="number" style={{ '--i': 2, '--clr': '#8DECB4' }}><span>10%</span></div>
            <div className="number" style={{ '--i': 3, '--clr': '#198754' }}><span>15%</span></div>
            <div className="number" style={{ '--i': 4, '--clr': '#8DECB4' }}><span>20%</span></div>
            <div className="number" style={{ '--i': 5, '--clr': '#198754' }}><span>25%</span></div>
            <div className="number" style={{ '--i': 6, '--clr': '#8DECB4' }}><span>30%</span></div>
            <div className="number" style={{ '--i': 7, '--clr': '#198754' }}><span>35%</span></div>
            <div className="number" style={{ '--i': 8, '--clr': '#8DECB4' }}><span>40%</span></div>
        </div>
    </div>
    </>
  )
};

export default SpinWheel;
