import './homepage.scss'
import Banner from './banner.png'
import Sneaker from './sneaker.png'
import Sandal from './sandal.jpg'
import Custom from './custom.jpg'
import Accessories from './accessories.jpg'
import PSneaker from './p-sneaker.jpg'
import PSandal from './p-sandal.jpg'
import PCustom from './p-custom.jpg'
import PAcc from './p-acc.jpg'

function HomePage() {
    return (
        <div id='homepage'>
            <div className='banner'>
                <img width='100%' src={Banner} />
                <button>Let's Go</button>
            </div>
            <div className='shop-new-arrivals col-lg-12'>
                <h3 className='col-lg-12'>SHOP NEW ARRIVALS</h3>
                <div className='arrivals col-lg-12'>
                    <div className='item'>
                        <img src={Sneaker} width='100%'/>
                        <div className='wrapper'></div>
                        <button>Sneaker</button>
                    </div>
                    <div className='item'>
                        <img src={Sandal} width='100%'/>
                        <div className='wrapper'></div>
                        <button>Sandal</button>
                    </div>
                    <div className='item'>
                        <img src={Custom} width='100%'/>
                        <div className='wrapper'></div>
                        <button>Custom</button>
                    </div>
                    <div className='item'>
                        <img src={Accessories} width='100%'/>
                        <div className='wrapper'></div>
                        <button>Accessories</button>
                    </div>
                </div>
            </div>
            <div className='list-product col-lg-12'>
                <div className='item col-lg-5'>
                    <img width='100%' src={PSneaker} />
                    <h2>SNEAKER BACK TO SCHOOL</h2>
                    <button>SHOP NOW</button>
                </div>
                <div className='item col-lg-5'>
                    <img width='100%' src={PSandal} />
                    <h2>SANDAL STYLES</h2>
                    <button>SHOP NOW</button>
                </div>
                <div className='item col-lg-5'>
                    <img width='100%' src={PCustom} />
                    <h2>CUSTOM TO YOUR STYLE</h2>
                    <button>SHOP NOW</button>
                </div>
                <div className='item col-lg-5'>
                    <img width='100%' src={PAcc} />
                    <h2>SUPPORT FOR YOUR SHOES</h2>
                    <button>SHOP NOW</button>
                </div>

            </div>

        </div>
    );
}

export default HomePage;