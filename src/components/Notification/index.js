

import { useEffect, useRef, useState } from 'react';
import './notification.scss'

function Notification({status, message}) {
    let sta = status;
    let intervalRef = useRef(null)
    let intervals = []
    let number = 0

    useEffect(() => {
        if (sta != 'none') {
            document.querySelector('.message').innerHTML = message
            document.querySelector('.active').classList.remove('active')
        }
        if (sta == 'success') {
            document.querySelector('.notification').style.borderLeft = '8px solid rgb(4, 211, 4)'
            document.querySelector('.status').style.color = 'rgb(4, 211, 4)'
            document.querySelector('.process').style.backgroundColor = 'rgb(4, 211, 4)'
            document.querySelector('.success').classList.add('active')
        } else if (sta == 'fail') {
            document.querySelector('.notification').style.borderLeft = '8px solid rgb(255, 54, 54)'
            document.querySelector('.status').style.color = 'rgb(255, 54, 54)'
            document.querySelector('.process').style.backgroundColor = 'rgb(255, 54, 54)'
            document.querySelector('.fail').classList.add('active')
        } else if (sta == 'warning') {
            document.querySelector('.notification').style.borderLeft = '8px solid rgba(255, 255, 0, 0.815)'
            document.querySelector('.status').style.color = 'rgba(255, 255, 0, 0.815)'
            document.querySelector('.process').style.backgroundColor = 'rgba(255, 255, 0, 0.815)'
            document.querySelector('.warning').classList.add('active')
        }
        if (sta != 'none') {
            setTimeout(() => {
                document.querySelector('.notification').style.right = '20px'
                document.querySelector('.notification').style.opacity = 1

                intervalRef.current = setInterval(() => {
                    try {
                        const width = document.querySelector('.notification').offsetWidth
                        if (number < width) {
                            number ++;
                            document.querySelector('.process').style.width = number  + "px"
                        } else {
                            document.querySelector('.notification').style.right = -500 + 'px'
                            number = 0
                            clearInterval(intervalRef.current)
                        }
                    } catch (error) {
                        clearInterval(intervalRef.current)
                    }
                }, 13);
            }, 50);
        } else {
            clearInterval(intervalRef.current)
            number = 0
            document.querySelector('.process').style.width = number  + "px"
            document.querySelector('.notification').style.opacity = 0
            document.querySelector('.notification').style.right = -500 + 'px'
        }
    },[sta || message])

    return (
        <div className='notification'>
            <div className='status'>
                <i className='bx bx-check-circle success mess active'></i>
                <i className='bx bx-x-circle fail mess'></i>
                <i className='bx bx-info-circle warning mess'></i>
            </div>
            <div className='message'> 
            </div>
            <div className='process'></div>
        </div>
    );
}

export default Notification;