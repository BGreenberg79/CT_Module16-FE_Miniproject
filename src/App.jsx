import React from 'react'
import { Routes, Route } from 'react-router-dom'
import CreateUser from './components/CreateUser'
import UserLogin from './components/UserLogin'
import UpdateUser from './components/UpdateUser'
import UserList from './components/UserList'
import ProductCatalog from './components/ProductCatalog' 
import { Provider } from 'react-redux'
import store from './redux/store'
import ShoppingCart from './components/ShoppingCart'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
    <Provider store={store}>
    <Routes>
      <Route path="/create-user" element={<CreateUser />} />
      <Route path='/' element={<UserLogin />} />
      <Route path='/update-user/:id' element={<UpdateUser />} />
      <Route path='/users' element={<UserList />} />
      <Route path='/product-catalog' element={<ProductCatalog />} />
      <Route path='/cart' element={<ShoppingCart />} />
    </Routes>
    </Provider>
    </I18nextProvider>

  )
}

export default App