import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Login,
  Home,
  Public,
  Blogs,
  Services,
  FAQ,
  Products,
  DetailProduct,
  FinalRegister,
  ResetPassword,
  DetailCart,
} from "./pages/public";
import path from "./ultils/path";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "./store/app/asyncAction";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Cart, Modal } from "./components";
import { AdminLayout, CreateProducts, Dashboad, ManageOrder, ManageProducts, ManageUser } from "pages/admin";
import { Checkout, History, MemberLayout, MyCart, Personal, Wishlist } from "pages/member";
import { showCart } from "store/app/appSlice";

function App() {
  const dispatch = useDispatch();
  const {isShowModal,modalChildren,isShowCart} = useSelector(state => state.app)
  useEffect(() => {
    dispatch(getCategories());
  }, []);
  return (
    <div className="font-main h-screen">
    {isShowCart && <div onClick={() => dispatch(showCart())} className="absolute inset-0 bg-overlay z-50 flex justify-end">
      <Cart/>
    </div>}
    {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        <Route path={path.CHECKOUT} element={<Checkout />} />
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOG} element={<Blogs />} />
          <Route path={path.OUT_SERVICE} element={<Services />} />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route
            path={path.DETAIL_PRODUCT_CATEGORY_PID_TITLE}
            element={<DetailProduct />}
          />
          <Route path={path.PRODUCT_CATEGORY} element={<Products />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={path.ALL} element={<Home />} />
        </Route>
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={<Dashboad />}/>
          <Route path={path.MANAGE_PRODUCTS} element={<ManageProducts />}/>
          <Route path={path.MANAGE_USER} element={<ManageUser />}/>
          <Route path={path.MANAGE_ORDER} element={<ManageOrder />}/>
          <Route path={path.CREATE_PRODUCTS} element={<CreateProducts />}/>
        </Route>
        <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />}/>
          <Route path={path.MY_CART} element={<DetailCart />}/>
          <Route path={path.WISHLIST} element={<Wishlist />}/>
          <Route path={path.HISTORY} element={<History />}/>
        </Route>
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
        <Route path={path.LOGIN} element={<Login />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <ToastContainer />
    </div>
  );
}

export default App;
