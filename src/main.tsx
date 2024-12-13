import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import theme from './theme.ts'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ChakraProvider } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignUpForm from './components/SignUpForm.tsx'
import ProductList from './components/ProductList.tsx'
import SignInForm from './components/SignInForm.tsx'
import AdminLogin from './components/AdminLogin.tsx'
import Dashboard from './components/Dashboard.tsx'
import Products from './components/Products.tsx'
import Product from './components/Product.tsx'
import Users from './components/Users.tsx'
import Payment from './components/Payment.tsx'
import MyOrders from './components/MyOrders.tsx'
import Orders from './components/Orders.tsx'
import Category from './components/Category.tsx'
import Cart from './components/Cart.tsx'
import SearchResults from './components/SearchResults.tsx'
import Success from './components/Success.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <div>URL not found</div>,
    children: [
      {
        path: "/",
        element: <ProductList/>
      },
      {
        path: "/signup",
        element: <SignUpForm/>
      },
      {
        path: "/signin",
        element: <SignInForm />
      },
      {
        path: "/admin",
        element: <AdminLogin/>
      },
      {
        path: "/product",
        element: <Product/>
      },
      {
        path: "/payment",
        element: <Payment/>
      },
      {
        path: "/orders",
        element: <MyOrders/>
      },
      {
        path: "/category",
        element: <Category/>
      },
      {
        path: "/cart",
        element: <Cart/>
      },
      {
        path: "/search",
        element: <SearchResults/>
      }
    ]
  },
  {
    path: "/payment-success",
    element: <Success/>
  },
  {
    path: "/admin",
    element: <Dashboard />,
    errorElement: <div>URL not found.</div>,
    children: [
      {
        path: "/admin/products",
        element: <Products/>
      },
      {
        path: "/admin/users",
        element: <Users/>
      },
      {
        path: "/admin/orders",
        element: <Orders/>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router}/>
      </ChakraProvider>
  </React.StrictMode>,
)
