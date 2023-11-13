
import axios from 'axios';
import './userpage.scss'
import { Link } from 'react-router-dom';
import Notification from '../../components/Notification'
import { useContext, useEffect, useState } from 'react';
import { Context } from '../../components/UseContext/ThemeContext';

function EditProfilePage({user}) {

    const [isLoad, setIsLoad] = useContext(Context)
    const [nof, setNof] = useState({status : 'none', message : 'none'})

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

    const handleUpdateAvatar = () => {
        let inputAvatar = document.querySelector('.image-user')

        if (inputAvatar.files.length > 0) {
            let file = inputAvatar.files[0]
            let t = localStorage.getItem("token")
            let username = localStorage.getItem("username")
            let token = 'Bearer ' + t;

            // chuyển file ảnh thành Encode và put vào SQL
            let render = new FileReader()
            render.onload = (e) => {
                let base64String = e.target.result
                axios.put('/accounts/update-avatar-account',{username : username, avatar : base64String},{headers : {Authorization : token, 'Content-Type': 'application/json'}})
                    .then(res => {
                        if (res.data == true) {
                            setIsLoad({...isLoad, user : !isLoad.user})
                            inputAvatar.value = ""
                            setNof({status : 'none', message : ""})
                            setTimeout(() => {setNof({status : 'success', message : 'Avatar Updated Successfully'})}, 50);
                        } else {
                            setNof({status : 'none', message : ""})
                            setTimeout(() => {setNof({status : 'fail', message : 'Avatar Updated Failed'})}, 50);
                        }
                    })
            }
            render.readAsDataURL(file)
        } else {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Choose Avatar'})}, 50);
        }
    }

    const handleUpdateDefaultAvatar = () => {
        let t = localStorage.getItem("token")
        let username = localStorage.getItem("username")
        let token = 'Bearer ' + t;
        axios.put('/accounts/update-avatar-account',{username : username, avatar : 'default'},{headers : {Authorization : token, 'Content-Type': 'application/json'}})
            .then(res => {
                if (res.data == true) {
                    setIsLoad({...isLoad, user : !isLoad.user})
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'success', message : 'Avatar Updated Successfully'})}, 50);
                } else {
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'fail', message : 'Avatar Updated Failed'})}, 50);
                }
            })
    }

    const handleChangeImageView = () => {
        let inputAvatar = document.querySelector('.image-user')
        if (inputAvatar.files.length > 0) {
            let file = inputAvatar.files[0]
            document.querySelector('.avatar').src = URL.createObjectURL(file)
        }
    }

    const handleUpdateBasicInformation = () => {
        let txt_name = document.querySelector('.txt-name').value
        let txt_phonenumber = document.querySelector('.txt-phonenumber').value
        let txt_date = document.querySelector('.txt-date').value
        let txt_address = document.querySelector('.txt-address').value
        let txt_gender = document.querySelector('.txt-gender').value
        let t = localStorage.getItem("token")
        let username = localStorage.getItem("username")
        let token = 'Bearer ' + t;
        axios.put('/accounts/update-information-account',{username : username, name : txt_name, phone : txt_phonenumber, date : txt_date, address : txt_address, gender : txt_gender},{headers : {Authorization : token, 'Content-Type': 'application/json'}})
            .then(res => {
                if (res.data == true) {
                    setIsLoad({...isLoad, user : !isLoad.user})
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'success', message : 'Information Updated Successfully'})}, 50);
                } else {
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'fail', message : 'Information Updated Failed'})}, 50);
                }
            })
    }

    useEffect (() => {
        let txt_name = document.querySelector('.txt-name')
        let txt_address = document.querySelector('.txt-address')
        let txt_phonenumber = document.querySelector('.txt-phonenumber')
        let txt_date = document.querySelector('.txt-date')
        let txt_gender = document.querySelector('.txt-gender')
        let date = new Date(user.dateofbirth)
        txt_address.value = user.address
        txt_name.value = user.name
        txt_phonenumber.value = user.phonenumber
        txt_date.value = date.toISOString().split('T')[0];
        txt_gender.value = user.gender
    }, [])

    return (
        <div className="col-lg-12" style={{display : 'flex', justifyContent : 'center'}}>
            <Notification status={nof.status} message={nof.message}/>
            <div className="col-lg-8 userpage">
                <div className='col-lg-12 slat-header'>
                    <div className='logo'>
                        <img src={user != null ? user.avatar : ""} height='100%'/>
                    </div>
                    <div className='col-lg-7 title-and-description'>
                        <div className='title'>{user != null ? user.name : ""} / Edit Profile</div>
                        <div className='description'>
                            Set up your UWD presence
                        </div>
                    </div>
                </div>
                <div className='col-lg-12 menu-and-treatment'>
                    <div className='col-lg-4 menus'>
                        <Link className='link' to='/account/general'><div className='menu-item general'>General</div></Link>
                        <Link className='link' to='/account/edit-profile'><div className='menu-item edit-profile active'>Edit Profile</div></Link>
                        <Link className='link' to='/account/password'><div className='menu-item password'>Password</div></Link>
                        <div className='cut-across'></div>
                        <div className='menu-item' onClick={() => handleDeleteUser()}  style={{color : 'red'}}>Delete Account</div>
                    </div>
                    <div className='col-lg-8 treatment'>
                        <div className='col-lg-12' id='edit-profile' style={{minHeight : '350px'}}>
                            <div className='group' style={{display : 'flex'}}>
                                <div className="logo">
                                    <img className='avatar' src={user.avatar} height='100%'/>
                                </div>
                                <div className="col-lg-7 action">
                                    <input onChange={() => handleChangeImageView()} type="file" className="image-user" accept=".jpg, .jpeg, .png"/>
                                    <div className="btns">
                                        <button onClick={() => handleUpdateAvatar()} className="btn-save">Save Picture</button>
                                        <button onClick={() => handleUpdateDefaultAvatar()} className="btn-del">Delete</button>
                                    </div>
                                </div>
                            </div>
                            <div className='group'>
                                <label>Name <span style={{color : 'red', padding : '0 5px'}}>*</span></label>
                                <input type="text" className="form-control txt-name txt" />
                            </div>
                            <div className='group'>
                                <label>Date Of Birth</label>
                                <input type="date" className="form-control txt-date txt" />
                            </div>
                            <div className='group'>
                                <label>Gender</label>
                                <select class="form-select txt-gender" aria-label="Default select example">
                                    <option value="none">None</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className='group'>
                                <label>Phone Number</label>
                                <input type="text" className="form-control txt-phonenumber txt" />
                            </div>
                            <div className='group'>
                                <label>Address</label>
                                <input type="text" className="form-control txt-address txt" />
                            </div>
                            <div className='group' style={{display : 'flex', justifyContent : 'end'}}>
                                <button onClick={() => handleUpdateBasicInformation()} className='btn-save'>Save Profile</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfilePage;