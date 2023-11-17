

import './paymentpage.scss'
import { Context } from '../../components/UseContext/ThemeContext';
import { useContext, useEffect, useRef, useState } from 'react';
import Notification from '../../components/Notification'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import imageSuccess from './image-removebg-preview.png'

function PaymentPage({user1}) {

    const [user, setUser] = useState(null)
    const [isload, setIsLoad, customer_name, data] = useContext(Context)
    const {cart} = useParams()
    const [nof, setNof] = useState({status : 'none', message : 'none'})
    const [products, setProducts] = useState([])
    const [shipMoney, setShipMoney] = useState(0)
    const navigate = useNavigate()
    const timeout = useRef()

    useEffect(() => {
        setProducts(data.payload)
    }, [data.payload])

    const handleCheckInput = () => {
        let txtname = document.querySelector('#payment-page .txt-name').value
        let txtphone = document.querySelector('#payment-page .txt-phone').value
        let txtemail = document.querySelector('#payment-page .txt-email').value
        let txtaddress = document.querySelector('#payment-page .txt-address').value
        if (txtname == '') {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Name'})}, 50);
            return false;
        }
        if (txtphone == '') {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Phone'})}, 50);
            return false;
        }
        if (txtemail == '') {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Email'})}, 50);
            return false;
        }
        if (txtaddress == '') {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Address'})}, 50);
            return false;
        }
        if (!document.querySelector('input[name="payment"]:checked')) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Choose Payment Method'})}, 50);
            return false;
        }
        if (!document.querySelector('input[name="shipping"]:checked')) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Choose Shipping Method'})}, 50);
            return false;
        }
        return true;
    }

    useEffect(() => {
        if (user1 != null) {
            setUser(user1)
            document.querySelector('#payment-page .txt-name').value = user1.name
            document.querySelector('#payment-page .txt-phone').value = user1.phonenumber
            document.querySelector('#payment-page .txt-email').value = user1.email
            document.querySelector('#payment-page .txt-address').value = user1.address
        }
    }, [user1])  

    const handleOrderWithAccount = () => {
        if (!handleCheckInput()) return
        let note = document.querySelector('#payment-page .txt-note').value
        let method = document.querySelector('input[name="payment"]:checked').value
        let colorsizes = products.map(p => ({ color: p.color, size: p.size, quantity: parseInt(p.quantityProduct) - parseInt(p.quantity), quantityOrder : parseInt(p.quantity), product_id : p.id }));
        let name = document.querySelector('#payment-page .txt-name').value
        let email = document.querySelector('#payment-page .txt-email').value
        if (cart) {
            let user_id = user.id
                axios.post('/payments/order-from-cart-of-client',{note : note, method : method, user_id : user_id, colorsizes : colorsizes, shippingPrice : shipMoney},{headers : {'Content-Type': 'application/json'}})
                    .then(res => {
                        if (res.data == true) {
                            setIsLoad({...isload, cart : !isload.cart})
                            handleCongratulations()
                        }
                    })
        } else {
            if (user) {
                let user_id = user.id
                axios.post('/payments/order-from-client',{note : note, method : method, user_id : user_id, colorsizes : colorsizes, shippingPrice : shipMoney},{headers : {'Content-Type': 'application/json'}})
                    .then(res => {
                        if (res.data == true) {
                            setIsLoad({...isload, cart : !isload.cart})
                            handleCongratulations()
                        }
                    })
            } else {
                let txtname = document.querySelector('#payment-page .txt-name').value
                let txtphone = document.querySelector('#payment-page .txt-phone').value
                let txtemail = document.querySelector('#payment-page .txt-email').value
                let txtaddress = document.querySelector('#payment-page .txt-address').value
                axios.post('/payments/order-from-guest',
                    {note : note, method : method, address : txtaddress, name : txtname, email : txtemail, phone : txtphone, colorsizes : colorsizes, shippingPrice : shipMoney},
                    {headers : {'Content-Type': 'application/json'}})
                    .then(res => {
                        if (res.data == true) {
                            setIsLoad({...isload, cart : !isload.cart})
                            handleCongratulations()
                        }
                    })
            }
        }
        axios.post('/emails/notice-of-successful-order',{name : name, toEmail : email ,products : products},{headers : {'Content-Type': 'application/json'}})
    }

    const handleCongratulations = () => {
        const form = document.querySelector('.form-congratulation')
        const opa = document.querySelector('#payment-page .opa')
        setIsLoad({...isload, orderbuy : !isload.orderbuy, product : !isload.product})
        setNof({status : 'none', message : ""})
        setTimeout(() => {setNof({status : 'success', message : 'Order successful, if you have any other comments, please contact 0902491471'})}, 50);
        opa.style.display = 'block'
        form.style.top = '150px'
        timeout.current = setTimeout(() => {
            handleNavigateToHome()
        }, 4500)
    }

    const handleNavigateToHome= () => {
        clearTimeout(timeout.current)
        navigate('/categories/customs/all')
        setTimeout(() => window.location.reload(), 300)

    }

    const handleCloseForm = () => {
        const form = document.querySelector('.form-congratulation')
        const opa = document.querySelector('#payment-page .opa')
        opa.style.display = 'none'
        form.style.top = '-500px'
    }

    return (
        <div id='payment-page' className='col-lg-12'>
            <Notification status={nof.status} message={nof.message}/>
            <div className='opa' onClick={() => {handleCloseForm(); handleNavigateToHome()}}></div>
            <div className='form-congratulation'>
                <div className='title'>Thank you {document.querySelector('#payment-page .txt-name') ? document.querySelector('#payment-page .txt-name').value : ''} for your successful order !!!</div>
                <img width={'50%'} src={imageSuccess}/>
                <div className='message'>We will call you soon. But if you have any questions, please contact us by phone number 0902491471</div>
                <div onClick={() => handleNavigateToHome()} style={{textDecoration : 'underline', color : 'blue'}}>See more other products</div>
            </div>
            <div className='col-lg-7 bill-info'>
                <h4 className='col-lg-12'>Billing Information</h4>
                <div className='col-lg-12 form-input'>
                    <label>Name *</label>
                    <input type="text" className="form-control txt-name" placeholder='Your Name' />
                </div>
                <div className='col-lg-6 form-input'>
                    <label>Phone Number *</label>
                    <input type="text" className="form-control txt-phone" placeholder='Your Phone Number' />
                </div>
                <div className='col-lg-6 form-input'>
                    <label>Email Address *</label>
                    <input type="text" className="form-control txt-email" placeholder='Your Email Address' />
                </div>
                <div className='col-lg-6 form-input'>
                    <label>Address *</label>
                    <input type="text" className="form-control txt-address" placeholder='Your Address' />
                </div>
                <div className='col-lg-6 form-input'></div>
                <div className='col-lg-6 form-input'>
                    <label>Payment Methods *</label>
                    <table>
                        <tr>
                            <td><input type="radio" id="pay-cash" name="payment" value="Cash"/><label htmlFor="pay-cash"><i className="fa-solid fa-money-bill"></i> Cash</label></td>
                            {/* <td><input type="radio" id="pay-bank" name="payment" value="Bank Transfer"/><label htmlFor="pay-bank">Bank Transfer</label></td>
                            <td><input type="radio" id="pay-credit" name="payment" value="Credit and Debit Cards"/><label htmlFor="pay-credit">Credit and Debit Cards</label></td> */}
                        </tr>
                    </table>
                </div>
                <div className='col-lg-6 form-input'>
                    <label>Shipping Methods *</label>
                    <table>
                        <tr>
                            <td><input onClick={() => setShipMoney(3.35)} type="radio" id="pay-cash" name="shipping" value="Express"/><label htmlFor="pay-cash"><i className="fa-solid fa-rocket"></i> Express Delivery (about 1 - 3 hours)</label></td>
                            <td><input onClick={() => setShipMoney(1.95)} type="radio" id="pay-cash" name="shipping" value="Super"/><label htmlFor="pay-cash"><i className="fa-solid fa-truck-fast"></i> Super fast delivery (about 1 - 2 days)</label></td>
                            <td><input onClick={() => setShipMoney(1.35)} type="radio" id="pay-cash" name="shipping" value="Economical"/><label htmlFor="pay-cash"><i className="fa-solid fa-truck"></i> Economical Delivery (about 3 - 5 days)</label></td>
                        </tr>
                    </table>
                </div>
                <div className='col-lg-12 form-input'>
                    <label>Note</label>
                    <textarea className="form-control txt-note" rows="4"></textarea>
                </div>
            </div>
            <div className='col-lg-5'>
                <div className='col-lg-12 order-info'>
                    <h4 className='col-lg-12'>Your Order</h4>
                    <h6 className='col-lg-6' style={{textAlign : 'start', paddingLeft: "10px"}}>Product</h6>
                    <h6 className='col-lg-6' style={{textAlign : 'end', paddingRight: "10px"}}>Provisional</h6>
                    <div className='col-lg-12 products-area'>
                        {products.length != 0 ?
                            products.map((product, index) => {
                                return <div className='col-lg-12 product-item'>
                                    <div className='name col-lg-10'>
                                        <img key={index} width={"40px"} src={product.images[0].image} style={{marginRight : '8px'}} /> {product.name.toUpperCase()} -- <b style={{margin : "0 5px"}}>Size {product.size}</b> -- <b style={{margin : "0 5px"}}>Color</b> <div className='color' style={{backgroundColor : product.color}}/> <b style={{margin : "0 5px"}}>x {product.quantity}</b>
                                    </div>
                                    <div className='price col-lg-2'>
                                        $ {product.price}
                                    </div>
                                </div>
                            })
                        :<></>}
                    </div>
                    <div className='col-lg-12 other-area'>
                        <h6 className='col-lg-10' style={{textAlign : 'start', paddingLeft: "10px"}}>Provisional</h6>
                        <h6 className='col-lg-2' style={{textAlign : 'end', paddingRight: "10px"}}>$ {products.reduce((total, current) => {return total + (current.price * parseInt(current.quantity))}, 0)}
                        </h6>
                    </div>
                    <div className='col-lg-12 total-area'>
                        <h6 className='col-lg-10' style={{textAlign : 'start', paddingLeft: "10px"}}>Delivery Money</h6>
                        <h6 className='col-lg-2' style={{textAlign : 'end', paddingRight: "10px"}}>$ {shipMoney}
                        </h6>
                    </div>
                    <div className='col-lg-12 total-area'>
                        <h6 className='col-lg-10' style={{textAlign : 'start', paddingLeft: "10px"}}>Total</h6>
                        <h6 className='col-lg-2' style={{textAlign : 'end', paddingRight: "10px"}}>$ {products.reduce((total, current) => {return total + (current.price * parseInt(current.quantity))}, 0) + shipMoney}
                        </h6>
                    </div>
                    <button onClick={() => handleOrderWithAccount()} type="button" className="btn btn-success">Order Now !!!</button>
                    <p style={{textAlign : 'start', lineHeight : '25px', margin : '10px 0'}}>Your personal information will be used to process orders, enhance your website experience, and for other specific purposes described in our privacy policy.</p>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;