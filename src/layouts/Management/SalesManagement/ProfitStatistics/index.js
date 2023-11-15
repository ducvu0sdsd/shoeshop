import { useEffect, useState, useContext } from "react";
import Notification from '../../../../components/Notification'


function ProfitStatistics({setOption, orderBuys, customer_name = ''}) {

    console.log(orderBuys)

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
        if (customer_name != '') {
            document.querySelector('.txt-search-name').value = customer_name
            handleChange()
        } else {
            setOrders(orderBuys)
        }
    }, [orderBuys])
    
    useEffect(() => {
        if (currentOrder) {
            document.querySelector('.txt-date').value = formatDate(currentOrder.order_date, 'b')
            document.querySelector('.txt-id').value = currentOrder.order_id
            document.querySelector('.txt-name').value = currentOrder.client ? currentOrder.client.client_name : currentOrder.guest.guest_name
            document.querySelector('.txt-num').value = currentOrder.order_items.length
            document.querySelector('.txt-profit').value =
                (currentOrder.order_items.reduce((total, current) => {
                    return total + current.order_item.quantity * current.order_item.retail_price;
                }, 0)).toFixed(2) + ' $'
            document.querySelector('.txt-note').value = currentOrder.order_note
        } else {
            document.querySelector('.txt-date').value = ''
            document.querySelector('.txt-id').value = ''
            document.querySelector('.txt-name').value = ''
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
        orderBuys.forEach(item => {
            let currentDate = new Date(item.order_date)
            if (currentDate>= date1Value && currentDate <= date2Value) {
                l.push(item)
            }
        })
        setOrders(l)
    }

    const handleClean = () => {
        setOrders(orderBuys)
        setCurrentOrder(null)
        document.querySelector('.txt-from').value = ''
        document.querySelector('.txt-to').value = ''
        document.querySelector('tbody .active').classList.remove('active')
    }

    const handleChange = () => {
        let l = []
        let value = document.querySelector('.txt-search-name').value
        orderBuys.forEach(item => {
            if (item.client) {
                if (item.client.client_name.toLowerCase().includes(value.toLowerCase())) {
                    l.push(item)
                }
            } else {
                if (item.guest.guest_name.toLowerCase().includes(value.toLowerCase())) {
                    l.push(item)
                }
            }
        })
        setOrders(l)
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
                    <label>Note: </label>
                    <textarea disabled className="form-control txt-note" rows="3"></textarea>
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
                    <button onClick={() => {handleClean()}} style={{margin : '0 5px', display : currentOrder ? 'block' : 'none'}} type="button" className="btn btn-danger 
                        btn-clean">Clean</button>
                </div>
            </div>
            <div className='col-lg-8 collection'>
                <div className='col-lg-12 options'>
                    <div className='option-date col-lg-10' style={{display : 'flex', alignItems : 'center'}}>  
                        <div style={{position : 'relative', display : 'flex', justifyContent : 'start', marginRight : '10px'}}>
                            <button onClick={() => {setOrders(orderBuys); document.querySelector('.txt-search-name').value = ''}} style={{height:'35px' ,width : '35px', display:'flex', alignItems : 'center', justifyContent:'center'}} type="button" className="btn btn-warning"><i className="fa-solid fa-arrows-rotate"></i></button>     
                            <i style={{position : 'absolute', fontSize : '20px', top : '10px', left : '50px'}} className='bx bx-search'></i>
                            <input onChange={(e) => {handleChange()}} type="text" style={{width : '240px', paddingLeft : '28px'}} className="form-control txt-search-name" placeholder='Customer Name' />
                        </div>
                        From 
                        <input type='date' className='txt-from' style={{width : '120px'}}/>
                        To 
                        <input type='date' className='txt-to'  style={{width : '120px'}}/>
                        <button onClick={() => {handleFilter()}} type="button" className="btn btn-success">Search</button>
                    </div>
                    <div className="col-lg-2" style={{display : 'flex', justifyContent : 'space-between'}}>
                        <select style={{width : '100%'}} onChange={(e) => setOption(parseInt(e.target.value))}>
                            <option value="1" selected>Profit Statistics</option>
                            <option value="2">Order Import Statistics</option>
                            <option value="3">Unsuccessful Purchase Orders</option>
                        </select>
                        
                    </div>  
                </div>
                <div className='col-lg-12 table'>
                    <div className='table-container'>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{width : '100px'}}>Date Time</th>
                                    <th style={{width : '50px'}}>Order ID</th>
                                    <th style={{width : '160px'}}>Customer Name</th>
                                    <th style={{width : '60px'}}>Number Items</th>
                                    <th style={{width : '90px'}}>Revenue</th>
                                    <th style={{width : '70px'}}>Tax VAT (5%)</th>
                                    <th style={{width : '90px'}}>Revenue After Tax</th>
                                    <th style={{width : '95px'}}>Import Price</th>
                                    <th style={{width : '100px'}}>Profit</th>
                                    <th style={{width : '150px'}}>Status</th>
                                </tr>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th style={{padding : "0 10px", fontSize : '15px'}}>
                                        {(orders.reduce((final, cur) => {
                                            return final + (cur.order_items.reduce((total, current) => {
                                                return total + current.order_item.quantity * current.order_item.retail_price;
                                              }, 0) + cur.shipping_price)
                                        },0)).toFixed(2)} $</th>
                                    <th style={{padding : "0 10px", fontSize : '15px'}}>
                                        {(orders.reduce((final, cur) => {
                                            return final + (cur.order_items.reduce((total, current) => {
                                                return total + current.order_item.quantity * current.order_item.retail_price;
                                              }, 0) + cur.shipping_price)
                                        },0) * 0.05).toFixed(2)} $</th>
                                    <th style={{padding : "0 10px", fontSize : '15px'}}>
                                        {(orders.reduce((final, cur) => {
                                            return final + (cur.order_items.reduce((total, current) => {
                                                return total + current.order_item.quantity * current.order_item.retail_price;
                                              }, 0) + cur.shipping_price)
                                        },0) - orders.reduce((final, cur) => {
                                            return final + (cur.order_items.reduce((total, current) => {
                                                return total + current.order_item.quantity * current.order_item.retail_price;
                                              }, 0) + cur.shipping_price)
                                        },0) * 0.05).toFixed(2)} $</th>
                                    <th style={{padding : "0 10px", fontSize : '15px'}}>
                                        {(orders.reduce((final, cur) => {
                                            return final + (cur.order_items.reduce((total, current) => {
                                                return total + current.order_item.quantity * current.order_item.import_price;
                                              }, 0))
                                        },0)).toFixed(2)} $</th>
                                    <th style={{padding : "0 10px", fontSize : '15px', color : 'red'}}>
                                        {(orders.reduce((final, cur) => {
                                            return final + (cur.order_items.reduce((total, current) => {
                                                return total + current.order_item.quantity * current.order_item.retail_price;
                                              }, 0) + cur.shipping_price)
                                        },0) - orders.reduce((final, cur) => {
                                            return final + (cur.order_items.reduce((total, current) => {
                                                return total + current.order_item.quantity * current.order_item.retail_price;
                                              }, 0) + cur.shipping_price)
                                        },0) * 0.05 - orders.reduce((final, cur) => {
                                            return final + (cur.order_items.reduce((total, current) => {
                                                return total + current.order_item.quantity * current.order_item.import_price;
                                              }, 0))
                                        },0)).toFixed(2)} $</th>
                                    <th></th>
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
                                                  }, 0) + order.shipping_price).toFixed(2)
                                                } $</td>
                                            <td>{
                                                ((order.order_items.reduce((total, current) => {
                                                    return total + current.order_item.quantity * current.order_item.retail_price;
                                                  }, 0) + order.shipping_price ) * 0.05).toFixed(2)
                                                } $</td>
                                            <td>{
                                                ((order.order_items.reduce((total, current) => {
                                                    return total + current.order_item.quantity * current.order_item.retail_price;
                                                  }, 0) + order.shipping_price) - (order.order_items.reduce((total, current) => {
                                                    return total + current.order_item.quantity * current.order_item.retail_price;
                                                  }, 0)+ order.shipping_price ) * 0.05).toFixed(2)
                                                } $</td>
                                            <td>{
                                                order.order_items.reduce((total, current) => {
                                                    return total + current.order_item.quantity * current.order_item.import_price;
                                                  }, 0).toFixed(2)
                                                } $</td>
                                            <td>{
                                                ((order.order_items.reduce((total, current) => {
                                                    return total + current.order_item.quantity * current.order_item.retail_price;
                                                  }, 0)+ order.shipping_price )- (order.order_items.reduce((total, current) => {
                                                    return total + current.order_item.quantity * current.order_item.retail_price;
                                                  }, 0)+ order.shipping_price ) * 0.05 - order.order_items.reduce((total, current) => {
                                                    return total + current.order_item.quantity * current.order_item.import_price;
                                                  }, 0)).toFixed(2)
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

export default ProfitStatistics;