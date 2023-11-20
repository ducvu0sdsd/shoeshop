
import { useContext, useEffect, useState } from 'react'
import'./header.scss'
import Logo from './logo.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Notification from '../../../components/Notification'
import { Context } from '../../../components/UseContext/ThemeContext';

function Header({user, products}) {
    const [isLoad, setIsLoad, customer_name, data] = useContext(Context)
    const [show, setShow] = useState(false);
    const [nof, setNof] = useState({status : 'none', message : 'none'})
    const [listMenu, setListMenu] = useState(null)
    const [carts, setCarts] =useState([])
    const navigate = useNavigate()
    const [code, setCode] = useState(null)

    useEffect(() => {
        let l1 = []
        let l2 = []
        let sneakers = []
        let sandals = []
        let accessories = []
        let customs = []
        products.forEach(p => {
            if (!l1.includes(p.brand.brandName+"_"+p.category)) {
                l1.push(p.brand.brandName+"_"+p.category)
                l2.push({brand : p.brand.brandName, category : p.category, image : p.brand.logo})
            }
        })
        l2.forEach(item => {
            if (item.category == 'Sneaker') sneakers.push({brand : item.brand, image : item.image})
            else if (item.category == 'Sandal') sandals.push({brand : item.brand, image : item.image})
            else if (item.category == 'Custom') customs.push({brand : item.brand, image : item.image})
            else if (item.category == 'Accessories') accessories.push({brand : item.brand, image : item.image})
        })
        setListMenu({sneakers : sneakers, sandals : sandals, customs : customs, accessories : accessories})
    }, [products])

    const handleMouseOver = (num, length) => {
        const area = document.querySelector('.sub-menu-area-'+num)
        area.style.height = (37 * length) + 'px'
    } 
    const handleMouseOut = (num) => {
        const area = document.querySelector('.sub-menu-area-'+num)
        area.style.height = '0px'
    } 

    const handleHover = () => {
        document.querySelector('.option-area').style.height = '180px'
    }
    
    const handleOut = () => {
        document.querySelector('.option-area').style.height = '0px'
    }

    const handleShowModal = (num) => {
        const modalSign = document.querySelector('#modal-sign');
        const opa = document.querySelector('.opa');
        const wrapper = document.querySelector('.wrapper-sign');
        if (show == false) {
            opa.style.display = 'block'
            modalSign.style.top = '50%'
            wrapper.style.marginLeft = num+'px'
            handleChangeSign(num)
            setShow(true)
        } else {
            opa.style.display = 'none'
            modalSign.style.top = '-50%'
            wrapper.style.marginLeft = num+'px'
            handleChangeSign(num)
            setShow(false)
        }
    }

    useEffect(() => {
        setCarts(data.carts)
    }, [data])

    const handleChangeSign = (num) => {
        const wrapper = document.querySelector('.wrapper-sign');
        const model = document.querySelector('#modal-sign')
        wrapper.style.marginLeft = num+'px'
        if (num == -450) {
            model.style.width = '900px'
            model.style.height = '570px'
        } else {
            model.style.width = '450px'
            model.style.height = '450px'
        }
    }

    const cleanInputSignUp = () => {
        document.querySelector('.username-signup').value = ''
        document.querySelector('.password-signup').value = ''
        document.querySelector('.name-signup').value = ''
        document.querySelector('.email-signup').value = ''
        document.querySelector('.phone-signup').value = ''
        document.querySelector('.address-signup').value = ''
        document.querySelector('.confirm-signup').value = ''
        document.querySelector('.date-signup').value = ''
        document.querySelector('.avatar-signup').value = ''
        document.querySelector('.gender-signup').value = "None"
    }

    const handleCheckInput = () => {
        const username = document.querySelector('.username-signup').value
        const password = document.querySelector('.password-signup').value
        const name = document.querySelector('.name-signup').value
        const email = document.querySelector('.email-signup').value
        const phone = document.querySelector('.phone-signup').value
        const address = document.querySelector('.address-signup').value
        const confirmPassword = document.querySelector('.confirm-signup').value
        const date = document.querySelector('.date-signup').value
        const gender = document.querySelector('.gender-signup').value
        
        if (!/^[a-z][a-z0-9]{5,20}$/.test(username)) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : "Username must be between 6 and 20 characters, using only numbers and letters"})}, 50);
            return false;
        } 
        if (!/^([A-Z][a-z]{1,}( [A-Z][a-z]{1,}){0,})$/.test(name)) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : "The name must have the first letter capitalized and only use letters"})}, 50);
            return false;
        } 
        if (!/@(gmail.com|yahoo.vn)$/.test(email)) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : "The email invalid"})}, 50);
            return false;
        } 
        if (!/[0-9]{10}/.test(phone)) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : "Phone Number must be in the format like '0902491471'"})}, 50);
            return false;
        } 
        if (address == '') {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : "The address cannot be empty"})}, 50);
            return false;
        } 
        if (date == '') {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : "Please Choose Date"})}, 50);
            return false;
        } 
        if (gender == 'None') {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : "Please Choose Gender"})}, 50);
            return false;
        } 
        if (!/.{6,}/.test(password)) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : "The Password must be at least 6 characters"})}, 50);
            return false;
        } 
        if (password != confirmPassword) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : "Password and confirmation password do not match"})}, 50);
            return false;
        } 
        return true;
    }

    const handleSignUp = () => {
        const username = document.querySelector('.username-signup').value
        const password = document.querySelector('.password-signup').value
        const name = document.querySelector('.name-signup').value
        const email = document.querySelector('.email-signup').value
        const phone = document.querySelector('.phone-signup').value
        const address = document.querySelector('.address-signup').value
        const date = document.querySelector('.date-signup').value
        const gender = document.querySelector('.gender-signup').value
        let image = ''
        if (document.querySelector('.avatar-signup').files[0]) {
            let render = new FileReader()
            render.onload = (e) => {
                image = e.target.result
                axios.post('/accounts/sign-up',{username : username, password : password,name : name, email : email, phone : phone, address : address, date : date, gender : gender ,avatar : image,admin : false}, {headers: {'Content-Type': 'application/json'}})
                    .then(res => {
                        handleCleanVerify()
                        if (res.data == 200){
                            axios.post('/emails/notice-of-successful-account-creation', 
                            {
                                toEmail : email,
                                username : username,
                                name : name,
                                phone : phone,
                                address : address,
                            }
                            ,{headers: {'Content-Type': 'application/json'}})
                            setNof({status : 'none', message : ""})
                            setTimeout(() => {setNof({status : 'success', message : 'Account Successfully Created'})}, 50);
                            handleChangeSign(0)
                            cleanInputSignUp()
                        } else {
                            setNof({status : 'none', message : ""})
                            setTimeout(() => {setNof({status : 'fail', message : 'Username or Email is already taken'})}, 50);
                        }
                    })
            }
            render.readAsDataURL(document.querySelector('.avatar-signup').files[0])
        } else {
            axios.post('/accounts/sign-up',{username : username, password : password,name : name, email : email, phone : phone, address : address, date : date, gender : gender ,avatar : image,admin : false}, {headers: {'Content-Type': 'application/json'}})
                .then(res => {
                    handleCleanVerify()
                    if (res.data == 200){
                        axios.post('/emails/notice-of-successful-account-creation', 
                            {
                                toEmail : email,
                                username : username,
                                name : name,
                                phone : phone,
                                address : address,
                            }
                            ,{headers: {'Content-Type': 'application/json'}})
                        setNof({status : 'none', message : ""})
                        setTimeout(() => {setNof({status : 'success', message : 'Account Successfully Created'})}, 50);
                        handleChangeSign(0)
                        cleanInputSignUp()
                    } else {
                        setNof({status : 'none', message : ""})
                        setTimeout(() => {setNof({status : 'fail', message : 'Username or Email is already taken'})}, 50);
                    }
                })
        }
    }

    const handleSignIn = () => {
        const username = document.querySelector('.username-signin').value
        const password = document.querySelector('.password-signin').value
        axios.post('/accounts/sign-in',{username : username, password : password}, {headers: {'Content-Type': 'application/json'}})
            .then(res => {
                if (res.data) {
                    if (res.data.status == 200) {
                        setNof({status : 'none', message : ""})
                        setTimeout(() => {setNof({status : 'success', message : 'Sign In Successfully'})}, 50);
                        localStorage.setItem('token', res.data.responseData.re.body.token)
                        localStorage.setItem('username', res.data.responseData.user.username)
                        navigate('/')
                        setTimeout(() => {
                            window.location.reload()
                        }, 2000)
                    } else {
                        setNof({status : 'none', message : ""})
                        setTimeout(() => {setNof({status : 'fail', message : 'Login information is incorrect'})}, 50);
                    }
                } else {
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'fail', message : 'Login information is incorrect'})}, 50);
                }
            })
    }

    const handleSignOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        window.location.reload()
    }

    const handleMouseOverCarts= () => {
        const area = document.querySelector('.carts-area') 
        if (area) {
            area.style.height = '400px'
            area.style.paddingTop = "10px"
        }
    }

    const handleMouseOutCarts= () => {
        const area = document.querySelector('.carts-area') 
        if (area) {
            area.style.height = '0px'
            area.style.paddingTop = "10px"
        }
    }
    
    const handlePayment = () => {
        let l = []
        carts.forEach(item => {
            l.push({
                ...item.product,images : [{image : item.image}] ,color : item.colorsize.color, size : item.colorsize.size, price : item.colorsize.price, quantity : item.quantity, quantityProduct : item.colorsize.quantity
            })
        })
        navigate(`/payment/cart`);
        data.setPayload(l)
    }

    const handleCleanVerify = () => {
        document.querySelector('.verify-0').value = ''
        document.querySelector('.verify-1').value = ''
        document.querySelector('.verify-2').value = ''
        document.querySelector('.verify-3').value = ''
        document.querySelector('.verify-0').focus()
    }

    const handleValidateVerify = (e, num) => {
        if (!/^[0-9]{1}/.test(e.target.value)) {
            e.target.value = ''
        } else {
            if (num == 3) {
                let inputcode = document.querySelector('.verify-0').value + document.querySelector('.verify-1').value + document.querySelector('.verify-2').value + document.querySelector('.verify-3').value + ""
                if (inputcode == code) {
                    handleSignUp()
                } else {
                    handleCleanVerify()
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'fail', message : 'Verification Code Is Incorrect'})}, 50);
                }
            }
        }
        if (num < 3) {
            document.querySelector('.verify-'+(num+1)).focus()
        }
    }

    const handleValidateInputSignUp = () => {
        if (!handleCheckInput()) return
        const email = document.querySelector('.email-signup').value
        axios.post('/emails/verify-email', {toEmail : email},  {headers: {'Content-Type': 'application/json'}})
            .then(res => {
                setCode(res.data)
                handleCleanVerify()
                handleChangeSign(-1350)
            })
    }
    
    return (
        <div id='header' className='col-lg-12'>
            <Notification status={nof.status} message={nof.message}/>
            <div className='menu-logo col-lg-7'>
                <Link style={{height : "100%"}} to="/"><img style={{cursor : 'pointer'}} src={Logo} height='100%' /></Link>
                <div className='menu'>
                    <div className='menu-item' onMouseOver={() => handleMouseOver(1, listMenu.sneakers.length)} onMouseOut={() => handleMouseOut(1)}><Link className='link' to={'/categories/sneakers/all'}> SNEAKER</Link>
                        <div className='sub-menu-area-1 sub-menu-area'>
                            {listMenu ? listMenu.sneakers.map((item, index) => (
                                <Link onClick={() => setIsLoad(!isLoad)} className='link' key={index} to={`/categories/sneakers/${item.brand.toLowerCase().split(' ').join('-')}`}>
                                    <div className='sub-menu-item'>
                                        <img width='100%' src={item.image} />
                                        {item.brand}
                                    </div>
                                </Link>
                            )) : <></>}
                        </div>
                    </div>
                    <div className='menu-item' onMouseOver={() => handleMouseOver(2, listMenu.sandals.length)} onMouseOut={() => handleMouseOut(2)}><Link className='link' to={'/categories/sandals/all'}> SANDAL</Link>
                        <div className='sub-menu-area-2 sub-menu-area'>
                            {listMenu ? listMenu.sandals.map((item, index) => (
                                <Link onClick={() => setIsLoad(!isLoad)} className='link' key={index} to={`/categories/sandals/${item.brand.toLowerCase().split(' ').join('-')}`}>
                                    <div key={index} className='sub-menu-item'>
                                        <img width='100%' src={item.image} />
                                        {item.brand}
                                    </div>
                                </Link>
                            )) : <></>}
                        </div>
                    </div>
                    <div className='menu-item' onMouseOver={() => handleMouseOver(3, listMenu.customs.length)} onMouseOut={() => handleMouseOut(3)}><Link className='link' to={'/categories/customs/all'}> CUSTOM</Link>
                        <div className='sub-menu-area-3 sub-menu-area'>
                            {listMenu ? listMenu.customs.map((item, index) => (
                                <Link onClick={() => setIsLoad(!isLoad)} className='link' key={index} to={`/categories/customs/${item.brand.toLowerCase().split(' ').join('-')}`}>
                                    <div key={index} className='sub-menu-item'>
                                        <img width='100%' src={item.image} />
                                        {item.brand}
                                    </div>
                                </Link>
                            )) : <></>}
                        </div>
                    </div>
                    <div className='menu-item' onMouseOver={() => handleMouseOver(4, listMenu.accessories.length)} onMouseOut={() => handleMouseOut(4)}><Link className='link' to={'/categories/accessories/all'}> ACCESSORIES</Link>
                        <div className='sub-menu-area-4 sub-menu-area'>
                            {listMenu ? listMenu.accessories.map((item, index) => (
                                <Link onClick={() => setIsLoad(!isLoad)} className='link' key={index} to={`/categories/accessories/${item.brand.toLowerCase().split(' ').join('-')}`}>
                                    <div key={index} className='sub-menu-item'>
                                        <img width='100%' src={item.image} />
                                        {item.brand}
                                    </div>
                                </Link>
                            )) : <></>}
                        </div>
                    </div>

                    {user ? user.admin ? <div className='menu-item' onMouseOver={() => handleMouseOver(5,6)} onMouseOut={() => handleMouseOut(5)}><Link className='link' to='/account/products-management'>MANAGEMENT</Link>
                        <div className='sub-menu-area-5 sub-menu-area'>
                            <div className='sub-menu-item'>
                                <Link className='link' to='/account/shoes-management'>
                                    <img width='100%' src='https://png.pngtree.com/png-vector/20220519/ourmid/pngtree-suppliers-and-producers-turquoise-concept-icon-icon-commerce-outline-vector-png-image_46227168.jpg' />
                                    Products Management
                                </Link>
                            </div>
                            <div className='sub-menu-item'>
                                <Link className='link' to='/account/brands-management'>
                                    <img width='100%' src='https://png.pngtree.com/png-vector/20220520/ourmid/pngtree-appropriate-blue-gradient-concept-icon-png-image_4656045.png' />
                                    Brands Management
                                </Link>
                            </div>
                            <div className='sub-menu-item'>
                                <Link className='link' to='/account/suppliers-management'>
                                    <img width='100%' src='https://media.istockphoto.com/id/1300163315/vector/suppliers-concept-icon.jpg?s=612x612&w=0&k=20&c=J2vzWiErDYlSRWOlQfteWK-vQTr0SBCTIzxcJRRh30U=' />
                                    Suppliers Management
                                </Link>
                            </div>
                            <div className='sub-menu-item'>
                                <Link className='link' to='/account/clients-management'>
                                    <img width='100%' src='https://static.vecteezy.com/system/resources/previews/026/144/007/non_2x/agro-export-and-import-issues-blue-gradient-concept-icon-international-trade-problem-food-delivery-issues-abstract-idea-thin-line-illustration-isolated-outline-drawing-vector.jpg' />
                                    Clients Management
                                </Link>
                            </div>
                            <div className='sub-menu-item'>
                                <Link className='link' to='/account/import-product-management'>
                                    <img width='100%' src='https://static.vecteezy.com/system/resources/previews/026/144/007/non_2x/agro-export-and-import-issues-blue-gradient-concept-icon-international-trade-problem-food-delivery-issues-abstract-idea-thin-line-illustration-isolated-outline-drawing-vector.jpg' />
                                    Import Products
                                </Link>
                            </div>
                            <div className='sub-menu-item'>
                                <Link className='link' to='/account/sales-management'>
                                    <img width='100%' src='https://static.vecteezy.com/system/resources/previews/026/144/007/non_2x/agro-export-and-import-issues-blue-gradient-concept-icon-international-trade-problem-food-delivery-issues-abstract-idea-thin-line-illustration-isolated-outline-drawing-vector.jpg' />
                                    Orders Statistics
                                </Link>
                            </div>
                        </div>
                    </div> : '' : ''}
                    
                    <div className='menu-item' onClick={() => {window.scrollTo(
                0,  document.documentElement.scrollHeight)}}>CONTACT</div>
                </div>
            </div>
            <div className='user-search col-lg-4'>
                <div className='search'>
                    <input type='text' placeholder='Search...'/>
                    <i className="fa-solid fa-magnifying-glass icon-search"></i>
                </div>
                {user != null ? <div className='cart' onMouseOut={() => {handleMouseOutCarts()}} onMouseOver={() => {handleMouseOverCarts()}}>
                    {carts.length != 0 ? <>
                        <div className='number-of-cart'>{carts.length}</div>
                        <div className='carts-area'>
                            <div className='products-area'>
                                {carts.length != 0 ? carts.map((cart, index) => {
                                    return (
                                        <div key={index} className='item'>
                                            <img style={{marginRight : '10px'}} width={'60px'} src={cart.image} />
                                            <div style={{padding : '5px 0'}}>
                                            <div style={{ textAlign: "start", display: 'flex', alignItems : 'center' }}>
                                                <div style={{maxWidth : '135px',whiteSpace: 'nowrap' ,overflow : 'hidden'}}>{cart.product.name}</div> - {cart.colorsize.size} - <div style={{ height: '17px', width: '17px', backgroundColor: cart.colorsize.color, borderRadius: '50%', margin: '0 5px' }}></div>
                                            </div>
                                                <div style={{ textAlign : 'start'}}>
                                                    {cart.quantity} x {cart.colorsize.price} $
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : <></>}
                            </div>
                            <div className='total'><span style={{color : '#BABABA', margin : '0 10px'}}>Total : </span> {carts.reduce((total, current) => {return total + current.colorsize.price * current.quantity}, 0)} $</div>
                            <Link title='cart' className='link' to={'/cart'}><button style={{backgroundColor : 'black'}}>View Cart</button></Link>
                            <button onClick={() => {
                                handlePayment()
                            }} style={{backgroundColor : 'rgb(205, 97, 85)'}}>Pay Immediately</button>
                        </div>
                    </>: <></>}
                    <Link title='cart' className='link' to={'/cart'}><i className='bx bx-cart-alt icon-cart'></i></Link> 
                </div> : <></>}
                <div className='other'>
                    {user != null ? 
                        <div className='user' onMouseOver={() => {handleHover()}} onMouseOut={() => {handleOut()}}>
                            <img className='user-logo' style={{cursor: 'pointer'}} src={user.avatar} width='100%' />
                            <div className='option-area'>
                                <div className='logo'>
                                    <img src={user.avatar} width='100%' />
                                </div>
                                <p className='name'>{user.name}</p>
                                <div className='options col-lg-12'>
                                    <Link style={{textDecoration : 'none', color : 'black'}} to='/account/general'><button className='option'>Edit</button></Link>
                                    <button onClick={() => handleSignOut()} className='option' style={{backgroundColor : 'black', color : 'white'}}>Sign out</button>
                                </div>
                            </div>
                        </div> : <div className='signin-signup'>
                            <button onClick={() => handleShowModal(0)} >Sign in</button>
                            <button onClick={() => handleShowModal(-450)} style={{border : '1px solid #999'}}>Sign up</button>
                        </div>
                    }
                </div>
            </div>

            <div id='modal-sign'>
                <i style={{cursor : 'pointer'}} onClick={() => handleShowModal()} className='bx bx-x icon-close'></i>
                <div className='wrapper-sign'>
                    <div className='sign-in'>
                        <h5 className='title'>HELLO! WELCOME TO THE FAMILY.</h5>
                        <p className='description'>Help us get to know you better. You know, because family stays close.</p>
                        <div className='form-group'>
                            <label>Username *</label>
                            <input type='text' className='username-signin'/>
                        </div>
                        <div className='form-group'>
                            <label>Password *</label>
                            <input type='password' className='password-signin' />
                        </div>
                        <button className='btn-signin btn-action' onClick={() => handleSignIn()} >SIGN IN</button>
                        <Link onClick={() => handleShowModal()} style={{color : 'black'}} to={'/forgot-password-page'}><p className='forgot'>Forgot Password?</p></Link> 
                        <p className='have'>Don't have an account? <span onClick={() => handleChangeSign(-450)} style={{cursor:'pointer',fontWeight : 'bold', fontFamily: 'Roboto Condensed'}}>Sign Up</span></p>  
                    </div>
                    <div className='sign-up'>
                        <h5 className='title'>HELLO! WELCOME TO THE FAMILY.</h5>
                        <p className='description'>Help us get to know you better. You know, because family stays close.</p>
                        <div className='inputs'>
                            <div className='form-group'>
                                <label>Username *</label>
                                <input type='text' className='username-signup'/>
                            </div>
                            <div className='form-group'>
                                <label>Date Of Birth *</label>
                                <input type='date' className='date-signup' />
                            </div>
                            <div className='form-group'>
                                <label>Name *</label>
                                <input type='text' className='name-signup'/>
                            </div>
                            <div className='form-group'>
                                <label>Gender *</label>
                                <select className='gender-signup'>
                                    <option>None</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                            <div className='form-group'>
                                <label>Email *</label>
                                <input type='text' className='email-signup' placeholder='@gmail.com'/>
                            </div>
                            <div className='form-group'>
                                <label>Password *</label>
                                <input type='password' className='password-signup'/>
                            </div>
                            <div className='form-group'>
                                <label>Phone Number *</label>
                                <input type='text' className='phone-signup'/>
                            </div>
                            <div className='form-group'>
                                <label>Confirm Password *</label>
                                <input type='password' className='confirm-signup'/>
                            </div>
                            <div className='form-group'>
                                <label>Address *</label>
                                <input type='text' className='address-signup'/>
                            </div>
                            <div className='form-group'>
                                <label>Avatar </label>
                                <input type='file' className='avatar-signup'/>
                            </div>
                        </div>
                        <button onClick={() => handleValidateInputSignUp()} className='btn-signin btn-action'>SIGN UP</button>
                        <p style={{marginTop : '5px', marginLeft : '27px'}} className='have'>Have an account? <span onClick={() => handleChangeSign(0)} style={{cursor:'pointer',fontWeight : 'bold', fontFamily: 'Roboto Condensed'}}>Sign In</span></p>  
                    </div>
                    <div className='verify'>
                        <p className='description'>We have sent the account verification code to your email address <span style={{color : 'blue'}}>{document.querySelector('.email-signup') ? document.querySelector('.email-signup').value : ''}</span></p>
                        <p className='description'>Please check your email and enter the verification code below</p>
                        <p className='verify-text'>Verify Code</p>
                        <div className='input-area'>
                            <input type='text' className={'verify-'+0} onChange={(e) => handleValidateVerify(e,0)} maxLength={1} />
                            <input type='text' className={'verify-'+1} onChange={(e) => handleValidateVerify(e,1)} maxLength={1} />
                            <input type='text' className={'verify-'+2} onChange={(e) => handleValidateVerify(e,2)} maxLength={1} />
                            <input type='text' className={'verify-'+3} onChange={(e) => handleValidateVerify(e,3)} maxLength={1} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='opa' onClick={() => handleShowModal()}></div>
        </div>
    );
}

export default Header;