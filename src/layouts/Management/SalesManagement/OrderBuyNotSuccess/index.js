
import { useEffect, useState } from "react";
import Notification from '../../../../components/Notification'
import axios from "axios";


function OrderBuyNotSuccess({setOption, orderBuys, isLoad, setIsLoad}) {

    const [currentOrder, setCurrentOrder] = useState(null)
    const [nof, setNof] = useState({status : 'none', message : 'none'})
    const [orders, setOrders] = useState([])

    const formatDate = (d, type) => {
        const date = new Date(d);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        if (type == 'a') {
            return `${day}-${month}-${year}`;
        } else {
            return`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
        }
    }

    useEffect(() => {
        let l = []
        orderBuys.forEach(order => {
            if (order.order_status != 'Success') {
                l.push(order)
            }
        })
        setOrders(l)
    }, [isLoad, orderBuys])
    
    useEffect(() => {
        if (currentOrder) {
            document.querySelector('.txt-date').value = formatDate(currentOrder.order_date, 'b')
            document.querySelector('.txt-id').value ='OD_' + currentOrder.order_id
            document.querySelector('.txt-name').value = currentOrder.client ? currentOrder.client.client_name : currentOrder.guest.guest_name
            document.querySelector('.txt-num').value = currentOrder.order_items.length
            document.querySelector('.txt-profit').value =
                (currentOrder.order_items.reduce((total, current) => {
                    return total + current.order_item.quantity * current.order_item.retail_price;
                }, 0)).toFixed(2) + ' $'
            document.querySelector('.txt-note').value = currentOrder.order_note
            document.querySelector('.txt-status').value = currentOrder.order_status
        } else {
            document.querySelector('.txt-date').value = ''
            document.querySelector('.txt-id').value = ''
            document.querySelector('.txt-name').value = ''
            document.querySelector('.txt-num').value = ''
            document.querySelector('.txt-profit').value = ''
            document.querySelector('.txt-note').value = ''
            document.querySelector('.txt-status').value = 'None'
        }
    }, [currentOrder])

    const handleClean = () => {
        setCurrentOrder(null)
        document.querySelector('tbody .active').classList.remove('active')
    }

    const handleUpdateStatus = () => {
        if (currentOrder) {
            if (document.querySelector('.txt-status').value != 'None') {
                let token = 'Bearer ' + localStorage.getItem("token")
                let id = currentOrder.order_id
                let status = document.querySelector('.txt-status').value
                axios.put('/orders/update-status-order', {id : id, status : status}, {headers : {Authorization : token, 'Content-Type': 'application/json'}})
                    .then(res => {
                        if (res.data == true) {
                            setNof({status : 'none', message : ""})
                            setTimeout(() => {setNof({status : 'success', message : 'Updating Successful'})}, 50);
                            setIsLoad({...isLoad, orderbuy : !isLoad.orderbuy})
                        }
                    })
            } else {
                setNof({status : 'none', message : ""})
                setTimeout(() => {setNof({status : 'fail', message : 'The Status Invalid'})}, 50);
            }
        } else {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Choose Order'})}, 50);
        }
    }

    return (
        <>
            <Notification status={nof.status} message={nof.message}/>
            <div className='col-lg-4 form'>
                <div className='form-group'>
                    <label>Date Time: </label>
                    <input disabled type="date" className="form-control txt-date" />
                </div>
                <div className='form-group'>
                    <label>Order ID: </label>
                    <input disabled type="text" className="form-control txt-id" placeholder='Order ID' />
                </div>
                <div className='form-group'>
                    <label>Customer Name: </label>
                    <input disabled type="text" className="form-control txt-name" placeholder='Customer Name' />
                </div>
                <div className='form-group'>
                    <label>Number Items: </label>
                    <input disabled type="text" className="form-control txt-num" placeholder='Number Items' />
                </div>
                <div className='form-group'>
                    <label>Revenue Total: </label>
                    <input disabled type="text" className="form-control txt-profit" placeholder='Profit' />
                </div>
                <div className='form-group'>
                    <label>Status: </label>
                    <select className='txt-status'>
                        <option>None</option>
                        <option>Waiting for delivery</option>
                        <option>Being transported</option>
                        <option>Success</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label>Note: </label>
                    <textarea disabled class="form-control txt-note" rows="3"></textarea>
                </div>
                {currentOrder ? <div className='form-group'>
                    <table>
                        <div className='table-container'>
                            <thead>
                                <tr>
                                    <th style={{width : '35px'}}>#</th>
                                    <th style={{width : '330px'}}>Color</th>
                                    <th style={{width : '100px'}}>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrder.order_items.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td style={{display : 'flex', alignItems : 'center', padding : '3px 5px'}}>
                                                {item.product.name} - Size: {item.order_item.size} - Color: <div className='color' style={{backgroundColor : item.order_item.color, height : '16px', width : '16px', margin : '0 3px', borderRadius : '50%'}}/> x {item.order_item.quantity}
                                            </td>
                                            <td>{item.order_item.retail_price * item.order_item.quantity} $</td>
                                        </tr>
                                    )
                                })}

                            </tbody>
                        </div>
                    </table>
                </div> : <></>}
                <div className='form-group'>
                    <button onClick={() => {handleUpdateStatus()}} type="button" className="btn btn-primary">Update</button>
                    <button onClick={() => {handleClean()}} style={{margin : '0 5px'}} type="button" className="btn btn-danger btn-clean">Clean</button>
                </div>
            </div>
            <div className='col-lg-8 collection'>
                <div className='col-lg-12 options'>
                    <div className="col-lg-9"></div>
                    <select className='col-lg-3' onChange={(e) => setOption(parseInt(e.target.value))}>
                        <option value="1">Profit Statistics</option>
                        <option value="2">Order Import Statistics</option>
                        <option value="3" selected>Unsuccessful Purchase Orders</option>
                    </select>
                </div>
                <div className='col-lg-12 table'>
                    <div className='table-container'>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{width : '90px'}}>Date Time</th>
                                    <th style={{width : '65px'}}>Order ID</th>
                                    <th style={{width : '160px'}}>Customer Name</th>
                                    <th style={{width : '100px'}}>Number Items</th>
                                    <th style={{width : '90px'}}>Revenue</th>
                                    <th style={{width : '90px'}}>Tax VAT (5%)</th>
                                    <th style={{width : '120px'}}>Revenue After Tax</th>
                                    <th style={{width : '195px'}}>Status</th>
                                </tr>  
                            </thead>
                            <tbody>
                                {orders.map((order, index) => {
                                    return (
                                        <tr className={`row-${index}`} key={index} onClick={(e) => {
                                            document.querySelector('tbody .active') ? document.querySelector('tbody .active').classList.remove('active') : document.querySelector('tbody .row-'+index).classList.add('active')
                                            document.querySelector('tbody .row-'+index).classList.add('active')
                                            setCurrentOrder(order)
                                        }}>
                                            <td>{formatDate(order.order_date, 'a')}</td>
                                            <td>OD_{order.order_id}</td>
                                            <td>{order.client ? order.client.client_name : order.guest.guest_name}</td>
                                            <td>{order.order_items.length}</td>
                                            <td>{
                                                (order.order_items.reduce((total, current) => {
                                                    return total + current.order_item.quantity * current.order_item.retail_price;
                                                  }, 0)).toFixed(2)
                                                } $</td>
                                            <td>{
                                                (order.order_items.reduce((total, current) => {
                                                    return total + current.order_item.quantity * current.order_item.retail_price;
                                                  }, 0) * 0.05).toFixed(2)
                                                } $</td>
                                            <td>{
                                                (order.order_items.reduce((total, current) => {
                                                    return total + current.order_item.quantity * current.order_item.retail_price;
                                                  }, 0) - order.order_items.reduce((total, current) => {
                                                    return total + current.order_item.quantity * current.order_item.retail_price;
                                                  }, 0) * 0.05).toFixed(2)
                                                } $</td>
                                            <td
                                                style={{fontWeight : 'bold',color : order.order_status == 'Waiting for delivery' ? '#E79700' : order.order_status == 'Being transported' ? '#0080EB' : 'green'}}
                                            >
                                                {order.order_status}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderBuyNotSuccess;