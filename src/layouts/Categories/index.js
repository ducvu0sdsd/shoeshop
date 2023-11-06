
import { useContext, useEffect, useState } from 'react';
import './categories.scss'
import { Link } from 'react-router-dom';
import { Context } from '../../components/UseContext/ThemeContext';

function Categories({categoryName, brandName, products}) {

    const [reload, setReload] = useContext(Context)
    const [products1 , setProducts1] = useState([])
    const [list_products , setList_products] = useState([])
    const colors = ['rgb(205, 97, 85)','rgb(236, 112, 99)','rgb(175, 122, 197)','rgb(165, 105, 189)','rgb(84, 153, 199)','rgb(93, 173, 226)','rgb(72, 201, 176)','rgb(69, 179, 157)','rgb(82, 190, 128)','rgb(88, 214, 141)','rgb(244, 208, 63)','rgb(245, 176, 65)','rgb(235, 152, 78)','rgb(220, 118, 51)','rgb(240, 243, 244)','rgb(202, 207, 210)','rgb(170, 183, 184)','rgb(153, 163, 164)','rgb(93, 109, 126)','rgb(86, 101, 115)']
    const sizes = [36,37,38,39,40,41,42,43,44,45]

    useEffect(() => {
        const arr = document.querySelectorAll('.categories .active')
        arr.forEach(item => {
            item.classList.remove('active')
        })
        document.querySelector('.categories .txt-search').value = ''
    }, [reload])

    useEffect(() => {
        let l = []
        products.forEach(item => {
            if (item.category == categoryName && item.brand.brandName == brandName) {
                l.push(item)
            }
        })
        setProducts1(l)
    }, [reload])

    useEffect(() => {
        let l = []
        products1.forEach(item => {
            l.push(item)
        })
        setList_products(l)
    }, [products1])

    const areAllElementsInArray = (arr1, arr2) => {
        let i = 0
        arr2.forEach(item1 => {
            if (arr1.includes(item1)) i++;
        })
        if (i == arr2.length) return true;
        else return false;
    }

    const findMax = (arr) => {
        let i = 0
        arr.forEach(item => {
            let num = parseInt(item.replace('< ', '').replace('> ', ''))
            if (num > i) {
                i = num
            }
        })
        return i;
    }

    const handleFilterProducts = () => {
        let valueSearch = document.querySelector('.txt-search').value
        let sizes = document.querySelectorAll('.content-sizes .active')
        let prices = document.querySelectorAll('.content-prices .active')
        let colors = document.querySelectorAll('.content-colors .active')
        let list_sizes = []
        let list_prices = []
        let list_colors = []
        let isGetter = false;
        sizes.forEach(item => {list_sizes.push(item.textContent)})
        colors.forEach(item => {list_colors.push(item.style.backgroundColor)})
        prices.forEach(item => {list_prices.push(item.textContent.replace('$ ', ''))})
        if (valueSearch == '' && list_sizes.length == 0 && list_colors.length == 0 && list_prices.length == 0) {
            setList_products(products1)
            return;
        }
        if (list_prices.includes('>= 300')) isGetter = true
        let max = findMax(list_prices)
        let l0 = []
        products1.forEach(item => {
            if (item.name.toLowerCase().includes(valueSearch.toLowerCase())) {
                l0.push(item)
            }
        })
        let l1 = []
        l0.forEach(item => {
            if (item.sizes != null) {
                if (areAllElementsInArray(item.sizes, list_sizes)) {
                    l1.push(item)
                }
            } else {
                if (list_sizes.length == 0) {
                    l1.push(item)
                }
            }
        })
        let l2 = []
        l1.forEach(item => {
            if (item.colors != null) {
                if (areAllElementsInArray(item.colors, list_colors)) {
                    l2.push(item)
                }
            } else {
                if (list_colors.length == 0) {
                    l2.push(item)
                }
            }
        })
        let l3 = []
        if (max == 0 && isGetter == false) {
            l3 = l2
        } else {
            l2.forEach(item => {
                if (isGetter == false) {
                    if (item.price != null && item.price < max) {
                        l3.push(item)
                    } else {
                        if (list_prices.length == 0) {
                            l3.push(item)
                        }
                    }
                } else if (isGetter == true) {
                    if (item.price != null && item.price >= 300) {
                        l3.push(item)
                    } else {
                        if (list_prices.length == 0) {
                            l3.push(item)
                        }
                    }
                }
            })
        }
        setList_products(l3)
    }

    return (
        <div className='categories col-lg-12'>
            <div className='cohesive col-lg-12'>
                Home / Categories / {categoryName} / {brandName}
            </div>
            <h2 className='title col-lg-12'>
                {brandName}
            </h2>
            <p className='number-of-item'>
                {list_products.length} item
            </p>
            <div className='col-lg-12' style={{display:'flex', justifyContent : 'space-evenly', padding : '0 40px'}}>
                <div className='col-lg-3 option'>
                    <div className='item col-lg-12'>
                        <h6 className='col-lg-12' style={{fontWeight : 'bold'}}>Search</h6>
                        <input onChange={() => handleFilterProducts()} type="text" className="form-control txt-search" placeholder='Product Name' />
                    </div>
                    <div className='item col-lg-12'>
                        <h6 className='col-lg-12' style={{fontWeight : 'bold'}}>Sizes</h6>
                        <div className='content content-sizes col-lg-12'>
                            {sizes.map((size , index) => (
                                <div onClick={e => {
                                    !e.target.classList.contains('active') ? e.target.classList.add('active') : e.target.classList.remove('active');
                                    handleFilterProducts()
                                }} className='sizes' key={index}>{size}</div>
                            ))}
                        </div>
                    </div>
                    <div className='item col-lg-12'>
                        <h6 className='col-lg-12' style={{fontWeight : 'bold'}}>Colors</h6>
                        <div className='content content-colors col-lg-12'>
                            {colors.map((color, index) => (
                                <div onClick={e => {
                                    !e.target.classList.contains('active') ? e.target.classList.add('active') : e.target.classList.remove('active');
                                    handleFilterProducts()
                                }} className='color-item' key={index} style={{backgroundColor : color}}></div>
                            ))}
                        </div>
                    </div>
                    <div className='item col-lg-12'>
                        <h6 className='col-lg-12' style={{fontWeight : 'bold'}}>Price</h6>
                        <div className='content content-prices col-lg-12'>
                            <div onClick={e => {
                                    if (e.target.classList.contains('active')) e.target.classList.remove('active')
                                    else {document.querySelector('.content-prices .active') ? document.querySelector('.content-prices .active').classList.remove('active') : e.target.classList.add('active')
                                    e.target.classList.add('active')}
                                    handleFilterProducts()
                                }} className='price-item'>$ &lt; 30</div>
                            <div onClick={e => {
                                    if (e.target.classList.contains('active')) e.target.classList.remove('active')
                                    else {document.querySelector('.content-prices .active') ? document.querySelector('.content-prices .active').classList.remove('active') : e.target.classList.add('active')
                                    e.target.classList.add('active')}
                                    handleFilterProducts()
                                }} className='price-item'>$ &lt; 50</div>
                            <div onClick={e => {
                                    if (e.target.classList.contains('active')) e.target.classList.remove('active')
                                    else {document.querySelector('.content-prices .active') ? document.querySelector('.content-prices .active').classList.remove('active') : e.target.classList.add('active')
                                    e.target.classList.add('active')}
                                    handleFilterProducts()
                                }} className='price-item'>$ &lt; 100</div>
                            <div onClick={e => {
                                    if (e.target.classList.contains('active')) e.target.classList.remove('active')
                                    else {document.querySelector('.content-prices .active') ? document.querySelector('.content-prices .active').classList.remove('active') : e.target.classList.add('active')
                                    e.target.classList.add('active')}
                                    handleFilterProducts()
                                }} className='price-item'>$ &lt; 200</div>
                            <div onClick={e => {
                                    if (e.target.classList.contains('active')) e.target.classList.remove('active')
                                    else {document.querySelector('.content-prices .active') ? document.querySelector('.content-prices .active').classList.remove('active') : e.target.classList.add('active')
                                    e.target.classList.add('active')}
                                    handleFilterProducts()
                                }} className='price-item'>$ &lt; 300</div>
                            <div onClick={e => {
                                    if (e.target.classList.contains('active')) e.target.classList.remove('active')
                                    else {document.querySelector('.content-prices .active') ? document.querySelector('.content-prices .active').classList.remove('active') : e.target.classList.add('active')
                                    e.target.classList.add('active')}
                                    handleFilterProducts()
                                }} className='price-item'>$ &gt;= 300</div>
                        </div>
                    </div>
                </div>
                <div className='col-lg-9 list-item'>
                    {list_products.length != 0 ? list_products.map((product, index) => {
                        return (
                            <div key={index} className='item col-lg-12'>
                                <div className='image col-lg-12'>
                                    <Link style={{textDecoration : 'none', color : 'black'}} to={`/categories/${product.category.toLowerCase().split(' ').join('-')}s/${product.brand.brandName.toLowerCase().split(' ').join('-')}/${product.name.toLowerCase().split(' ').join('-')}`}><img src={product.images[0].image} width='100%' /></Link>
                                </div>
                                <div className='col-lg-12 title'>
                                    <Link style={{textDecoration : 'none', color : 'black'}} to={`/categories/${product.category.toLowerCase().split(' ').join('-')}s/${product.brand.brandName.toLowerCase().split(' ').join('-')}/${product.name.toLowerCase().split(' ').join('-')}`}>{product.name.toUpperCase()}</Link>
                                    <div className='cart'><i className='bx bx-cart-add'></i></div>
                                </div>
                                <div className='col-lg-12 color'>
                                    {product.colors ? 'Colors : ' : ''}
                                    <Link style={{textDecoration : 'none', color : 'black', display : 'flex', marginLeft: '5px'}} to={`/categories/${product.category.toLowerCase().split(' ').join('-')}s/${product.brand.brandName.toLowerCase().split(' ').join('-')}/${product.name.toLowerCase().split(' ').join('-')}`}>
                                        {product.colors ? product.colors.map((color, index) => {
                                            if (index <= 4) {
                                                return  <div key={index} className='color-item' style={{backgroundColor : color}}></div>
                                            }
                                        }) : <></>}
                                    </Link>
                                </div>
                                <div className='col-lg-12 price' style={{}}>
                                    {product.price ? '$' + product.price : 'Sold Out !!!'}
                                </div>
                            </div>
                        )
                    }) : <div className='noresult'>No Result !!!</div>}
                </div>
            </div>
        </div>
    );
}

export default Categories;