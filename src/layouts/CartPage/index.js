
import { useContext, useState, useEffect, useRef } from 'react';
import './cartpage.scss'
import {Context} from '../../components/UseContext/ThemeContext'
import axios from 'axios';
import Notification from '../../components/Notification';
import { Link, useNavigate } from 'react-router-dom';

function CartPage() {
    const [nof, setNof] = useState({status : 'none', message : 'none'})
    const [isLoad, setIsLoad, customer_name, data] = useContext(Context)
    const [load, setLoad] = useState(false)
    const [carts, setCarts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        setLoad(!load)
    }, [])

    useEffect(() => {
        setCarts(data.carts)
    }, [data])

    useEffect(() => {
        carts.forEach((cart, index) => {
            document.querySelector(`.list-item-${index} .txt-quantity`).value = cart.quantity
        })
    }, [load, carts])

    const handleChangeQuantity = (cart_index, type) => {
        let l = carts
        let user_id = 0
        let colorsize_id = 0
        let quantity = 0
        let id = 0

        l.forEach((cart, index) => {
            if (index == cart_index) {
                id = cart.id
                user_id = cart.user.id
                colorsize_id = cart.colorsize.id
                console.log(cart)
                if (type == '+') {
                    if (cart.quantity == cart.colorsize.quantity) {
                        setNof({status : 'none', message : ""})
                        setTimeout(() => {setNof({status : 'fail', message : "The quantity in the shopping cart does not exceed the product's inventory quantity"})}, 50);
                    }else {
                        cart.quantity = cart.quantity + 1
                    }
                } else if (type == '-') {
                    if (cart.quantity == 1) {
                        cart.quantity = 0
                        l = l.filter(item => item.id != cart.id)
                        axios.post('/carts/delete-cart-by-id', {user_id : user_id, colorsize_id : colorsize_id}, {headers : {'Content-Type': 'application/json'}})
                    } else {
                        cart.quantity = cart.quantity - 1
                    }
                }
                quantity = cart.quantity
            }
        })
        setCarts(l)
        setLoad(!load)
        setIsLoad(!isLoad)
        console.log(user_id, colorsize_id, quantity)
        axios.put('/carts/update-quantity-by-id', {user_id : user_id, colorsize_id : colorsize_id, quantity : quantity}, {headers : {'Content-Type': 'application/json'}})
    }

    const handleDeleteCart = (user_id, colorsize_id) => {
        let l = carts
        axios.post('/carts/delete-cart-by-id', {user_id : user_id, colorsize_id : colorsize_id}, {headers : {'Content-Type': 'application/json'}})
        l = l.filter(item => (item.user.id != user_id && item.colorsize.id != colorsize_id))
        setCarts(l)
        setLoad(!load)
        setIsLoad(!isLoad)
    }

    const handleChangeToPayment = () => {
        let l = []
        carts.forEach(item => {
            l.push({
                ...item.product,images : [{image : item.image}] ,color : item.colorsize.color, size : item.colorsize.size, price : item.colorsize.price, quantity : item.quantity, quantityProduct : item.colorsize.quantity
            })
        })
        navigate(`/payment/cart`);
        data.setPayload(l)
    }

    return (
        <div id='cartpage' className='col-lg-12'>
            <Notification status={nof.status} message={nof.message}/>
            {carts.length == 0 ? 
                <div className='form-not-cart'>
                    There are no products in the cart yet.
                    <Link to={'/categories/sneakers/vans'}><button>Return To The Store</button></Link>
                </div> 
            : <>
                <div className='list-product-area col-lg-7'>
                    <div className='col-lg-12 item'>
                        <div className='image-name it'>
                            Product
                        </div>
                        <div className='price it'>
                            Unit Price
                        </div>
                        <div className='quantity it'>
                            Quantity
                        </div>
                        <div className='total it'>
                            Total
                        </div>
                    </div>
                    <div className='col-lg-12 list'>
                        {carts.map((cart, index) => {
                            return <div key={index} className={`col-lg-12 list-item list-item-${index}`}>
                                <div className='image-name it'>
                                    <i onClick={() => handleDeleteCart(cart.user.id, cart.colorsize.id)} className='bx bx-x-circle'></i>
                                    <div className='image'>
                                        <img src={cart.image} width={'100%'} />
                                    </div>
                                    <div className='name'>
                                        {cart.product.name} - <b style={{margin : '0 3px'}}>Color:</b><div style={{margin : '0 7px' ,height : '15px', width : '15px', borderRadius : '50%', backgroundColor : cart.colorsize.color}}></div> - <b style={{margin : '0 3px'}}>Size:</b> {cart.colorsize.size}
                                    </div>
                                </div>
                                <div className='price it'>
                                    {cart.colorsize.price} $
                                </div>
                                <div className='quantity it'>
                                    <i onClick={() => handleChangeQuantity(index, '-')} className='bx bx-minus'></i>
                                    <input type='text' className='txt-quantity'/>
                                    <i onClick={() => handleChangeQuantity(index, '+')} className='bx bx-plus'></i>
                                </div>
                                <div className='total it'>
                                    {cart.quantity * cart.colorsize.price} $
                                </div>
                            </div>
                        })}
                    </div>
                    <Link className='link' to={'/categories/sneakers/vans'}><button className='btn-view'><i className='bx bx-arrow-back' ></i> Continue Viewing Products</button></Link>
                </div>
                <div className='payment-area col-lg-5'>
                    <div className='title'>Total Cart</div>
                    <div className='total'><span>Total : </span><span>
                        {carts.reduce((total, current) => {
                            return total + (current.quantity * current.colorsize.price)
                        }, 0)} $</span></div>
                    <button onClick={() => handleChangeToPayment()}>Proceed With Payment</button>
                    <div className='title' style={{ margin : '15px 0'}}><i className='bx bxs-discount'></i> Discount</div>
                    <input style={{marginBottom : '15px'}} type="text" className="form-control txt-discount" placeholder='Discount Code' />
                    <button style={{backgroundColor : 'black'}}>Apply</button>
                </div>
            </>}
        </div>
    );
}

export default CartPage;