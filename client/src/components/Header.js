import React from "react";
import logo from "../assets/logo.png";
import icons from "../ultils/icons";
import { Link } from "react-router-dom";
import path from "../ultils/path";

const { RiPhoneFill, MdEmail, FiShoppingCart, FaRegUser } = icons;

const Header = () => {
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
        <div className="flex cursor-pointer items-center justify-center px-6 gap-2">
          <FaRegUser className="text-purple-600" />
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
