import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../LogIn/Login.css';
import 'react-toastify/dist/ReactToastify.css';
import {CustomToast} from '../Display/CustomToast.jsx';
import showPasswordImg from '../../images/icons8-show-24.png'
import hidePasswordImg from '../../images/icons8-hide-24.png'


const ChangePassword = () => {

    const [oldpass, setoldpass] = useState('');
    const [newpass, setnewpass] = useState('');

    const navigate = useNavigate();
    const [showOldPassword, setshowOldPassword] = useState("password");
    const [showNewPassword, setshowNewPassword] = useState("password");

    const [HideOldpasswordImg, setHideOldpasswordImg] = useState(false);
    const [HideNewpasswordImg, setHideNewpasswordImg] = useState(false);

    const onChangeOldPass = (e) => {
        setoldpass(e.target.value);
        console.log(oldpass)
    }

    const onChangeNewPass = (e) => {
        setnewpass(e.target.value);
        console.log(newpass);
    }

    const changePassword = async () => {
        const userId = localStorage.getItem("userID")
        await fetch(`http://localhost:5000/api/changepassword/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_entered_old_password: oldpass, user_entered_new_password: newpass })

        }
        ).then(response => response.json())
            .then(data => {

                if (data.message === 'Incorrect old password') {
                    showToastCaseOne();
                }
                else if (data.message === 'Password changed') {
                    showToast();
                }
            }).
            catch(error => console.log(error));

    }


    const showToast = () => {
        CustomToast({ message: 'Password changed', type: 'success' });
        setTimeout(() => {
          navigate('/');
        },2000)

    };

    const showToastCaseOne = () => {
        CustomToast({ message: 'Incorrect old password!', type: 'error' });
    };


    return (
        <div>
            <div className="custom-body">
                <div className="custom-login-container">
                    <p class="custom-login-title">Change Password</p>

                    <div className="form-group custom-div password-div">

                        <input
                            type={showOldPassword}
                            className="custom-input"
                            placeholder="Enter old password"
                            name="oldpassword"
                            value={oldpass}
                            onChange={onChangeOldPass}
                        />
                        {(!HideOldpasswordImg) ? (<>
                            <img src={showPasswordImg} class="password-img" onClick={() => {
                                setshowOldPassword("text");
                                setHideOldpasswordImg(true)
                            }}></img></>) :
                            <><img src={hidePasswordImg} class="password-img"
                                onClick={() => {
                                    setshowOldPassword("password")
                                    setHideOldpasswordImg(false)
                                }}></img></>}
                    </div>
                    <div className="form-group custom-div password-div">

                        <input
                            type={showNewPassword}
                            className="custom-input"
                            placeholder="Enter new password"
                            name="newpassword"
                            value={newpass}
                            onChange={onChangeNewPass}
                        />
                        {(!HideNewpasswordImg) ? (<>
                            <img src={showPasswordImg} class="password-img" onClick={() => {
                                setshowNewPassword("text");
                                setHideNewpasswordImg(true)
                            }}></img></>) :
                            <><img src={hidePasswordImg} class="password-img"
                                onClick={() => {
                                    setshowNewPassword("password")
                                    setHideNewpasswordImg(false)
                                }}></img></>}
                    </div>
                    <div className="custom-wrapper">
                        <div className="first-buttons ">
                            <button className=" custom-button custom-login" onClick={changePassword}>
                                Update
                            </button>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default ChangePassword

