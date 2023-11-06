
import axios from 'axios';
import './userpage.scss'
import { Link } from 'react-router-dom';
import Notification from '../../components/Notification'
import { useContext, useEffect, useState } from 'react';
import { Context } from '../../components/UseContext/ThemeContext';

function PasswordPage({user}) {

    const [nof, setNof] = useState({status : 'none', message : 'none'})
    const [isLoad, setIsLoad] = useContext(Context)

    const handleDeleteUser = () => {
        let t = localStorage.getItem("token")
        let username = localStorage.getItem("username")
        let token = 'Bearer ' + t;
        axios.post('/account/delete-account', {username : username} ,{headers : {Authorization : token, 'Content-Type': 'application/json'}})
            .then(res => {
                if (res.data == true) {
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'success', message : 'Delete information is incorrect'})}, 50);
                    setTimeout(() => {
                        localStorage.removeItem('token')
                        localStorage.removeItem('username')
                        window.location.reload()
                    }, 2500)
                }
            })
    }

    const handleUpdatePassword = () => {
        let oldpass = document.querySelector('.txt-passold').value + ""
        let newpass = document.querySelector('.txt-passnew').value + ""
        let renewpass = document.querySelector('.txt-repassnew').value + ""
        if (newpass != renewpass) 
            return;
        else {
            let t = localStorage.getItem("token")
            let username = localStorage.getItem("username")
            let token = 'Bearer ' + t;
            axios.put('/account/update-password-account',{username : username, oldpass : oldpass, newpass : newpass},{headers : {Authorization : token, 'Content-Type': 'application/json'}})
                .then(res => {
                    if(res.data == true) {
                        setNof({status : 'none', message : ""})
                        setTimeout(() => {setNof({status : 'success', message : 'Password Updated Successfully'})}, 50);
                        document.querySelector('.txt-passold').value = ""
                        document.querySelector('.txt-passnew').value = ""
                        document.querySelector('.txt-repassnew').value = ""
                        setIsLoad(!isLoad)
                    } else {
                        setNof({status : 'none', message : ""})
                        setTimeout(() => {setNof({status : 'fail', message : 'Password Update Failed'})}, 50);
                    }
                })
        }
    }

    return (
        <div className="col-lg-12" style={{display : 'flex', justifyContent : 'center'}}>
            <Notification status={nof.status} message={nof.message}/>
            <div className="col-lg-8 userpage">
                <div className='col-lg-12 slat-header'>
                    <div className='logo'>
                        <img src={user != null ? user.avatar : ""} height='100%'/>
                    </div>
                    <div className='col-lg-7 title-and-description'>
                        <div className='title'>{user != null ? user.name : ""} / Password</div>
                        <div className='description'>
                            Manage your password
                        </div>
                    </div>
                </div>
                <div className='col-lg-12 menu-and-treatment'>
                    <div className='col-lg-4 menus'>
                        <Link className='link' to='/account/general'><div className='menu-item general'>General</div></Link>
                        <Link className='link' to='/account/edit-profile'><div className='menu-item edit-profile'>Edit Profile</div></Link>
                        <Link className='link' to='/account/password'><div className='menu-item password active'>Password</div></Link>
                        <div className='cut-across'></div>
                        <div onClick={() => handleDeleteUser()} className='menu-item' style={{color : 'red'}}>Delete Account</div>
                    </div>
                    <div className='col-lg-8 treatment'>
                        <div className='col-lg-12' id='password' style={{minHeight : '350px'}}>
                            <div className='group'>
                                <label>Old Password</label>
                                <input type="password" className="form-control txt-passold txt" />
                            </div>
                            <div className='group'>
                                <label>New Password</label>
                                <input type="password" className="form-control txt-passnew txt" />
                                <span>Minimum 6 characters</span>
                            </div>
                            <div className='group'>
                                <label>Confirm New Password</label>
                                <input type="password" className="form-control txt-repassnew txt" />
                            </div>
                            <div className='group' style={{display : 'flex', justifyContent : 'end'}}>
                                <button className='btn-save' onClick={() => handleUpdatePassword()}>Save Change</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PasswordPage;