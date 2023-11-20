
import './shoesdetail.scss'
import { useEffect, useContext, useState } from 'react';
import { useRef } from 'react';
import ListShoe from './ListShoe';
import Notification from '../../components/Notification'
import { Context } from '../../components/UseContext/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ShoesDetail({product, products, user}) {
    const [listImage, setListImage] = useState([])
    const [lsizes, setlSizes] = useState([])
    const [lcolors, setlColors] = useState([])
    const [sizes, setSizes] = useState([])
    const [colors, setColors] = useState([])
    const [list_size_color_quantity_price, setList_size_color_quantity_price] = useState([])
    const [load, setLoad] = useState(false)
    const [isLoad, setIsLoad, customer_name, data] = useContext(Context)
    const [nof, setNof] = useState({status : 'none', message : 'none'})
    const [quantity, setQuantity] = useState(0)
    const [quantityProduct, setQuantityProduct] = useState(0)
    const [currentProduct, setCurrentProduct] = useState(null)
    const [listRecomment, setListRecomment] = useState([])
    const [feedbacks, setFeedbacks] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        setListRecomment(products.filter((item) => {return item.id != product.id}))
    }, [products])

    useEffect(() => {
        setFeedbacks(data.feedbacks)
    }, [data.feedbacks])

    useEffect(() => {
        if (product.sizes) {
            let l = []
            product.images.forEach(image => {
                l.push(image.image)
            })
            setListImage(l)

            let l1 = []
            product.sizes.forEach(size => {
                if (!l1.includes(size)) {
                    l1.push(size)
                }
            })
            setSizes(l1)

            let l2 = []
            product.colors.forEach(color => {
                if (!l2.includes(color)) {
                    l2.push(color)
                }
            })
            setColors(l2)

            if (product.quantity != null || product.quantity == 0) {
                let l1 = []
                product.quantity.forEach((item, index) => {
                    l1.push({color : product.colors[index], size : product.sizes[index], quantity : product.quantity[index], price : product.prices[index]})
                })
                setList_size_color_quantity_price(l1)
            } else {
                setList_size_color_quantity_price([])
            }
            document.querySelectorAll('.shoes-detail .active').forEach(item => {
                item.classList.remove('active')
            })
            if (listImage.length > 0) {
                document.querySelector('.shoes-detail .mini-images .item0').classList.add('active')
            }
            document.querySelector('.sizes .btn-clean').style.display = 'none'
            document.querySelector('.colors .btn-clean').style.display = 'none'
            setlColors([])
            setlSizes([])
            document.querySelector('.shoes-detail .price').textContent = '$ ---'
            document.querySelector('.shoes-detail .title-amount').textContent = 'The Remaining Amount: ---'
            document.querySelector('.shoes-detail .title-amount').style.fontWeight = '500'
        }else {
            let l = []
            product.images.forEach(image => {
                l.push(image.image)
            })
            setListImage(l)
        }
    },[load, product])
    const imageRef = useRef()

    const handleChangeImage = (num) => {
        document.querySelector('.shoes-detail .list').style.transform = `translateX(${imageRef.current.offsetWidth * num * -1}px)`
    }

    const handleOptionSize = (e) => {
        document.querySelector('.shoes-detail .list-size .active') ?
        document.querySelector('.shoes-detail .list-size .active').classList.remove('active') : e.target.classList.add('active')
        e.target.classList.add('active')
        let size = e.target.textContent
        let l = []
        list_size_color_quantity_price.forEach(item => {
            if (item.size == size + '') {
                l.push(item.color)
            }
        })
        setlColors(l)
        document.querySelector('.sizes .btn-clean').style.display = 'block'
        if (document.querySelector('.shoes-detail .list-colors .active')) {
            let color = document.querySelector('.shoes-detail .list-colors .active').style.backgroundColor
            list_size_color_quantity_price.forEach(item => {
                if (item.color == color && item.size == size) {
                    document.querySelector('.shoes-detail .price').textContent = '$ ' + item.price
                    if (item.quantity == 0) {
                        document.querySelector('.shoes-detail .title-amount').textContent = 'Sold Out'
                        document.querySelector('.shoes-detail .title-amount').style.fontWeight = 'bold'
                    }else {
                        document.querySelector('.shoes-detail .title-amount').textContent = 'The Remaining Amount: ' + item.quantity
                        document.querySelector('.shoes-detail .title-amount').style.fontWeight = '500'
                    }
                    setCurrentProduct({color : color, size : size, price : item.price})
                    setQuantityProduct(item.quantity)
                }
            })
        }
    }

    const handleOptionColor = (e) => {
        document.querySelector('.shoes-detail .list-colors .active') ?
        document.querySelector('.shoes-detail .list-colors .active').classList.remove('active') : e.target.classList.add('active')
        e.target.classList.add('active')
        let color = e.target.style.backgroundColor
        let l = []
        list_size_color_quantity_price.forEach(item => {
            if (item.color == color + '') {
                l.push(item.size)
            }
        })
        setlSizes(l)

        document.querySelector('.colors .btn-clean').style.display = 'block'
        if (document.querySelector('.shoes-detail .list-size .active')) {
            let size = document.querySelector('.shoes-detail .list-size .active').textContent
            list_size_color_quantity_price.forEach(item => {
                if (item.color == color && item.size == size) {
                    document.querySelector('.shoes-detail .price').textContent = '$ ' + item.price
                    if (item.quantity == 0) {
                        document.querySelector('.shoes-detail .title-amount').textContent = 'Sold Out'
                        document.querySelector('.shoes-detail .title-amount').style.fontWeight = 'bold'
                    }else {
                        document.querySelector('.shoes-detail .title-amount').textContent = 'The Remaining Amount: ' + item.quantity
                        document.querySelector('.shoes-detail .title-amount').style.fontWeight = '500'
                    }
                    setCurrentProduct({color : color, size : size, price : item.price})
                    setQuantityProduct(item.quantity)
                }
            })
        }
    }

    const handleAdjustAmount = (str) => {
        if (str == '+') {
            setQuantity(quantity + 1)
        } else {
            if (quantity == 0) {
                setNof({status : 'none', message : ""})
                setTimeout(() => {setNof({status : 'fail', message : 'Purchase quantity cannot be less than 0'})}, 50);
            }  else {
                setQuantity(quantity - 1)
            }        
        }
    }

    const checkAction = () => {
        if (currentProduct == null) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Choose Color, Size, Quantity Before Confirming'})}, 50);
            return false;
        }
        return true;
    }

    const NotifySoldOut = () => {
        setNof({status : 'none', message : ""})
        setTimeout(() => {setNof({status : 'fail', message : 'Cannot purchase or add to cart because this product is out of stock'})}, 50);
    }

    const checkQuantity = () => {
        if (quantityProduct == 0) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'This product is sold out'})}, 50);
            return false;
        }
        if (quantity <= 0) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'The Quantity must be getter than 0'})}, 50);
            return false;
        }
        if (quantity > quantityProduct) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'The quantity must be less than or equal to the quantity of the product'})}, 50);
            return false;
        }
        return true
    }

    const handleMoveItem = () => {
        const addtoCartItem = document.querySelector('.item-to-cart')
        addtoCartItem.style.opacity = 1
        addtoCartItem.style.top = '-470px'
        addtoCartItem.style.left = "730px"
        setTimeout(() => {
            addtoCartItem.style.opacity = 0
        }, 500)
        setTimeout(() => {
            addtoCartItem.style.top = '-30px'
            addtoCartItem.style.left = "180px"
        }, 1000)
    }

    const handleAddToCart = () => {
        if (user) {
            handleMoveItem()
            data.setCarts([...data.carts,{product, colorsize : currentProduct, quantity : quantity}])
            axios.post('/carts/insert-cart', {user_id : user.id, color : currentProduct.color, size : currentProduct.size, quantity : quantity}, {headers : {'Content-Type': 'application/json'}})
                .then(res => {
                    if (res.data == true) {
                        let l = []
                        axios.get('/carts/get-all-cart-by-user?user_id='+user.id, {headers : {'Content-Type': 'application/json'}})
                            .then (res => {
                                res.data.forEach(item => {
                                    products.forEach(item1 => {
                                        if (item1.id == item.colorSize.product.id) {
                                            l.push({
                                                product : item.colorSize.product,
                                                colorsize : {color : item.colorSize.color, size : item.colorSize.size, price : item.colorSize.retailPrice, quantity : item.colorSize.quantity},
                                                quantity : item.quantity,
                                                image : item1.images[0].image
                                            })
                                        }
                                    })
                                })
                                data.setCarts(l)
                            })
                    }
                })
            setIsLoad({...isLoad, cart : !isLoad.cart})
        }else {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please log in to your account before adding to cart'})}, 50);
        }
    }

    const handleSentMessage = () => {
        let message = document.querySelector('.user-message').value
        if (message != "") {
            let user_id = user.id
            let product_id = product.id
            axios.post('/feedbacks', {content : message, user_id : user_id, product_id : product_id} ,{headers : {'Content-Type': 'application/json'}})
                .then(res => {
                    data.setFeedbacks([...data.feedbacks, res.data])
                    document.querySelector('.user-message').value = ''
                })
        } else {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Message Before Sending'})}, 50);
        }
    }

    const formatTimeAgo = (period) => {
        const seconds = Math.floor(period / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
    
        if (months > 0) {
            return `${months} month ago`;
        } else if (days > 0) {
            return `${days} day ago`;
        } else if (hours > 0) {
            return `${hours} hour ago`;
        } else if (minutes > 0) {
            return `${minutes} minute ago`;
        } else {
            return `${seconds} second ago`;
        }
    };
  
    const handleFormatDate = (d) => {
        let now = new Date()
        let period = now.getTime() - d.getTime()
        return formatTimeAgo(period);
    } 

    const handleRemoveMessage = (id) => {
        axios.post('/feedbacks/' + id, {headers : {'Content-Type': 'application/json'}})
            .then (res => {
                if (res.data == true) {
                    let l = data.feedbacks.filter((item) => item.id != id)
                    data.setFeedbacks(l)
                }
            })
    }

    return (
        <div className='shoes-detail col-lg-12'>
            <Notification status={nof.status} message={nof.message}/>
            <div className='images col-lg-4'>
                <div className='image col-lg-12' ref={imageRef}>
                    <div className='list'>  
                        {listImage.map((item, index) => (<div key={index} className='item col-lg-12'><img src={item} width='90%'/></div>))}
                    </div>
                </div>
                <div className='mini-images'>
                    {listImage.map((item, index) => (<div onClick={() => {
                        handleChangeImage(index)
                        document.querySelector('.shoes-detail .mini-images .active').classList.remove('active')
                        document.querySelector('.shoes-detail .mini-images .item'+index).classList.add('active')
                    }} key={index} className={index == 0 ? `item${index} item active` : `item item${index}`}>
                        <img src={item} width='95%'/>
                    </div>))}
                </div>
            </div>
            <div className='info col-lg-6'>
                <h4 className='col-lg-12 title'>
                    {product.name.toUpperCase()} {` (${product.category})`}
                </h4>
                <p className='col-lg-12 brand'>
                    Brand: <img height={'40px'} width={'40px'} style={{borderRadius : '50%'}} src={product.brand.logo} /> {product.brand.brandName}
                </p>
                <p className='col-lg-12 price'>
                    Price: $ ---
                </p>
                {product.sizes ? <>
                    <div className='col-lg-10 colors'>
                        <p className='title-amount title col-lg-12' style={{fontSize : '18px', lineHeight : '25px'}}>The Remaining Amount: ---</p>
                    </div>
                    <div className='col-lg-10 sizes'>
                        <p className='title col-lg-12 ' style={{fontSize : '18px', lineHeight : '25px'}}>Sizes</p>
                        <div className='col-lg-12 list-size'>
                            {sizes.map((size, index) => {
                                if (lsizes.length != 0) {
                                    if (!lsizes.includes(size)) {
                                        return <div key={index} className='item disable'>{size}</div>
                                    } else {
                                        return <div onClick={(e) => {
                                            handleOptionSize(e);
                                        }} 
                                        key={index} className='item'>{size}</div>
                                    }
                                } else return <div onClick={(e) => {
                                    handleOptionSize(e);
                                }} 
                                key={index} className='item'>{size}</div>
                            })}
                            <i className='bx bx-x btn-clean' onClick={(e) => {setLoad(!load); e.target.style.display = 'none'; setCurrentProduct(null)}} style={{cursor: 'pointer',fontSize :'21px', color : '#999', display : 'none'}}></i>
                        </div>
                    </div>
                    <div className='col-lg-10 colors'>
                        <p className='title col-lg-12' style={{fontSize : '18px', lineHeight : '25px'}}>Colors</p>
                        <div className='col-lg-12 list-colors'>
                            {colors.map((color, index) => {
                                if (lcolors.length != 0) {
                                    if (!lcolors.includes(color)) {
                                        return <div key={index} className='color-item disable' style={{color : color}}>x</div>
                                    } else {
                                        return <div onClick={(e) => handleOptionColor(e)} key={index} className='color-item' style={{backgroundColor : color}}></div>
                                    }
                                } else return <div onClick={(e) => handleOptionColor(e)} key={index} className='color-item' style={{backgroundColor : color}}></div>
                                
                            })}
                            <i className='bx bx-x btn-clean' onClick={(e) => {setLoad(!load); e.target.style.display = 'none'; setCurrentProduct(null)}} style={{cursor: 'pointer',fontSize :'21px', color : '#999', display : 'none'}}></i>
                        </div>
                    </div>
                    <div className='col-lg-12 quantity'>
                        <i onClick={() => handleAdjustAmount('-')} style={{cursor : 'pointer'}} className="fa-solid fa-minus"></i>
                        <p>{quantity}</p>
                        <i onClick={() => handleAdjustAmount('+')} style={{cursor : 'pointer'}} className="fa-solid fa-plus"></i>
                    </div>
                </>: <>
                    <div className='col-lg-10 colors'>
                        <p className='title-amount title col-lg-12' style={{fontSize : '18px', lineHeight : '25px'}}>The Remaining Amount: 0</p>
                    </div>
                    <div className='col-lg-10 colors'>
                        <p className='title-amount title col-lg-12' style={{fontSize : '18px', lineHeight : '25px', fontWeight : 'bold'}}>SOLD OUT !!!</p>
                    </div>
                </>}
                <div className='col-lg-12 buttons'>
                    <div className='item-to-cart'>
                        <img height={"30px"} src={listImage[0]} />
                    </div>
                    {product.sizes ? <>
                        {(currentProduct != null) ? 
                            <button onClick={() => {
                                if (checkQuantity()) {
                                    handleAddToCart()
                                }
                            }} className='btn-add'><i className="fa-solid fa-cart-arrow-down"></i> Add To Cart</button> :
                            <button onClick={() => {checkAction()}} className='btn-add'><i className="fa-solid fa-cart-arrow-down"></i> Add To Cart</button>
                        }
                        {(currentProduct != null) ? 
                            <button onClick={() => {
                                if (checkQuantity()) {
                                    navigate(`/payment`);
                                    data.setPayload([
                                        {...product, color : currentProduct.color, size : currentProduct.size, price : currentProduct.price, quantity : quantity, quantityProduct : quantityProduct}
                                    ])
                                }
                            }} className='btn-buy'>Buy Now</button>:
                            <button onClick={() => checkAction()} className='btn-buy'>Buy Now</button>
                        }
                    </>:<>
                        <button onClick={() => NotifySoldOut()} className='btn-add'><i className="fa-solid fa-cart-arrow-down"></i> Add To Cart</button>
                        <button onClick={() => NotifySoldOut()} className='btn-buy'>Buy Now</button>
                    </>}
                </div>
            </div>
            <div className='col-lg-10 overview'>
                <h4 className='col-lg-12 title'>Overview</h4>
                <div className='col-lg-12 content'>
                {product.overview}
                </div>
            </div>
            <div className='col-lg-10 overview'>
                <h4 className='col-lg-12 title'>FeedBack</h4>
                <div className='col-lg-12 feedbacks' style={{marginTop : '35px'}}>
                    {feedbacks.length > 0 ? feedbacks.map((feedback, index) => {
                        if (feedback.product.id == product.id) {
                            return (
                                <div className='feedback-item' key={index}>
                                    <div className='avatar'>
                                        <img src={feedback.user.avatar} width={"100%"}  />
                                    </div>
                                    <div className='message'>
                                        <span style={{lineHeight : '0', fontSize : '16px', fontWeight : 'bold'}}>{feedback.user.name} <span style={{fontWeight : 500, fontSize : '14px', marginLeft : '5px'}}>{handleFormatDate(new Date(feedback.datetime))}</span></span>
                                        {feedback.content}
                                    </div>
                                    {user?.admin == false ? user?.id == feedback.user?.id ? <i onClick={() => handleRemoveMessage(feedback.id)} style={{fontSize : '25px', cursor : 'pointer'}} className='bx bx-x'></i> : <></> : <i onClick={() => handleRemoveMessage(feedback.id)} style={{fontSize : '25px', cursor : 'pointer'}} className='bx bx-x'></i>}
                                </div>
                            )
                        }
                    }) : <></>}
                </div>
                {user ? <div className='col-lg-12 feedback-user'>   
                    <div className='avatar'>
                        <img src={user.avatar} width={"100%"}  />
                    </div>
                    <input type="text" className="form-control user-message" placeholder='Your Message'/>
                    <button onClick={() => handleSentMessage()} type="button" className="btn btn-success">Send</button>
                </div> : <></>}
            </div> 
            {listRecomment.length > 0 ? <ListShoe products={listRecomment}/> : <></>}
        </div>
    );
}

export default ShoesDetail;
