import React, { memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import path from "ultils/path";
import { useDispatch, useSelector } from "react-redux";
import { getCurrent } from "store/user/asyncAction";
import icons from "ultils/icons";
import { clearMessage, logout } from "store/user/userSlice";
import Swal from "sweetalert2";

const {CiLogout} = icons

const TopHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, current,mes } = useSelector((state) => state.user);

  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn) dispatch(getCurrent());
    },300)
    return () => {
      clearTimeout(setTimeoutId)
    }
  }, [dispatch, isLoggedIn]);
  useEffect(() => {
    if(mes) Swal.fire('Oops!',mes,'info').then(() => {
      dispatch(clearMessage())
      navigate(`/${path.LOGIN}`)
    })
  },[])
  return (
    <div className="h-[38px] w-full bg-main flex items-center justify-center">
      <div className="w-main flex items-center justify-between text-xs text-white">
        <span>ORDER ONLINE OR CALL US 02871081881</span>
        {isLoggedIn && current ? (
          <div className="flex gap-2 text-sm items-center">
          <span>{current ? `Welcome, ${current.lastname} ${current.firstname}` : 'Loading...'}</span>
            <span onClick={() => dispatch(logout())} className="hover:rounded-full hover:bg-pink-500 cursor-pointer hover:text-main p-2"><CiLogout size={18}/></span>
          </div>
        ) : (
          <Link className="hover:text-pink-300" to={`/${path.LOGIN}`}>
            Sign In or Create Account
          </Link>
        )}
      </div>
    </div>
  );
};

export default memo(TopHeader);
