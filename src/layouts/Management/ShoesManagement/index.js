
import './productsManagement.scss'
import { useContext, useEffect, useState } from 'react';
import { Context } from '../../../components/UseContext/ThemeContext';
import Notification from '../../../components/Notification'
import axios from 'axios';

function ProductManagement({brands, products1, suppliers}) {

    const [products, setProducts] = useState()
    const [isLoad, setIsLoad] = useContext(Context)
    const [nof, setNof] = useState({status : 'none', message : 'none'})
    const colors = ['rgb(205, 97, 85)','rgb(236, 112, 99)','rgb(175, 122, 197)','rgb(165, 105, 189)','rgb(84, 153, 199)','rgb(93, 173, 226)','rgb(72, 201, 176)','rgb(69, 179, 157)','rgb(82, 190, 128)','rgb(88, 214, 141)','rgb(244, 208, 63)','rgb(245, 176, 65)','rgb(235, 152, 78)','rgb(220, 118, 51)','rgb(240, 243, 244)','rgb(202, 207, 210)','rgb(170, 183, 184)','rgb(153, 163, 164)','rgb(93, 109, 126)','rgb(86, 101, 115)']
    const sizes = [36,37,38,39,40,41,42,43,44,45]
    const [images, setImages] = useState([])
    const [list_size_color_quantity, setList_size_color_quantity] = useState([])

    useEffect(() => {
        setProducts(products1)
    }, [products1])
    const handleImportImage = (e) => {
        let l = []
        let length = images.length
        for (let i = 0; i<e.target.files.length; i++) {
            let reader = new FileReader();
            reader.onload = (e1) => {
                l.push({id : l.length + length , img : e1.target.result})
                if (l.length == e.target.files.length) {
                    setImages([...images, ...l])
                }
            };
            reader.readAsDataURL(e.target.files[i]);
        }
    }

    const handleRemoveImage = (index) => {
        const newArray = images.filter(item => item.id !== index);
        setImages(newArray)
    }

    const getData = () => {
        return new Promise((revolve,reject) => {
            let name = [document.querySelector('#product-management .txt-name').value]
            if (name[0] == ''){
                setNof({status : 'none', message : ""})
                setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Username'})}, 50);
                revolve(null)
            }
            let overview = [document.querySelector('#product-management .txt-overview').value.trim()]
            if (overview[0] == ''){
                setNof({status : 'none', message : ""})
                setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Overview'})}, 50);
                revolve(null)
            }
            let brand = [document.querySelector('#product-management .txt-brand')[document.querySelector('#product-management .txt-brand').selectedIndex].value]
            if (brand[0] == 'None'){
                setNof({status : 'none', message : ""})
                setTimeout(() => {setNof({status : 'fail', message : 'Please Choose Brand'})}, 50);
                revolve(null)
            }
            let supplier = [document.querySelector('#product-management .txt-supplier')[document.querySelector('#product-management .txt-supplier').selectedIndex].value]
            if (supplier[0] == 'None'){
                setNof({status : 'none', message : ""})
                setTimeout(() => {setNof({status : 'fail', message : 'Please Choose Supplier'})}, 50);
                revolve(null)
            }
            let category = [document.querySelector('#product-management .txt-category')[document.querySelector('#product-management .txt-category').selectedIndex].textContent]
            if (category[0] == 'None'){
                setNof({status : 'none', message : ""})
                setTimeout(() => {setNof({status : 'fail', message : 'Please Choose Category'})}, 50);
                revolve(null)
            }
            if (images.length < 3){
                setNof({status : 'none', message : ""})
                setTimeout(() => {setNof({status : 'fail', message : 'Please Choose Image (At least 3 Image)'})}, 50);
                revolve(null)
            }
            let images1 = []
            images.forEach(item => {
                console.log(item)
                images1.push(item.img)
            })
            revolve ({name, overview, brand, category,supplier,images : images1})
        })
    }

    const cleanInput = () => {
        document.querySelector('#product-management .txt-name').value = ''
        document.querySelector('#product-management .txt-overview').value = ''
        document.querySelector('#product-management .txt-image').value = ''
        const actives = document.querySelectorAll('#product-management .active') 
        for (let i = 0; i < actives.length ; i++) {
            actives[i].classList.remove('active')
        }
        document.querySelector('#product-management .txt-brand').value = 'None'
        document.querySelector('#product-management .txt-category').value = 'None'
        document.querySelector('#product-management .txt-supplier').value = 'None'
        document.querySelector('#product-management .txt-id').value = ""
        setImages([])
    }

    const handleDisplayRow = (num, index, e) => {
        cleanInput()
        let p = products[num]
        let i = 0
        while(i == 0) {
            const active = document.querySelector('#product-management .table-container .active')
            if (active != null) {
                active.classList.remove('active')
            } else i = 1
        }
        const row = document.querySelector('#product-management .row-'+num)
        row.classList.add('active')
        document.querySelector('#product-management .txt-id').value = p.id
        document.querySelector('#product-management .txt-name').value = p.name
        document.querySelector('#product-management .txt-overview').value = p.overview
        document.querySelector('#product-management .option-' + p.brand.brandName).selected = true
        document.querySelector('#product-management .option-' + p.supplier.supplierName.replaceAll(' ', '-').toLowerCase()).selected = true
        document.querySelector('#product-management .txt-category').value = p.category
        let l = []
        products[num].images.forEach(item => {
            l.push({id : l.length, img : item.image})
            setImages(l)
        })
        if (products[num].quantity != null || products[num].quantity == 0) {
            document.querySelector('.form-quantity').style.display = 'flex'
            let l1 = []
            products[num].quantity.forEach((item, index) => {
                l1.push({color : products[num].colors[index], size : products[num].sizes[index], quantity : products[num].quantity[index]})
            })
            setList_size_color_quantity(l1)
        } else {
            document.querySelector('.form-quantity').style.display = 'none'
            setList_size_color_quantity([])
        }
    }

    const handleInsertProduct = async () => {
        let token = 'Bearer ' + localStorage.getItem("token")
        const data = await getData()
        console.log(data)
        if (data) {
            axios.post("/products/insert-product", {
                brand : data.brand,
                supplier : data.supplier,
                category : data.category,
                images : data.images,
                name : data.name,
                overview : data.overview
            }, {headers : {Authorization : token, 'Content-Type': 'application/json'}})
                .then(res => {
                    if (res.data == true) {
                        console.log(res.data)
                        cleanInput()
                        setIsLoad(!isLoad)
                        setNof({status : 'none', message : ""})
                        setTimeout(() => {setNof({status : 'success', message : 'Product Insertion Successful'})}, 50);
                    } else {
                        setNof({status : 'none', message : ""})
                        setTimeout(() => {setNof({status : 'fail', message : 'Product Insertion Failed'})}, 50);
                    }
                })
        }
    }

    const handleUpdateProduct = async() => {
        let token = 'Bearer ' + localStorage.getItem("token")
        let id = document.querySelector('#product-management .txt-id').value
        const data = await getData()
        if (data) {
            axios.put('/products/update-product',{
                id : [id + ""],
                brand : data.brand,
                supplier : data.supplier,
                category : data.category,
                images : data.images,
                name : data.name,
                overview : data.overview
            }, {headers : {Authorization : token, 'Content-Type': 'application/json'}})
                .then(res => {
                    if (res.data == true) {
                        cleanInput()
                        setIsLoad(!isLoad)
                        setNof({status : 'none', message : ""})
                        setTimeout(() => {setNof({status : 'success', message : 'Product Update Successful'})}, 50);
                    } else {
                        setNof({status : 'none', message : ""})
                        setTimeout(() => {setNof({status : 'fail', message : 'Product Update Failed'})}, 50);
                    }
                })
        }
    }

    const handleDeleteProduct = () => {
        let token = 'Bearer ' + localStorage.getItem("token")
        let id = document.querySelector('#product-management .txt-id').value + ""
        
        if (id != '') {
            axios.post('/products/delete-product',{ id : id }, {headers : {Authorization : token, 'Content-Type': 'application/json'}})
                .then(res => {
                    if (res.data == true) {
                        cleanInput()
                        setIsLoad(!isLoad)
                        setNof({status : 'none', message : ""})
                        setTimeout(() => {setNof({status : 'success', message : 'Product Delete Successful'})}, 50);
                    } else {
                        setNof({status : 'none', message : ""})
                        setTimeout(() => {setNof({status : 'fail', message : 'Product Delete Failed'})}, 50);
                    }
                })
        } else {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Choose Product'})}, 50);
        }
    }

    const handleLoadSearch = (e) => {
        let l = []
        let l1 = products1
        l1.forEach(p => {
            let str = p.brand.brandName + p.category + p.name + p.supplier.supplierName
            if (str.toLowerCase().includes(e.target.value.toLowerCase())) {
                l.push(p)
            }
        })
        setProducts(l)
    }

    const getTotalQuantity = (arr) => {
        let l = []
        arr.forEach(item => {
            l.push(parseInt(item))
        })
        return l.reduce((accu, current) => accu + current, 0)
    }

    return (
        <div id="product-management" className='col-lg-12'>
            <Notification status={nof.status} message={nof.message}/>
            <h4 className='col-lg-12'>Product Management</h4>
            <div style={{display : 'flex', justifyContent : 'space-evenly'}}>
                <div className='form col-lg-4'>
                    <input type="hidden" className="form-control txt-id" />
                    <div className='form-group'>
                        <label>Name: </label>
                        <input type="text" className="form-control txt-name" placeholder='Product Name' />
                    </div>
                    <div className='form-group'>
                        <label>Brand: </label>
                        <select className='txt-brand'>
                            <option>None</option>
                            {brands.map((brand, index) => (
                                <option className={`option-${brand.brandName}`} key={index} value={brand.id}>{brand.brandName}</option>
                            ))}
                        </select>
                    </div>
                    <div className='form-group'>
                        <label>Supplier: </label>
                        <select className='txt-supplier'>
                            <option>None</option>
                            {suppliers.map((supplier, index) => (
                                <option className={`option-${supplier.supplierName.replaceAll(' ', '-').toLowerCase()}`} key={index} value={supplier.id}>{supplier.supplierName}</option>
                            ))}
                        </select>
                    </div>
                    <div className='form-group'>
                        <label>Category: </label>
                        <select className='txt-category'>
                            <option>None</option>
                            <option>Sneaker</option>
                            <option>Sandal</option>
                            <option>Custom</option>
                            <option>Accessories</option>
                        </select>
                    </div>
                    <div className='form-group'>
                        <label>Overview: </label>
                        <textarea class="form-control txt-overview" rows="4"></textarea>
                    </div>
                    
                    <div className='form-group' style={{marginTop : '20px'}}>
                        <label style={{marginTop : '-6px'}}>Images: </label>
                        <input type="file" className="txt-image" onChange={(e) => handleImportImage(e)} multiple/>
                        <div className='images-area'>
                        {images.map((image, index) => (
                            <div key={index} style={{position : 'relative'}}>
                                <button onClick={() => handleRemoveImage(index)}><i className='bx bx-x'></i></button>
                                <img height="37px" width="37px" src={image.img} key={index} />
                            </div>
                        ))}
                        </div>
                    </div>
                    <div className='form-group form-quantity' style={{marginTop : '20px', display :'none'}}>
                        <label style={{marginTop : '-6px'}}>Quantities: </label>
                        <table>
                            <div className='table-container'>
                                <thead>
                                    <tr>
                                        <th style={{width : '35px'}}>#</th>
                                        <th style={{width : '100px'}}>Color</th>
                                        <th style={{width : '100px'}}>Size</th>
                                        <th style={{width : '100px'}}>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list_size_color_quantity.length != 0 ?list_size_color_quantity.map((item, index) => {
                                        return (<tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td style={{position : 'relative'}}><div style={{border : 0,height : '20px', width : '20px', backgroundColor : item.color, borderRadius : '50%', position : 'absolute' , left : '50%', top : '4px', transform : 'translateX(-50%)'}} ></div></td>
                                                    <td>{item.size}</td>
                                                    <td>{item.quantity}</td>
                                                </tr>)
                                    }) : <></>}
                                </tbody>
                            </div>
                        </table>
                    </div>
                    <div className='form-group'>
                        <button onClick={() => handleInsertProduct()} type="button" className="btn btn-success">Insert</button>
                        <button onClick={() => handleUpdateProduct()} type="button" className="btn btn-primary">Update</button>
                        <button onClick={() => handleDeleteProduct()} type="button" className="btn btn-danger">Delete</button>
                        <button onClick={() => cleanInput()} type="button" className="btn btn-secondary">Clean</button>
                    </div>
                </div>
                <div className='col-lg-8 collection'>
                    <div className='col-lg-12 sort-search'>
                        <button onClick={() => {setProducts(products1); document.querySelector('.txt-search').value = ''}} style={{height:'35px', width : '35px', display:'flex', alignItems : 'center', justifyContent:'center'}} type="button" className="btn btn-warning"><i className="fa-solid fa-arrows-rotate"></i></button>
                        <div className='search'>
                            <input onChange={(e) => handleLoadSearch(e)} type="text" className="form-control txt-search" placeholder='Search' />
                        </div>
                    </div>
                    <div className='col-lg-12 table'>
                        <div className='table-container'>
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{width : '50px'}}>#</th>
                                        <th style={{width : '230px'}}>Name</th>
                                        <th style={{width : '90px'}}>Brand</th>
                                        <th style={{width : '120px'}}>Category</th>
                                        <th style={{width : '120px'}}>Supplier</th>
                                        <th style={{width : '250px'}}>Images</th>
                                        <th style={{width : '60px'}}>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products != null ? products.map((product, index) => (
                                        <tr onClick={(e) => handleDisplayRow(index,product.id)} key={index} className={`row-${index}`}>
                                            <td>{index + 1}</td>
                                            <td>{product.name}</td>
                                            <td>{product.brand.brandName}</td>
                                            <td>
                                                {product.category}
                                            </td>
                                            <td>
                                                {product.supplier.supplierName}
                                            </td>
                                            <td>
                                                <div className='image-area'>
                                                    {product.images.map((image, index) => (
                                                        <img key={index} height="28px" width='28px' src={image.image} />
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                {product.quantity ? getTotalQuantity(product.quantity) : 0}
                                            </td>
                                        </tr>
                                    )):''}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductManagement;