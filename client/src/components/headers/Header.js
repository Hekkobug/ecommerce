import React, { Fragment, memo, useEffect, useState } from "react";
import logo from "assets/logo.png";
import icons from "ultils/icons";
import { Link } from "react-router-dom";
import path from "ultils/path";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "store/user/userSlice";

const { RiPhoneFill, MdEmail, FiShoppingCart, FaRegUser } = icons;

const Header = () => {
  const { current } = useSelector((state) => state.user);
  const [isShowOption, setIsShowOption] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleClickoutOptions = (e) => {
      const profile = document.getElementById('profile')
      if(!profile?.contains(e.target)) setIsShowOption(false)
    }
    document.addEventListener("click", handleClickoutOptions);
    return () => {
      document.removeEventListener("click",handleClickoutOptions)
    }
    
  },[])
  return (
    <div className="w-main flex justify-between h-[110px] py-[35px]">
      <div className="mt-[-15px]">
        <Link to={`/${path.HOME}`}>
          <img
            src={logo}
            alt="logo"
            className="w-[75px] h-[75px] object-contain "
          ></img>
        </Link>
      </div>
      <div className="flex text-[13px] ">
        <div className="flex flex-col px-6 border-r items-center">
          <span className="flex gap-4 items-center">
            <RiPhoneFill className="text-purple-600" />
            <span className="font-semibold">Hotline</span>
          </span>
          <span>02871081881</span>
        </div>
        <div className="flex flex-col items-center px-6 border-r">
          <span className="flex gap-4 items-center">
            <MdEmail className="text-purple-600" />
            <span className="font-semibold">Email</span>
          </span>
          <span>sales@thenewxgear.com</span>
        </div>
        <div className="flex cursor-pointer items-center justify-center gap-2 px-6 border-r">
          <FiShoppingCart className="text-purple-600" />
          <span>0 item(s)</span>
        </div>
        {current && (
          <Fragment>
            <div
              className="flex cursor-pointer items-center justify-center px-6 gap-2 relative"
              onClick={() => setIsShowOption((prev) => !prev)}
              id="profile"
            >
              <FaRegUser className="text-purple-600" />
              <span>Profile</span>
              {isShowOption && <div onClick={e => e.stopPropagation()} className="absolute flex-col flex top-full left-[16px] bg-purple-300 border min-w-[150px] py-2">
                <Link
                  className="p-2 hover:bg-pink-200 w-full"
                  to={`/${path.MEMBER}/${path.PERSONAL}`}
                >
                  Personal
                </Link>
                {+current.role === 777 && (
                  <Link
                    className="p-2 hover:bg-pink-200 w-full"
                    to={`/${path.ADMIN}/${path.DASHBOARD}`}
                  >
                    Admin Workspace
                  </Link>
                )}
                <span
                  onClick={() => dispatch(logout())}
                  className="p-2 hover:bg-pink-200 w-full"
                >
                  Logout
                </span>
              </div>}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default memo(Header);
