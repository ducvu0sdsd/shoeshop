
import { useContext, useState } from 'react';
import { Context } from '../../../components/UseContext/ThemeContext';
import './brand.scss'
import axios from 'axios';
import Notification from '../../../components/Notification'

function BrandsManagement({brands}) {

    const [isLoad, setIsLoad] = useContext(Context)
    const [nof, setNof] = useState({status : 'none', message : 'none'})
    const [images, setImages] = useState([])

    const cleanInput = () => {
        document.querySelector('.txt-name').value = "";
        document.querySelector('.txt-logo').value = "";
        document.querySelector('.txt-id').value = "";
        setImages([])
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
        document.querySelector('.txt-name').value = cells[1].textContent
        document.querySelector('.txt-id').value = index
        setImages([{id : 0, img : brands[num].logo}])
    }

    const handleInsertBrand = () => {
        let token = 'Bearer ' + localStorage.getItem("token")
        let name = document.querySelector('.txt-name').value;
        if (images.length != 0) {
            axios.post('/brands/insert-brand', {brandName : name, logo : images[0].img}, {headers : {Authorization : token, 'Content-Type': 'application/json'}})
                .then(res => {
                    if (res.data == true) {
                        setNof({status : 'none', message : ""})
                        setTimeout(() => {setNof({status : 'success', message : 'Add A Successful Brand'})}, 50);
                        setIsLoad(!isLoad)
                        cleanInput()
                    } else {
                        setNof({status : 'none', message : ""})
                        setTimeout(() => {setNof({status : 'fail', message : 'The Brand Already Exists'})}, 50);
                    }
                })
        } else {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Complete Information'})}, 50);
        }
    };

    const handleDeleteBrand = () => {
        let token = 'Bearer ' + localStorage.getItem("token")
        let id = document.querySelector('.txt-id').value;
        if (id != "") {
            let id1 = parseInt(id)
            axios.post(`/brands/delete-brand`, {id : id1},{headers : {Authorization : token, 'Content-Type': 'application/json'}})
                .then(res => {
                    if (res.data == true) {
                        setNof({status : 'none', message : ""})
                        setTimeout(() => {setNof({status : 'success', message : 'Remove A Successful Brand'})}, 50);
                        setIsLoad(!isLoad)
                        cleanInput()
                    }
                })
        } else {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Choose The Item'})}, 50);
        }
    };

    const handleUpdateBrand = () => {
        let token = 'Bearer ' + localStorage.getItem("token")
        let id = document.querySelector('.txt-id').value;
        let name = document.querySelector('.txt-name').value;
        let inputAvatar = document.querySelector('.txt-logo');
        let file = inputAvatar.files[0];

        if (id != "") {
            let id1 = parseInt(id)
            if (images.length != 0) {
                axios.put('/brands/update-brand', {id : id1,brandName : name, logo : images[0].img}, {headers : {Authorization : token, 'Content-Type': 'application/json'}})
                    .then(res => {
                        if (res.data == true) {
                            setNof({status : 'none', message : ""})
                            setTimeout(() => {setNof({status : 'success', message : 'Update A Successful Brand'})}, 50);
                            setIsLoad(!isLoad)
                            cleanInput()
                        } else {
                            setNof({status : 'none', message : ""})
                            setTimeout(() => {setNof({status : 'fail', message : 'Update A Failed Brand'})}, 50);
                        }
                    })
            } else {
                setNof({status : 'none', message : ""})
                setTimeout(() => {setNof({status : 'fail', message : 'Please Enter Complete Information'})}, 50);
            }
        } else {
            setNof({status : 'none', message : ""})
            setTimeout(() => {setNof({status : 'fail', message : 'Please Choose The Item'})}, 50);
        }
    };

    const handleImportImage = (e) => {
        let reader = new FileReader();
            reader.onload = (e1) => {
                setImages([{id : images.length , img : e1.target.result}])
            };
            reader.readAsDataURL(e.target.files[0]);
    }

    const handleRemoveImage = (index) => {
        const newArray = images.filter(item => item.id !== index);
        setImages(newArray)
    }

    return (
        <div id='brands-management'>
            <Notification status={nof.status} message={nof.message}/>
            <h4>Brands Management</h4>
            <input type="hidden" className={"form-control txt-id"} />
            <div className='form-group'>
                <label>Brand Name: </label>
                <input type="text" className="form-control txt-name" placeholder='Brand Name' />
            </div>
            <div className='form-group'>
                <label>Brand Logo: </label>
                <input type="file" className='txt-logo' onChange={(e) => handleImportImage(e)} />
                <div className='images-area'>
                    {images.map((image, index) => (
                        <div key={index} style={{position : 'relative'}}>
                            <button onClick={() => handleRemoveImage(index)}><i className='bx bx-x'></i></button>
                            <img height="37px" width="37px" src={image.img} key={index} />
                        </div>
                    ))}
                </div>
            </div>
            <div className='form-group'>
                <button onClick={() => handleInsertBrand()} type="button" className="btn btn-success">Insert</button>
                <button onClick={() => handleUpdateBrand()} type="button" className="btn btn-primary">Update</button>
                <button onClick={() => handleDeleteBrand()} type="button" className="btn btn-danger">Delete</button>
                <button onClick={() => cleanInput()} type="button" className="btn btn-secondary">Clean</button>
            </div>
            <div className='form-group'>
                <div className='table-container'>
                    <table>
                        <thead>
                            <tr>
                                <th style={{width : '50px'}}>#</th>
                                <th style={{width : '400px'}}>Brand Name</th>
                                <th style={{width : '250px'}}>Brand Logo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands ? brands.map((brand, index) => (
                                <tr onClick={() => handleDisplayRow(index,brand.id)} key={index} className={`row-${index}`}>
                                    <td style={{width : '50px'}}>{index + 1}</td>
                                    <td style={{width : '400px'}}>{brand.brandName}</td>
                                    <td style={{width : '250px'}}>
                                        <img height='30px' width='30px' src={brand.logo} />
                                    </td>
                                </tr>
                            )) : <></>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default BrandsManagement;