import { useEffect, useState } from 'react'
import './listshoe.scss'
import { Link } from 'react-router-dom'

function ListShoe({products}) {

    const [list_products, setProducts] = useState([])

    useEffect(() => {
        setProducts(products)
    }, [products])


    let i = 0
    let length = document.querySelectorAll('.shoes .item').length
    const shoes = document.querySelector('.shoes')
    const handlePrev = () => {
        let width = document.querySelector('.shoes .item').offsetWidth
        if (i == 0) {
            i = length - 7
            shoes.style.transform = `translateX(${width * -i - 20}px)`
        } else {
            i = i - 1
            shoes.style.transform = `translateX(${width * -i}px)`
        }
    }
    const handleNext = () => {
        let width = document.querySelector('.shoes .item').offsetWidth
        if (i == length - 7) {
            i = 0
            shoes.style.transform = `translateX(${0}px)`
        } else {
            i = i + 1
            shoes.style.transform = `translateX(${width * -i - 14}px)`
        }
    }


    return (
        <div className='col-lg-12' style={{display : 'flex', flexDirection : 'column' , alignItems : 'center'}}>
            <h5 className='title col-lg-11'>MAY WE ALSO SUGGEST</h5>
            <div className='wrapper col-lg-12'>
                <div className='btn-prev btn-action' onClick={() => handlePrev()}><i className='bx bx-chevron-left'></i></div>
                <div className='btn-next btn-action' onClick={() => handleNext()}><i className='bx bx-chevron-right' ></i></div>
                <div className='col-lg-11 list-shoe'>
                    <div className='shoes'>
                        {list_products.map((p, index) => {
                            return (
                                <Link style={{textDecoration : 'none', color : 'black'}} to={`/categories/${p.category.toLowerCase().split(' ').join('-')}s/${p.brand.brandName.toLowerCase().split(' ').join('-')}/${p.name.toLowerCase().split(' ').join('-')}`}>
                                    <div key={index} className='item'>
                                        <div className='image'>
                                            <img width='85%' src={p.images[0].image}/>
                                        </div>
                                        <div className='col-lg-12 name'>{p.name}</div>
                                        <div className='col-lg-12 price'>{p.price ? '$ ' + p.price : 'Sold Out'}</div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListShoe;