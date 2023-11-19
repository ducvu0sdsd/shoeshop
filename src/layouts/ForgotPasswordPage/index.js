
import axios from 'axios';
import './forgotpassword.scss'
import { useState } from 'react';
import Notification from '../../components/Notification';

function ForgotPasswordPage() {
    const [change, setChange] = useState(false)
    const [nof, setNof] = useState({status : 'none', message : 'none'})

    const handleSubmit = () => {
        let email = document.querySelector('.txt_email').value
        axios.get(`/accounts/get-user-by-email?email=${email}`, {headers: {'Content-Type': 'application/json'}})
            .then (res => {
                if(res.data != '') {
                    setChange(true)
                    axios.put(`/accounts/update-password-account-by-id`,{id : res.data.id, email : res.data.email} ,{headers: {'Content-Type': 'application/json'}})
                        .then(res => {
                            console.log(res.data)
                        })
                } else {
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'fail', message :'Email Invalid'})}, 50);
                }
            })
    }

    return (
        <div id='forgot-password-page' className='col-lg-12'>
            <Notification status={nof.status} message={nof.message}/>
            {change == false ? <div className='container col-lg-6'>
                <div className='title'>Enter Your Email</div>
                <input type="text" className="form-control txt_email" placeholder='Your Email' />
                <button onClick={() => handleSubmit()} type="button" className="btn btn-dark">Submit</button>
            </div> : <div className='container col-lg-6'>
                <div className='title' style={{textAlign : 'center'}}>We have sent you a new password via email, please check your inbox.
You can change your password when you successfully log in to your account !!!</div>
            </div>}
        </div>      
    );
}

export default ForgotPasswordPage;