
import { useContext, useEffect, useState } from 'react'
import'./header.scss'
import Logo from './logo.png'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Notification from '../../../components/Notification'
import { Context } from '../../../components/UseContext/ThemeContext';

function Header({user, products}) {
    const [isLoad, setIsLoad] = useContext(Context)
    const [show, setShow] = useState(false);
    const [nof, setNof] = useState({status : 'none', message : 'none'})
    const [listMenu, setListMenu] = useState(null)

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
            setShow(true)
        } else {
            opa.style.display = 'none'
            modalSign.style.top = '-50%'
            wrapper.style.marginLeft = num+'px'
            setShow(false)
        }
    }

    const handleChangeSign = (num) => {
        const wrapper = document.querySelector('.wrapper-sign');
        wrapper.style.marginLeft = num+'px'
    }

    const handleSignUp = () => {
        const username = document.querySelector('.username-signup').value
        const password = document.querySelector('.password-signup').value
        const confirmPassword = document.querySelector('.confirm-password-signup').value
        if (!password == confirmPassword) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : "Password don't match Confirm Password"})}, 50);
            return
        }    
        if (!/^[a-z][a-z0-9]{5,20}$/.test(username)) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : "Username must be between 6 and 20 characters, using only numbers and letters"})}, 50);
            return
        } 
        if (!/^[a-zA-Z0-9][a-zA-Z0-9]{5,20}$/.test(password)) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : "Password must be between 6 and 20 characters"})}, 50);
            return
        }
        axios.post('/account/sign-up',{username : username, password : password, admin : false}, {headers: {'Content-Type': 'application/json'}})
            .then(res => {
                if (res.data == true){
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'success', message : 'Account Successfully Created'})}, 50);
                    document.querySelector('.username-signup').value = ''
                    document.querySelector('.password-signup').value = ''
                    document.querySelector('.confirm-password-signup').value = ''
                    handleChangeSign(0)
                } else {
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'fail', message : 'Username is already taken'})}, 50);
                }
            })
    }

    const handleSignIn = () => {
        const username = document.querySelector('.username-signin').value
        const password = document.querySelector('.password-signin').value
        axios.post('/account/sign-in',{username : username, password : password}, {headers: {'Content-Type': 'application/json'}})
            .then(res => {
                if (res.data) {
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'success', message : 'Sign In Successfully'})}, 50);
                    localStorage.setItem('token', res.data.re.body.token)
                    localStorage.setItem('username', res.data.user.username)
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000)
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

    return (
        <div id='header' className='col-lg-12'>
            <Notification status={nof.status} message={nof.message}/>
            <div className='menu-logo col-lg-7'>
                <Link style={{height : "100%"}} to="/"><img style={{cursor : 'pointer'}} src={Logo} height='100%' /></Link>
                <div className='menu'>
                    <div className='menu-item' onMouseOver={() => handleMouseOver(1, listMenu.sneakers.length)} onMouseOut={() => handleMouseOut(1)}>SNEAKER
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
                    <div className='menu-item' onMouseOver={() => handleMouseOver(2, listMenu.sandals.length)} onMouseOut={() => handleMouseOut(2)}>SANDAL
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
                    <div className='menu-item' onMouseOver={() => handleMouseOver(3, listMenu.customs.length)} onMouseOut={() => handleMouseOut(3)}>CUSTOM
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
                    <div className='menu-item' onMouseOver={() => handleMouseOver(4, listMenu.accessories.length)} onMouseOut={() => handleMouseOut(4)}>ACCESSORIES
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
                {user != null ? <div className='cart'>
                    <i className='bx bx-cart-alt icon-cart'></i>
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
                        <p className='forgot'>Forgot Password?</p>
                        <p className='have'>Don't have an account? <span onClick={() => handleChangeSign(-450)} style={{cursor:'pointer',fontWeight : 'bold', fontFamily: 'Roboto Condensed'}}>Sign Up</span></p>  
                    </div>
                    <div className='sign-in'>
                        <h5 className='title'>HELLO! WELCOME TO THE FAMILY.</h5>
                        <p className='description'>Help us get to know you better. You know, because family stays close.</p>
                        <div className='form-group'>
                            <label>Username *</label>
                            <input type='text' className='username-signup'/>
                        </div>
                        <div className='form-group'>
                            <label>Password *</label>
                            <input type='password' className='password-signup'/>
                        </div>
                        <div className='form-group'>
                            <label>Confirm Password *</label>
                            <input type='password' className='confirm-password-signup'/>
                        </div>
                        <button onClick={() => handleSignUp()} className='btn-signin btn-action'>SIGN UP</button>
                        <p style={{marginTop : '5px'}} className='have'>Have an account? <span onClick={() => handleChangeSign(0)} style={{cursor:'pointer',fontWeight : 'bold', fontFamily: 'Roboto Condensed'}}>Sign In</span></p>  
                    </div>
                </div>
            </div>
            <div className='opa' onClick={() => handleShowModal()}></div>
        </div>
    );
}

export default Header;