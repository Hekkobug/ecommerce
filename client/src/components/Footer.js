import React, { memo } from "react";
import icons from "../ultils/icons";
const {MdEmail} = icons

const Footer = () => {
  return (
    <div className="w-full">
      <div className="h-[103px] bg-main w-full flex items-center justify-center">
        <div className="w-main flex items-center justify-between">
          <div className="flex flex-col flex-1">
            <span className="text-[20px] text-white">
              Sign up to Newsletter
            </span>
            <smail className="text-[13px] text-pink-300">
              Subscribe now and receive weekly newsletter
            </smail>
          </div>
          <div className="flex-1 flex items-center">
          <input
            type="text"
            className="p-4 pr-0 rounded-l-full w-full bg-white outline-none text-pink-300 placeholder:text-sm placeholder:text-pink-100 placeholder:italic"
            placeholder="Email Address"
          />
          <div className="w-[56px] h-[56px] bg-white rounded-r-full flex items-center justify-center text-pink-300">
            <MdEmail size={18}/>
          </div>
          </div>
        </div>
      </div>
      <div className="h-[407px] bg-pink-300 w-full flex items-center justify-center text-purple-700 text-[13px]">
        <div className="w-main flex">
            <div className="flex-2 flex flex-col gap-2">
                <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">ABOUT US</h3>
                <span>
                    <span>Address: </span>
                    <span className="opacity-70">10A1 Ngõ 49 Linh Lang, Ba Đình</span>
                </span>
                <span>
                    <span> Phone: </span>
                    <span className="opacity-70">02871081881</span>
                </span>
                <span>
                    <span>Mail: </span>
                    <span className="opacity-70">sales@thenewxgear.com</span>
                </span>
            </div>
            <div className="flex-1 flex flex-col gap-2">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">INFORMATION</h3>
                <span>Typography</span>
                <span>Gallery</span>
                <span>Store Location</span>
                <span>Today's Deals</span>
                <span>Contact</span>
            </div>
            <div className="flex-1 flex flex-col gap-2">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">WHO WE ARE</h3>
                <span>Help</span>
                <span>Free Shipping</span>
                <span>FAQs</span>
                <span>Return & Exchange</span>
                <span>Testimonials</span>
            </div>
            <div className="flex-1 flex flex-col gap-2">
            <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">#XGEAR</h3>
            </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Footer);
