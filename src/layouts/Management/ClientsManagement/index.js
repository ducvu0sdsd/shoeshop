
import { useState, useContext } from 'react'
import Notification from '../../../components/Notification'
import './client.scss'
import axios from 'axios'
import { Context } from '../../../components/UseContext/ThemeContext';
import { useNavigate } from 'react-router-dom';

function ClientsManagement({clients}) {
    const [nof, setNof] = useState({status : 'none', message : 'none'})
    const [currentClient, setCurrentClient] = useState(null)
    let [isLoad, setIsLoad, user, customer_name] = useContext(Context)
    const navigate = useNavigate()

    const handleDisplayClient = (index) => {
        let client = clients[index];
        setCurrentClient(client)
        console.log(client)
        document.querySelector('#client-management .txt-id').value = client.client.id
        document.querySelector('#client-management .txt-password').value = client.client.password
        document.querySelector('#client-management .txt-name').value = client.client.name
        document.querySelector('#client-management .txt-date').value = new Date(client.client.dateofbirth).toISOString().split('T')[0]
        document.querySelector('#client-management .txt-phone').value = client.client.phonenumber
        document.querySelector('#client-management .txt-email').value = client.client.email
        document.querySelector('#client-management .txt-gender').value = client.client.gender
        document.querySelector('#client-management .txt-address').value = client.client.address
        document.querySelector('#client-management .txt-username').value = client.client.username
        document.querySelector('#client-management .txt-num').value = client.numberOfOrder
        client.client.admin == true ? document.querySelector('.txt-admin').selectedIndex = 1 : document.querySelector('.txt-admin').selectedIndex = 2
    }

    const cleanInput =() => {
        setCurrentClient(null)
        document.querySelector('#client-management .txt-id').value = ''
        document.querySelector('#client-management .txt-password').value = ''
        document.querySelector('#client-management .txt-name').value = ''
        document.querySelector('#client-management .txt-date').value = ''
        document.querySelector('#client-management .txt-phone').value = ''
        document.querySelector('#client-management .txt-email').value = ''
        document.querySelector('#client-management .txt-gender').value = 'none'
        document.querySelector('#client-management .txt-address').value = ''
        document.querySelector('#client-management .txt-username').value = ''
        document.querySelector('#client-management .txt-num').value = ''
        document.querySelector('.txt-admin').selectedIndex = 0
        document.querySelector("#client-management .list-clients .active").classList.remove('active')
    }

    const handleUpdateClient = () => {
        let token = 'Bearer ' + localStorage.getItem("token")
        let client = currentClient.client;
        client.address = document.querySelector('#client-management .txt-address').value
        client.admin =  document.querySelector('.txt-admin').options[document.querySelector('.txt-admin').selectedIndex].value == 'true' ? true : false
        client.dateofbirth = document.querySelector('.txt-date').value
        client.email = document.querySelector('#client-management .txt-email').value
        client.name = document.querySelector('#client-management .txt-name').value
        client.gender = document.querySelector('#client-management .txt-gender').value
        client.phonenumber = document.querySelector('#client-management .txt-phone').value
        axios.post('/clients/update-client', {user : client}, {headers : {Authorization : token, 'Content-Type': 'application/json'}})
            .then (res => {
                if (res.data == true) {
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'success', message : 'Update A Sucessful Client'})}, 50);
                    setIsLoad({...isLoad, client: !isLoad.client})
                    cleanInput()
                } else {
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'fail', message : 'Update Failed Client'})}, 50);
                }
            })
    }

    const handleDeleteClient = () => {
        let client = currentClient.client;
        let token = 'Bearer ' + localStorage.getItem("token")
        axios.post('/clients/delete-client', {user : client}, {headers : {Authorization : token, 'Content-Type': 'application/json'}})
            .then (res => {
                if (res.data == true) {
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'success', message : 'Delete A Sucessful Client'})}, 50);
                    setIsLoad({...isLoad, client: !isLoad.client})
                    cleanInput()
                } else {
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'fail', message : 'Delete Failed Client'})}, 50);
                }
            })
    }

    const handleLinkToOrdersOfCustomer = () => {
        customer_name = document.querySelector('#client-management .txt-name').value
        localStorage.setItem('customer_name', customer_name)
        navigate('/accounts/sales-management')
    }

    return (
        <div id='client-management' className='col-lg-12'>
            <Notification status={nof.status} message={nof.message}/>
            <h4 className='col-lg-12'>Clients Management</h4>
            <div className='col-lg-12' style={{display : 'flex'}}>
                <div className='col-lg-4 form-input'>
                    <div className='avatar' >
                        <img width={'100%'} src={currentClient ? currentClient.client.avatar : 'https://d11a6trkgmumsb.cloudfront.net/original/3X/d/8/d8b5d0a738295345ebd8934b859fa1fca1c8c6ad.jpeg'}/>
                    </div>
                    <input type='hidden' className='txt-id' />
                    <input type='hidden' className='txt-password' />
                    <div className='form-group'>
                        <label>Client Name: </label>
                        <input type="text" className="form-control txt-name" placeholder='Client Name' />
                    </div>
                    <div className='form-group'>
                        <label>Date Of Birth: </label>
                        <input type="date" className="form-control txt-date" placeholder='Phone Number' />
                    </div>
                    <div className='form-group'>
                        <label>Phone Number: </label>
                        <input type="text" className="form-control txt-phone" placeholder='Phone Number' />
                    </div>
                    <div className='form-group'>
                        <label>Email: </label>
                        <input type="text" className="form-control txt-email" placeholder='Email' />
                    </div>
                    <div className='form-group'>
                        <label>Address: </label>
                        <input type="text" className="form-control txt-address" placeholder='Address' />
                    </div>
                    <div className='form-group'>
                        <label>Gender</label>
                        <select class="form-select txt-gender" aria-label="Default select example">
                            <option value="none">None</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className='form-group'>
                        <label>Username: </label>
                        <input type="text" disabled className="form-control txt-username" placeholder='Username' />
                    </div>
                    <div className='form-group'>
                        <label>Number Of Order: </label>
                        <input type="text" disabled style={{width : '250px'}} className="form-control txt-num" placeholder='Number Of Order' />
                        <button onClick={() => {handleLinkToOrdersOfCustomer()}} type="button" style={{width : '65px'}} className="btn btn-success">Detail</button>
                    </div>
                    <div className='form-group'>
                        <label>Admin: </label>
                        <select className='txt-admin'>
                            <option value={'none'}>None</option>
                            <option value={true}>True</option>
                            <option value={false}>False</option>
                        </select>
                    </div>
                    <div className='form-group' style={{paddingLeft : '100px', marginTop : '10px'}}>
                        <button onClick={() => handleUpdateClient()} type="button" className="btn btn-primary">Update</button>
                        <button onClick={() => handleDeleteClient()} type="button" className="btn btn-danger">Delete</button>
                        <button onClick={() => cleanInput()} type="button" className="btn btn-secondary">Clean</button>
                    </div>
                </div>
                <div className='col-lg-8 collection'>
                    <table className='col-lg-12'>
                        <tr>
                            <th style={{width : '55px'}}>Logo</th>
                            <th style={{width : '190px'}}>Name</th>
                            <th style={{width : '130px'}}>Phone Number</th>
                            <th style={{width : '200px'}}>Email</th>
                            <th style={{width : '310px'}}>Address</th>
                            <th style={{width : '80px'}}>Num</th>
                        </tr>
                    </table>
                    <div className='col-lg-12 list-clients'>
                        {clients.map((client, index) => {
                            return (
                                <div
                                    onClick={() => {document.querySelector("#client-management .list-clients .active") ? 
                                        document.querySelector("#client-management .list-clients .active").classList.remove('active') : document.querySelector('#client-management .list-clients .client-' + index).classList.add('active')
                                        document.querySelector('#client-management .list-clients .client-' + index).classList.add('active')
                                        handleDisplayClient(index)
                                    }} 
                                    key={index} className={`client col-lg-12 client-${index} active1`}>

                                    <div className='avatar item'>
                                        <img width={'100%'} style={{borderRadius: '50%'}} src={client.client.avatar} />
                                    </div>
                                    <div className='name item'>{client.client.name}</div>
                                    <div className='phone item'>{client.client.phonenumber}</div>
                                    <div className='email item'>{client.client.email}</div>
                                    <div className='address item'>{client.client.address}</div>
                                    <div className='number-of-order item'>{client.numberOfOrder}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientsManagement;
