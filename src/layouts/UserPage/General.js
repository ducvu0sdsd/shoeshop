
import { useContext, useEffect, useState } from 'react';
import './userpage.scss'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Notification from '../../components/Notification'
import { Context } from '../../components/UseContext/ThemeContext';

function GeneralPage({user}) {

    const [isLoad, setIsLoad] = useContext(Context)


    const [nof, setNof] = useState({status : 'none', message : 'none'})
    useEffect(() => {
        if (user != null) {
            const txtEmail = document.querySelector(".txt-email")
            txtEmail.value = user.email
        }
        
    }, [user])

    const handleUpdateGeneral = () => {
        let t = localStorage.getItem("token")
        let username = localStorage.getItem("username")
        let token = 'Bearer ' + t;
        let email = document.querySelector('.txt-email').value
        axios.put('/accounts/update-email-account', {username : username, email : email} ,{headers : {Authorization : token, 'Content-Type': 'application/json'}})
            .then(res => {
                if(res.data == true) {
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'success', message : 'Email Updated Successfully'})}, 50);
                    setIsLoad({...isLoad, user : !isLoad.user})
                } else {
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'fail', message : 'Email Update Failed'})}, 50);
                }
            })
    }

    const handleDeleteUser = () => {
        let t = localStorage.getItem("token")
        let username = localStorage.getItem("username")
        let token = 'Bearer ' + t;
        axios.post('/accounts/delete-account', {username : username} ,{headers : {Authorization : token, 'Content-Type': 'application/json'}})
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

    return (
        <div className="col-lg-12" style={{display : 'flex', justifyContent : 'center'}}>
            <Notification status={nof.status} message={nof.message}/>
            <div className="col-lg-8 userpage">
                <div className='col-lg-12 slat-header'>
                    <div className='logo'>
                        <img src={user != null ? user.avatar : ""} height='100%'/>
                    </div>
                    <div className='col-lg-7 title-and-description'>
                        <div className='title'>{user != null ? user.name : ""} / General</div>
                        <div className='description'>
                            Update your username and manage your account
                        </div>
                    </div>
                </div>
                <div className='col-lg-12 menu-and-treatment'>
                    <div className='col-lg-4 menus'>
                        <Link className='link' to='/account/general'><div className='menu-item general active'>General</div></Link>
                        <Link className='link' to='/account/edit-profile'><div className='menu-item edit-profile'>Edit Profile</div></Link>
                        <Link className='link' to='/account/password'><div className='menu-item password'>Password</div></Link>
                        <div className='cut-across'></div>
                        <div onClick={() => handleDeleteUser()} className='menu-item' style={{color : 'red'}}>Delete Account</div>
                    </div>
                    <div className='col-lg-8 treatment'>
                        <div className='col-lg-12' id='general' style={{minHeight : '350px'}}>
                            <div className='group'>
                                <label>Username</label>
                                <input type="text" value={user != null ? user.username : ""} className="form-control txt-username txt" disabled />
                            </div>
                            <div className='group'>
                                <label>Email</label>
                                <input type="text" className="form-control txt-email txt" />
                            </div>
                            <div className='group' style={{display : 'flex', justifyContent : 'end'}}>
                                <button onClick={() => handleUpdateGeneral()} className='btn-save'>Save Change</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GeneralPage;