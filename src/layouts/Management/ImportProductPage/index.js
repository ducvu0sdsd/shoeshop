
import { useState, useContext } from 'react'
import Notification from '../../../components/Notification'
import './importProduct.scss'
import axios from 'axios'
import {Context} from '../../../components/UseContext/ThemeContext'

function ImportProductPage({products}) {
    const [nof, setNof] = useState({status : 'none', message : 'none'})
    const colors = ['rgb(205, 97, 85)','rgb(236, 112, 99)','rgb(175, 122, 197)','rgb(165, 105, 189)','rgb(84, 153, 199)','rgb(93, 173, 226)','rgb(72, 201, 176)','rgb(69, 179, 157)','rgb(82, 190, 128)','rgb(88, 214, 141)','rgb(244, 208, 63)','rgb(245, 176, 65)','rgb(235, 152, 78)','rgb(220, 118, 51)','rgb(240, 243, 244)','rgb(202, 207, 210)','rgb(170, 183, 184)','rgb(153, 163, 164)','rgb(93, 109, 126)','rgb(86, 101, 115)']
    const sizes = [36,37,38,39,40,41,42,43,44,45]
    const [list_item, setList_item] = useState([])
    const [isLoad, setIsLoad] = useContext(Context)

    const cleanInput = () => {
        document.querySelector('#import-product-page .txt-id').value = ''
        document.querySelector('#import-product-page .txt-supplier').value = ''
        document.querySelector('#import-product-page .txt-product').value = ''
        document.querySelector('#import-product-page .txt-retail-price').value = ''
        document.querySelector('#import-product-page .txt-buy-price').value = ''
        document.querySelector('#import-product-page .txt-quantity').value = ''
        const actives = document.querySelectorAll('#import-product-page .active') 
        for (let i = 0; i < actives.length ; i++) {
            actives[i].classList.remove('active')
        }
    }

    const cleanAll = () => {
        cleanInput()
        document.querySelector('#import-product-page .txt-date').value = ''
        document.querySelector('#import-product-page .txt-note').value = ''
        setList_item([])
    }

    const [list, setList] = useState([])
    const handleDisplaySearch = () => {
        const resultArea = document.querySelector('.result-area')
        const txt_product = document.querySelector('.txt-product').value
        if (txt_product != '') {
            resultArea.style.height = '220px'
        } else {
            resultArea.style.height = '0px'
        }
        setList([])
        let l = []
        products.forEach((p) => {
            if (p.name.toLowerCase().includes(txt_product.toLowerCase())){
                l.push(p)
            }
        })
        setList(l)
    }


    const handleCreateItem = () => {
        if (!checkInput()) return;
        let txt_product_id = document.querySelector('#import-product-page .txt-product-id').value
        let txt_supplier = document.querySelector('#import-product-page .txt-supplier').value
        let txt_productname = document.querySelector('#import-product-page .txt-product').value
        let txt_retail_price = document.querySelector('#import-product-page .txt-retail-price').value
        let txt_buy_price = document.querySelector('#import-product-page .txt-buy-price').value
        let txt_quantity = document.querySelector('#import-product-page .txt-quantity').value
        let txt_color = document.querySelector('.colors-area .active').style.backgroundColor
        let txt_size = document.querySelector('.sizes-area .active').textContent
        let arr = []
        list_item.forEach((item, index) => {
            arr.push({...item, id : index})
        })
        arr.push({id : list_item.length,txt_product_id, txt_supplier, txt_productname, txt_retail_price, txt_buy_price, txt_quantity, txt_color, txt_size})
        setList_item(arr)
        cleanInput()
    }

    const handleDisplayRow = (num, o) => {
        cleanInput()
        let i = 0
        while(i == 0) {
            const active = document.querySelector('#import-product-page .table-container .active')
            if (active != null) {
                active.classList.remove('active')
            } else i = 1
        }
        const row = document.querySelector('#import-product-page .row-'+num)
        row.classList.add('active')
        document.querySelector('#import-product-page .txt-supplier').value = o.txt_supplier
        document.querySelector('#import-product-page .txt-product').value = o.txt_productname
        document.querySelector('#import-product-page .txt-retail-price').value = o.txt_retail_price
        document.querySelector('#import-product-page .txt-buy-price').value = o.txt_buy_price
        document.querySelector('#import-product-page .txt-quantity').value = o.txt_quantity
        document.querySelector('#import-product-page .color-'+ o.txt_color.replaceAll(', ', '').replace('(','').replace(')','')).classList.add('active')
        document.querySelector('#import-product-page .size-'+ o.txt_size).classList.add('active')
        document.querySelector('#import-product-page .txt-id').value = o.id
    }

    const checkInput = () => {
        let txt_supplier = document.querySelector('#import-product-page .txt-supplier').value
        let txt_retail_price = document.querySelector('#import-product-page .txt-retail-price').value
        let txt_buy_price = document.querySelector('#import-product-page .txt-buy-price').value
        let txt_quantity = document.querySelector('#import-product-page .txt-quantity').value
        let txt_color = document.querySelectorAll('.colors-area .active')
        let txt_size = document.querySelectorAll('.sizes-area .active')
        if (txt_supplier == "") {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Product'})}, 50);
            return false;
        }
        if (txt_retail_price == "" ) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Retail Price'})}, 50);
            return false;
        }
        if (txt_buy_price == "") {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Buy Price'})}, 50);
            return false;
        }
        if (txt_quantity == "") {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Quantity'})}, 50);
            return false;
        }
        if (txt_color.length == 0) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Choose Color'})}, 50);
            return false;
        }
        if (txt_size.length == 0) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Choose Size'})}, 50);
            return false;
        }
        return true;
    }

    const handleDeleteItem = () => {
        const id =  document.querySelector('#import-product-page .txt-id').value
        if (id != "") {
            let newarr = list_item.filter(item => item.id != id)
            setList_item(newarr)
            cleanInput();
        } else {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Choose Row'})}, 50);
        }
    }

    const handleInsertOrder = () => {
        let token = 'Bearer ' + localStorage.getItem("token")
        const note = document.querySelector('.txt-note').value
        const date = document.querySelector('.txt-date').value
        if (list_item.length == 0) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Coupon Item'})}, 50);
            return;
        }
        if (date == '') {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Choose Date'})}, 50);
            return;
        }
        axios.post('/orders/insert-order-import', {list_item : list_item, note: note, date: date}, {headers : {Authorization : token, 'Content-Type': 'application/json'}})
            .then(res => {
                if (res.data == true) {
                    setIsLoad(!isLoad)
                    cleanAll()
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'success', message : 'Create Coupon Successful'})}, 50);
                } else {
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'fail', message : 'Create Coupon Failed'})}, 50);
                }
            })
    }

    return (
        <div id='import-product-page' className='col-lg-12'>
            <Notification status={nof.status} message={nof.message}/>
            <h4 className='col-lg-12'>Import Coupon</h4>
            <div className='col-lg-4 form-input'>
                <input type='hidden' className='txt-id' />
                <input type='hidden' className='txt-product-id' />
                <div className='form-group'>
                    <label>Supplier : </label>
                    <input disabled type="text" className="form-control txt-supplier" placeholder='Supplier' />
                </div>
                <div className='form-group'>
                    <label>Product : </label>
                    <input style={{paddingRight : '25px'}} onChange={() => handleDisplaySearch()} type="text" className="form-control txt-product" placeholder='Product Name' />
                    <i onClick={() => {document.querySelector('.txt-product').value = ''; document.querySelector('.result-area').style.height = 0; document.querySelector('.txt-supplier').value = ''}} className='bx bx-x'></i>
                    <div className='result-area'>
                        {list.map((li, index) => (
                            <div onClick={() => {document.querySelector('.txt-product').value = li.name; document.querySelector('.result-area').style.height = 0; document.querySelector('.txt-supplier').value = li.supplier.supplierName; document.querySelector('.txt-product-id').value = li.id}} className='result-item' key={index}>
                                <img src={li.images[0].image} height='40px' width="40px" />
                                {li.name}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='form-group'>
                    <label>Import Price : </label>
                    <input type="text" className="form-control txt-buy-price" placeholder='Buy Price' />
                </div>
                <div className='form-group'>
                    <label>Retail Price : </label>
                    <input type="text" className="form-control txt-retail-price" placeholder='Retail Price' />
                </div>
                <div className='form-group'>
                    <label>Quantity : </label>
                    <input type="text" className="form-control txt-quantity" placeholder='Quantity' />
                </div>
                <div className='form-group'>
                    <label>Colors: </label>
                    <div className='colors-area'>
                        {colors.map((color, index) => (
                            <div onClick={(e) => {
                                document.querySelector('.colors-area .active') ? document.querySelector('.colors-area .active').classList.remove('active') : e.target.classList.add('active')
                                e.target.classList.add('active')
                            }} key={index} className={'color-item color-'+color.replaceAll(', ', '').replace('(','').replace(')','')} style={{backgroundColor : color}}></div>
                        ))}
                    </div>
                </div>
                <div className='form-group'>
                    <label>Sizes: </label>
                    <div className='sizes-area'>
                        {sizes.map((size, index) => (
                            <div onClick={(e) => {
                                document.querySelector('.sizes-area .active') ? document.querySelector('.sizes-area .active').classList.remove('active') : e.target.classList.add('active')
                                e.target.classList.add('active')
                            }} key={index} className={'size-item size-'+size}>{size}</div>
                        ))}
                    </div>
                </div>
                <div className='form-group'>
                    <button onClick={() => handleCreateItem()} type="button" className="btn btn-success">Insert</button>
                    <button onClick={() => handleDeleteItem()} type="button" className="btn btn-danger">Delete</button>
                    <button onClick={() => cleanInput()} type="button" className="btn btn-secondary">Clean</button>
                </div>
            </div>
            <div className='col-lg-8 collection'>
                <div style={{display : 'flex', justifyContent: 'space-between'}}>
                    <button onClick={() => handleInsertOrder()} type="button" className="btn btn-success">Create</button>
                    <div style={{display : 'flex'}}>
                        <div className='total'>Total : {list_item.reduce((accumulator, current) => accumulator + parseInt(current.txt_retail_price), 0)} $</div>
                        <div className='form-group' style={{marginRight : '10px'}}>
                            <input type="date" className="form-control txt-date" />
                        </div>
                        <div className='form-group'>
                            <input type="text" className="form-control txt-note" placeholder='Note' />
                        </div>
                    </div>
                </div>
                <div className='col-lg-12 table'>
                    <div className='table-container'>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{width : '30px'}}>#</th>
                                    <th style={{width : '255px'}}>Product</th>
                                    <th style={{width : '105px'}}>Import Price</th>
                                    <th style={{width : '105px'}}>Retail Price</th>
                                    <th style={{width : '80px'}}>Quantity</th>
                                    <th style={{width : '70px'}}>Color</th>
                                    <th style={{width : '70px'}}>Size</th>
                                    <th style={{width : '180px'}}>Supplier</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list_item.map((item, index) => (
                                    <tr onClick={() => handleDisplayRow(index,item)} key={index} className={`row-${index}`}>
                                        <td>{index + 1}</td>
                                        <td>{item.txt_productname}</td>
                                        <td>{item.txt_buy_price} $</td>
                                        <td>{item.txt_retail_price} $</td>
                                        <td>{item.txt_quantity}</td>
                                        <td><div className='color-item-table' style={{backgroundColor : item.txt_color}}></div></td>
                                        <td>{item.txt_size}</td>
                                        <td>{item.txt_supplier}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImportProductPage;