import { Context } from "./ThemeContext";
import axios from "axios";
import { useEffect, useState } from "react";

function Provider({children}) {

    const [isload, setIsLoad] = useState(false);
    const [user, setUser] = useState(null)
    let customer_name = ''

    return ( 
        <Context.Provider value={[isload,setIsLoad,user, customer_name]}>
            {children}
        </Context.Provider>
     );
}

export default Provider;