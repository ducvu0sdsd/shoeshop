
import { useContext, useEffect, useState } from 'react';
import Notification from '../../../components/Notification'
import './supplierManagerment.scss';
import axios from 'axios';
import { Context } from '../../../components/UseContext/ThemeContext';


function SupplierManagerMent({suppliers}) {
    const [nof, setNof] = useState({status : 'none', message : 'none'})
    const [isLoad, setIsLoad] = useContext(Context)


    const cleanInput = () => {
        document.querySelector('.txt-name').value = "";
        document.querySelector('.txt-address').value = "";
        document.querySelector('.txt-phone').value = "";
        document.querySelector('.txt-id').value = "";
    }

    const handleDisplayRow = (num, index) => {
        let i = 0
        while(i == 0) {
            const active = document.querySelector('.table-container .active')
            if (active != null) {
                active.classList.remove('active')
            } else i = 1
        }
        const row = document.querySelector('.row-'+num)
        row.classList.add('active')
        let cells = row.getElementsByTagName('td')
        document.querySelector('.txt-id').value = index
        document.querySelector('.txt-name').value = cells[1].textContent
        document.querySelector('.txt-address').value = cells[2].textContent
        document.querySelector('.txt-phone').value = cells[3].textContent
    }

    const checkInput = () => {
        let name = document.querySelector('.txt-name').value;
        let address = document.querySelector('.txt-address').value;
        let phone = document.querySelector('.txt-phone').value;
        if (name == "") {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Name'})}, 50);
            return null;
        }
        if (address == "") {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Address'})}, 50);
            return null;
        }
        if (phone == "") {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Phone'})}, 50);
            return null;
        }
        return {name, address, phone};
    }

    const handleInsertSupplier = () => {
        let token = 'Bearer ' + localStorage.getItem("token")
        let data = checkInput();
        if (data != null) {
            const { name, address, phone } = data
            axios.post('/suppliers/insert-supplier', {name : name, address : address, phone : phone}, {headers : {Authorization : token, 'Content-Type': 'application/json'}})
            .then (res => {
                if (res.data == true) {
                    cleanInput()
                    setIsLoad({...isLoad, supplier : !isLoad.supplier})
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'success', message : 'The Supplier Insertion Successful'})}, 50);
                } else {
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'fail', message : 'The Supplier Insertion Failed'})}, 50);
                }
            })
        }
    }
    const handleDeleteSupplier = () => {
        let token = 'Bearer ' + localStorage.getItem("token")
        let id = document.querySelector('.txt-id').value;
        if (id != "") {
            let id1 = parseInt(id)
            axios.post(`/suppliers/delete-supplier`, {id : id1},{headers : {Authorization : token, 'Content-Type': 'application/json'}})
                .then(res => {
                    if (res.data == true) {
                        setNof({status : 'none', message : ""})
                        setTimeout(() => {setNof({status : 'success', message : 'Remove A Successful Brand'})}, 50);
                        setIsLoad({...isLoad, supplier : !isLoad.supplier})
                        cleanInput()
                    }
                })
        } else {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Choose The Item'})}, 50);
        }
    };

    const handleUpdateSupplier = () => {
        let token = 'Bearer ' + localStorage.getItem("token")
        let data = checkInput();
        if (data != null) {
            let id = document.querySelector('.txt-id').value;
            const { name, address, phone } = data
            axios.put('/suppliers/update-supplier', {id : id, name : name, address : address, phone : phone}, {headers : {Authorization : token, 'Content-Type': 'application/json'}})
            .then (res => {
                if (res.data == true) {
                    cleanInput()
                    setIsLoad({...isLoad, supplier : !isLoad.supplier})
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'success', message : 'The Supplier Updated Successful'})}, 50);
                } else {
                    setNof({status : 'none', message : ""})
                    setTimeout(() => {setNof({status : 'fail', message : 'The Supplier Updated Failed'})}, 50);
                }
            })
        }
    };

    return (
        <div id="supplier-managerment">
            <Notification status={nof.status} message={nof.message}/>
            <h4>Suppliers Management</h4>
            <input type="hidden" className={"form-control txt-id"} />
            <input type='hidden' className='txt-id'/>
            <div className='form-group'>
                <label>Supplier Name: </label>
                <input type="text" className="form-control txt-name" placeholder='Supplier Name' />
            </div>
            <div className='form-group'>
                <label>Supplier Address: </label>
                <input type="text" className="form-control txt-address" placeholder='Supplier Address' />
            </div>
            <div className='form-group'>
                <label>Supplier Phone: </label>
                <input type="text" className="form-control txt-phone" placeholder='Supplier Phone' />
            </div>
            
            <div className='form-group'>
                <button onClick={() => handleInsertSupplier()} type="button" className="btn btn-success">Insert</button>
                <button onClick={() => handleUpdateSupplier()} type="button" className="btn btn-primary">Update</button>
                <button onClick={() => handleDeleteSupplier()} type="button" className="btn btn-danger">Delete</button>
                <button onClick={() => cleanInput()} type="button" className="btn btn-secondary">Clean</button>
            </div>
            <div className='form-group'>
                <div className='table-container'>
                    <table>
                        <thead>
                            <tr>
                                <th style={{width : '50px'}}>#</th>
                                <th style={{width : '200px'}}>Name</th>
                                <th style={{width : '350px'}}>Address</th>
                                <th style={{width : '200px'}}>Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers ? suppliers.map((s, index) => (
                                <tr onClick={() => handleDisplayRow(index,s.id)} key={index} className={`row-${index}`}>
                                    <td>{index + 1}</td>
                                    <td>{s.supplierName}</td>
                                    <td>{s.supplierAddress}</td>
                                    <td>{s.supplierPhone}</td>
                                </tr>
                            )) : <></>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default SupplierManagerMent;