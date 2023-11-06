
import { useContext, useEffect, useState } from 'react';
import './sales.scss'
import ProfitStatistics from './ProfitStatistics';
import OrderImportStatistics from './OrderImportStatistics';
import OrderBuyNotSuccess from './OrderBuyNotSuccess';
import {Context} from '../../../components/UseContext/ThemeContext'

function SalesManagement({orderImports, orderBuys}) {
    const [option, setOption] = useState(1)
    const [isLoad, setIsLoad] = useContext(Context)
    const [buys, setBuys] = useState([])
    const [imports, setImports] = useState([]) 
    const [cus_name, setCus_name] = useState('')
    let customer_name = localStorage.getItem("customer_name")
    if (customer_name != '') {
        setCus_name(customer_name)
        localStorage.setItem('customer_name', '')
    }

    useEffect(() => {
        setBuys(orderBuys)
    }, [orderBuys])

    useEffect(() => {
        setImports(orderImports)
    }, [orderImports])

    return (
        <div id='sales-management' className='col-lg-12'>
            <h4 className='col-lg-12'>Sales Management</h4>
            {option == 1 ? cus_name != '' ? <ProfitStatistics setOption={setOption} orderBuys={buys} customer_name={cus_name}/> : <ProfitStatistics setOption={setOption} orderBuys={buys} />
                : option == 2 ? <OrderImportStatistics setOption={setOption} orderImports={imports} /> 
                : <OrderBuyNotSuccess setOption={setOption} orderBuys={buys} isLoad={isLoad} setIsLoad={setIsLoad} />
            }
        </div>
    );
}

export default SalesManagement;