
import './App.css';
import Header from './layouts/Default/Header';
import HomePage from './layouts/HomePage';
import Footer from './layouts/Default/Footer';
import { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate} from 'react-router-dom';
import Categories from './layouts/Categories';
import ShoesDetail from './layouts/ShoesDetail';
import EditProfilePage from './layouts/UserPage/EditProfile';
import GeneralPage from './layouts/UserPage/General';
import PasswordPage from './layouts/UserPage/Password';
import axios from 'axios';
import { Context } from './components/UseContext/ThemeContext';
import ShoeManagement from './layouts/Management/ShoesManagement'
import BrandsManagement from './layouts/Management/BrandsManagement';
import ImportProductPage from './layouts/Management/ImportProductPage';
import SupplierManagerMent from './layouts/Management/SupplierManagement';
import ClientsManagement from './layouts/Management/ClientsManagement';
import PaymentPage from './layouts/PaymentPage';
import SalesManagement from './layouts/Management/SalesManagement';
import CartPage from './layouts/CartPage'


function App() {
  const [isload, setIsLoad, customer_name, data] = useContext(Context)
  const [user, setUser] = useState(null)
  const [brands, setBrands] = useState([])
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [listMenu, setListMenu] = useState(null)
  const [clients, setClients] = useState([])
  const [orderImports, setOrderImports] = useState([])
  const [orderBuys, setOrderBuys] = useState([])

  const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [pathname]);
  };

  useEffect(() => {
    // Get Data about Products
    console.log(2222)
    axios.get('/products', {headers : {'Content-Type': 'application/json'}})
      .then(res => {
          setProducts(res.data)
          data.setProducts(res.data)
      })
  }, [isload])

  useEffect(() => {
      let l1 = []
      let l2 = []
      let sneakers = []
      let sandals = []
      let accessories = []
      let customs = []
      products.forEach(p => {
          if (!l1.includes(p.brand.brandName+"_"+p.category)) {
              l1.push(p.brand.brandName+"_"+p.category)
              l2.push({brand : p.brand.brandName, category : p.category, image : p.brand.logo})
          }
      })
      l2.forEach(item => {
          if (item.category == 'Sneaker') sneakers.push({brand : item.brand, image : item.image})
          else if (item.category == 'Sandal') sandals.push({brand : item.brand, image : item.image})
          else if (item.category == 'Custom') customs.push({brand : item.brand, image : item.image})
          else if (item.category == 'Accessories') accessories.push({brand : item.brand, image : item.image})
      })
      setListMenu({sneakers : sneakers, sandals : sandals, customs : customs, accessories : accessories})
  }, [products])

  useEffect(() => {
    // Get Data about Clients
    let token = 'Bearer ' + localStorage.getItem("token")
    axios.get('/clients/get-all-client-with-number-of-order', {headers : {Authorization : token, 'Content-Type': 'application/json'}})
      .then(res => {
          setClients(res.data)
      })
  }, [isload.client])


  useEffect(() => {
    if (localStorage.getItem('token') != null) {
        let t = localStorage.getItem("token")
        let username = localStorage.getItem("username")
        let token = 'Bearer ' + t;
        
        // Get Data about Account
        axios.get(`/accounts/get-account?username=${username}`, {headers : {Authorization : token, 'Content-Type': 'application/json'}}) 
            .then(res => {
                if (res.data != "") {
                  setUser(res.data)
                  data.setUser(res.data)
                } else {
                  localStorage.removeItem('token')
                  localStorage.removeItem('username')
                }
            })
    }
  }, [isload.user])

  useEffect(() => {
    // Get Data about Brands
    axios.get('/brands/get-all-brands', {headers : {'Content-Type': 'application/json'}})
    .then(res => {
        setBrands(res.data)
    })
  }, [isload.brand])

  useEffect(() => {
    let token = 'Bearer ' + localStorage.getItem("token")
    axios.get('/suppliers/get-all-suppliers', {headers : {Authorization : token, 'Content-Type': 'application/json'}})
        .then(res=> {
            setSuppliers(res.data)
        })
  }, [isload.supplier])

  useEffect(() => {
    let token = 'Bearer ' + localStorage.getItem("token")
    axios.get('/orders/get-all-order-buy', {headers : {Authorization : token, 'Content-Type': 'application/json'}})
        .then(res=> {
            setOrderBuys(res.data)
        })
  }, [isload.orderbuy])

  useEffect(() => {
    let token = 'Bearer ' + localStorage.getItem("token")
    axios.get('/orders/get-all-order-import', {headers : {Authorization : token, 'Content-Type': 'application/json'}})
        .then(res=> {
          setOrderImports(res.data)
        })
  }, [isload.orderimport])


  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Header user={user} products={products} brands={brands}/>
        <div style={{marginTop : '70px'}}></div>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/account/general' element={user ? <GeneralPage user={user} /> : <Navigate to='/'/>} />
          <Route path='/account/edit-profile' element={user ? <EditProfilePage user={user} /> : <Navigate to='/' replace/>} />
          <Route path='/account/password' element={user ? <PasswordPage user={user} /> : <Navigate to='/' replace/>} />
          <Route path='/account/shoes-management' element={user ? user.admin ? <ShoeManagement brands={brands} products1={products} suppliers={suppliers} /> : <Navigate to='/' replace/> : <Navigate to='/' replace/>} /> 
          <Route path='/account/brands-management' element={user ? user.admin ? <BrandsManagement brands={brands} /> : <Navigate to='/' replace/> : <Navigate to='/' replace/>} /> 
          <Route path='/account/import-product-management' element={user ? user.admin ? <ImportProductPage products={products} /> : <Navigate to='/' replace/> : <Navigate to='/' replace/>} /> 
          <Route path='/account/suppliers-management' element={user ? user.admin ? <SupplierManagerMent suppliers={suppliers} /> : <Navigate to='/' replace/> : <Navigate to='/' replace/>} /> 
          <Route path='/account/clients-management' element={user ? user.admin ? <ClientsManagement clients={clients} /> : <Navigate to='/' replace/> : <Navigate to='/' replace/>} /> 
          <Route path='/account/sales-management' element={user ? user.admin ? <SalesManagement orderImports={orderImports} orderBuys={orderBuys} /> : <Navigate to='/' replace/> : <Navigate to='/' replace/>} /> 
          <Route path='/payment' element={<PaymentPage user1={user} />} />
          <Route path='/payment/:cart' element={user ? <PaymentPage user1={user} /> : <Navigate to='/' replace/>} />
          <Route path='/cart' element={user ? <CartPage /> : <></>} />
          <Route path={`/categories/sneakers/all`} element={<Categories categoryName={'Sneaker'} brandName={'All Sneaker'} products={products}/>}/>
          <Route path={`/categories/sandals/all`} element={<Categories categoryName={'Sandal'} brandName={'All Sandal'} products={products}/>}/>
          <Route path={`/categories/customs/all`} element={<Categories categoryName={'Custom'} brandName={'All Custom'} products={products}/>}/>
          <Route path={`/categories/accessories/all`} element={<Categories categoryName={'Accessories'} brandName={'All Accessory'} products={products}/>}/>

          {/* Categories */}
          {listMenu ? listMenu.sneakers.map((item, index) => {
            return <Route key={index} path={`/categories/sneakers/${item.brand.toLowerCase().split(' ').join('-')}`} 
              element={<Categories categoryName={'Sneaker'} brandName={item.brand} products={products}/>}/>
          }) : <></>}
          {listMenu ? listMenu.sandals.map((item, index) => {
            return <Route key={index} path={`/categories/sandals/${item.brand.toLowerCase().split(' ').join('-')}`} 
              element={<Categories categoryName={'Sandal'} brandName={item.brand} products={products}/>}/>
          }): <></>}
          {listMenu ? listMenu.customs.map((item, index) => {
            return <Route key={index} path={`/categories/customs/${item.brand.toLowerCase().split(' ').join('-')}`} 
              element={<Categories categoryName={'Custom'} brandName={item.brand} products={products}/>}/>
          }): <></>}
          {listMenu ? listMenu.accessories.map((item, index) => {
            return <Route key={index} path={`/categories/accessories/${item.brand.toLowerCase().split(' ').join('-')}`} 
              element={<Categories categoryName={'Accessories'} brandName={item.brand} products={products}/>}/>
          }) : <></>}


          {/* Products */}
          {products.map((product, index) => {
            return (<Route 
                      key={index} path={`/categories/${product.category.toLowerCase().split(' ').join('-')}s/${product.brand.brandName.toLowerCase().split(' ').join('-')}/${product.name.toLowerCase().split(' ').join('-')}`} 
                      element={<ShoesDetail product={product} products={products} user={user} />} />)
          })} 


        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
