
import { useEffect, useState } from "react";
import Notification from '../../../../components/Notification'

function OrderImportStatistics({setOption, orderImports}) {
    
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
        setOrders(orderImports)
    }, [orderImports])
    
    useEffect(() => {
        if (currentOrder) {
            document.querySelector('.txt-date').value = formatDate(currentOrder.order_date, 'b')
            document.querySelector('.txt-id').value = currentOrder.order_id
            document.querySelector('.txt-num').value = currentOrder.order_items.length
            document.querySelector('.txt-profit').value = currentOrder.order_items.reduce((total, current) => {return total + current.order_item.quantity * current.order_item.import_price}, 0).toFixed(2) + ' $'
            document.querySelector('.txt-note').value = currentOrder.order_note
        } else {
            document.querySelector('.txt-date').value = ''
            document.querySelector('.txt-id').value = ''
            document.querySelector('.txt-num').value = ''
            document.querySelector('.txt-profit').value = ''
            document.querySelector('.txt-note').value = ''
        }
    }, [currentOrder])

    const handleFilter = () => {
        const dateFrom = document.querySelector('.txt-from')
        const dateTo = document.querySelector('.txt-to')
        const date1Value = new Date(dateFrom.value);
        const date2Value = new Date(dateTo.value);
        if (dateFrom.value == '' || dateTo.value == '') {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Select Full Date'})}, 50);
            return;
        }
        if (date2Value < date1Value) {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'The end date must be after the start date'})}, 50);
            return;
        }

        let l = []
        orderImports.forEach(item => {
            let currentDate = new Date(item.order_date)
            if (currentDate>= date1Value && currentDate <= date2Value) {
                l.push(item)
            }
        })
        setOrders(l)
    }

    const handleClean = () => {
        setOrders([])
        setCurrentOrder(null)
        document.querySelector('.txt-from').value = ''
        document.querySelector('.txt-to').value = ''
    }

    return (
        <>
            <Notification status={nof.status} message={nof.message}/>
            <div className='col-lg-5 form'>
                <div className='form-group'>
                    <label>Date Time: </label>
                    <input disabled type="date" className="form-control txt-date" />
                </div>
                <div className='form-group'>
                    <label>Order ID: </label>
                    <input disabled type="text" className="form-control txt-id" placeholder='Order ID' />
                </div>
                <div className='form-group'>
                    <label>Number Items: </label>
                    <input disabled type="text" className="form-control txt-num" placeholder='Number Items' />
                </div>
                <div className='form-group'>
                    <label>Total Order Amount: </label>
                    <input disabled type="text" className="form-control txt-profit" placeholder='Profit' />
                </div>
                <div className='form-group'>
                    <label>Note: </label>
                    <textarea disabled class="form-control txt-note" rows="3"></textarea>
                </div>
                {currentOrder ? <div className='form-group'>
                    <table>
                        <div className='table-container' style={{maxHeight : '230px'}}>
                            <thead>
                                <tr>
                                    <th style={{width : '35px'}}>#</th>
                                    <th style={{width : '350px'}}>Product</th>
                                    <th style={{width : '100px'}}>Supplier</th>
                                    <th style={{width : '100px'}}>Total</th>
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
                                            <td>{item.supplier.name}</td>
                                            <td>{(item.order_item.import_price * item.order_item.quantity).toFixed(2)} $</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </div>
                    </table>
                </div> : <></>}
            </div>
            <div className='col-lg-7 collection'>
                <div className='col-lg-12 options'>
                    <div className='option-date col-lg-9' style={{display : 'flex', alignItems : 'center'}}>
                        From 
                        <input type='date' className='txt-from'/>
                        To 
                        <input type='date' className='txt-to'/>
                        <button onClick={() => {handleFilter()}} type="button" className="btn btn-success">Search</button>
                        <button onClick={() => {handleClean()}} style={{margin : '0 5px', display : orders.length != 0 ? 'block' : 'none'}} type="button" className="btn btn-danger btn-clean">Clean</button>
                    </div>
                    <select className='col-lg-3' onChange={(e) => setOption(parseInt(e.target.value))}>
                        <option value="1">Profit Statistics</option>
                        <option value="2" selected>Order Import Statistics</option>
                        <option value="3">Unsuccessful Purchase Orders</option>
                    </select>
                </div>
                <div className='col-lg-12 table'>
                    <div className='table-container'>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{width : '160px'}}>Date Time</th>
                                    <th style={{width : '150px'}}>Order ID</th>
                                    <th style={{width : '150px'}}>Number Items</th>
                                    <th style={{width : '320px'}}>Total Order Amount</th>
                                </tr>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th style={{padding : '3px 10px'}}>{
                                        orders.reduce((amount, cur) => {
                                            return amount + cur.order_items.reduce((total, current) => {return total + current.order_item.quantity * current.order_item.import_price}, 0)
                                        }, 0).toFixed(2) + ' $'
                                    }</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => {
                                    return (
                                        <tr className={`row-${index}`} key={index} onClick={() => {
                                            document.querySelector('tbody .active') ? document.querySelector('tbody .active').classList.remove('active') : document.querySelector('tbody .row-'+index).classList.add('active')
                                            document.querySelector('tbody .row-'+index).classList.add('active')
                                            setCurrentOrder(order)
                                        }}>
                                           <td>{formatDate(order.order_date, 'a')}</td>
                                           <td>OD_{order.order_id}</td>
                                           <td>{order.order_items.length}</td>
                                           <td>{
                                                order.order_items.reduce((total, current) => {return total + current.order_item.quantity * current.order_item.import_price}, 0).toFixed(2) + ' $'
                                            }</td>
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

export default OrderImportStatistics;