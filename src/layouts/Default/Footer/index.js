
import './footer.scss'
import Logo from './logo-white.png'

function Footer() {
    return (
        <div id='footer' className='col-lg-12'>
            <div className='menu col-lg-12'>
                <div className='item col-lg-2'>
                    <h4>Sneaker</h4>
                    <p>Converse</p>
                    <p>Vans</p>
                    <p>Jordan</p>
                    <p>Nike</p>
                </div>
                <div className='item col-lg-2'>
                    <h4>Sandal</h4>
                    <p>Birkenstock</p>
                    <p>Teva</p>
                    <p>Keen</p>
                    <p>Chaco</p>
                </div>
                <div className='item col-lg-2'>
                    <h4>Accessories</h4>
                    <p>Birkenstock</p>
                    <p>Teva</p>
                    <p>Keen</p>
                    <p>Chaco</p>
                </div>
                <div className='item col-lg-2'>
                    <h4>Contact</h4>
                    <p>Email: shoeshop@gmail.com</p>
                    <p>Address: 1588 South Coast Drive Costa Mesa, CA 92626</p>
                    <p>Hour: (Mon - Fri) 6am - 4pm PST (Sat - Sun) 6:30am - 3pm PST</p>
                </div>
            </div>
            <div className='logo col-lg-8'>
                <div className='brand'>
                    <img src={Logo} width='150px' />
                    <p>© Shoes Store, A VF Company</p>
                </div>
                <div className='social'>
                    <i className="fa-brands fa-facebook-f"></i>
                    <i className="fa-brands fa-twitter"></i>
                    <i className="fa-brands fa-youtube"></i>
                    <i className="fa-brands fa-pinterest"></i>
                    <i className="fa-brands fa-instagram"></i>
                </div>
            </div>
        </div>
    );
}

export default Footer;