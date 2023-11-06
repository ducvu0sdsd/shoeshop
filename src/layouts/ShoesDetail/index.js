
import './shoesdetail.scss'
import { useEffect, useContext, useState } from 'react';
import { useRef } from 'react';
import ListShoe from './ListShoe';
import Notification from '../../components/Notification'
import { Context } from '../../components/UseContext/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';

function ShoesDetail({product, products, user}) {
    const [listImage, setListImage] = useState([])
    const [lsizes, setlSizes] = useState([])
    const [lcolors, setlColors] = useState([])
    const [sizes, setSizes] = useState([])
    const [colors, setColors] = useState([])
    const [list_size_color_quantity_price, setList_size_color_quantity_price] = useState([])
    const [load, setLoad] = useState(false)
    const [isLoad, setIsLoad] = useContext(Context)
    const [nof, setNof] = useState({status : 'none', message : 'none'})
    const [quantity, setQuantity] = useState(0)
    const [quantityProduct, setQuantityProduct] = useState(0)
    const [currentProduct, setCurrentProduct] = useState(null)
    const [listRecomment, setListRecomment] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        setListRecomment(products.filter((item) => {return item.id != product.id}))
    }, [products])

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
    },[load])
    const imageRef = useRef()

    const handleChangeImage = (num) => {
        document.querySelector('.shoes-detail .list').style.transform = `translateX(${imageRef.current.offsetWidth * num * -1}px)`
        document.querySelector('.shoes-detail .active').classList.remove('active')
        document.querySelector(`.shoes-detail .item${num}`).classList.add('active')
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

    return (
        <div className='shoes-detail col-lg-12'>
            {console.log(listRecomment)}
            <Notification status={nof.status} message={nof.message}/>
            <div className='images col-lg-4'>
                <div className='image col-lg-12' ref={imageRef}>
                    <div className='list'>  
                        {listImage.map((item, index) => (<div key={index} className='item col-lg-12'><img src={item} width='90%'/></div>))}
                    </div>
                </div>
                <div className='mini-images'>
                    {listImage.map((item, index) => (<div onClick={() => handleChangeImage(index)} key={index} className={index == 0 ? `item${index} item active` : `item item${index}`}>
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
                            <i className='bx bx-x btn-clean' onClick={(e) => {setLoad(!load); e.target.style.display = 'none'}} style={{cursor: 'pointer',fontSize :'21px', color : '#999', display : 'none'}}></i>
                        </div>
                    </div>
                    <div className='col-lg-10 colors'>
                        <p className='title col-lg-12' style={{fontSize : '18px', lineHeight : '25px'}}>Colors</p>
                        <div className='col-lg-12 list-colors'>
                            {colors.map((color, index) => {
                                if (lcolors.length != 0) {
                                    if (!lcolors.includes(color)) {
                                        return <div className='color-item disable' style={{color : color}}>x</div>
                                    } else {
                                        return <div onClick={(e) => handleOptionColor(e)} key={index} className='color-item' style={{backgroundColor : color}}></div>
                                    }
                                } else return <div onClick={(e) => handleOptionColor(e)} key={index} className='color-item' style={{backgroundColor : color}}></div>
                                
                            })}
                            <i className='bx bx-x btn-clean' onClick={(e) => {setLoad(!load); e.target.style.display = 'none'}} style={{cursor: 'pointer',fontSize :'21px', color : '#999', display : 'none'}}></i>
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
                    {product.sizes ? <>
                        <button className='btn-add'><i className="fa-solid fa-cart-arrow-down"></i> Add To Cart</button>
                        {(currentProduct != null) ? 
                            <button onClick={() => {
                                if (checkQuantity()) {
                                    navigate(`/payment/product-id/${product.id}/${currentProduct.color}/${currentProduct.size}/${currentProduct.price}/${quantity}`);
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
            {listRecomment.length > 0 ? <ListShoe products={listRecomment}/> : <></>}
        </div>
    );
}

export default ShoesDetail;