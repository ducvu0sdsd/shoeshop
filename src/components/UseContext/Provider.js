import { Context } from "./ThemeContext";
import axios from "axios";
import { useEffect, useState } from "react";

function Provider({children}) {

    const [isload, setIsLoad] = useState({product : false, client : false, user : false, brand : false, supplier : false, orderbuy : false, orderimport : false, cart : false, feedback : false});
    const [user, setUser] = useState(null)
    const [payload, setPayload] = useState([])
    const [carts, setCarts] = useState([])
    const [products, setProducts] = useState([])
    const [feedbacks, setFeedbacks] = useState([])

    useEffect(() => {
        if (user && products.length != 0) {
            axios.get('/carts/get-all-cart-by-user?user_id='+user.id, {headers : {'Content-Type': 'application/json'}})
            .then (res => {
                let l = []
                res.data.forEach(item => {
                    products.forEach(item1 => {
                        if (item1.id == item.colorSize.product.id) {
                            l.push({
                                id : item.id,
                                user : user,
                                product : item.colorSize.product,
                                colorsize : {id: item.colorSize.id, color : item.colorSize.color, size : item.colorSize.size, price : item.colorSize.retailPrice, quantity : item.colorSize.quantity},
                                quantity : item.quantity,
                                image : item1.images[0].image
                            })
                        }
                    })
                })
                setCarts(l)
            })
        }
    }, [user, isload.cart])

    useEffect(() => {
        axios.get('/feedbacks',{headers : {'Content-Type': 'application/json'}})
            .then(res => {
                setFeedbacks(res.data)
            })
    }, [isload.feedback])

    let customer_name = ''
    let data = {
        payload : payload,
        setPayload : setPayload,
        carts : carts,
        setCarts : setCarts,
        setUser : setUser,
        setProducts : setProducts,
        feedbacks : feedbacks,
        setFeedbacks : setFeedbacks
    }
    return ( 
        <Context.Provider value={[isload,setIsLoad, customer_name, data]}>
            {children}
        </Context.Provider>
     );
}

export default Provider;