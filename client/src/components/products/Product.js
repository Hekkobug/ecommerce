import React, { memo, useState } from "react";
import { formatMoney, renderStartFromNumber } from "ultils/helper";
import label from "assets/label.png";
import icons from "ultils/icons";
import { Link } from "react-router-dom";
import SelectOption from "components/search/SelectOption";
import withBaseComponent from "hocs/withBaseComponent";
const { FaEye, IoIosMenu, FaHeart } = icons;

const Product = ({ productData, isNew, normal,navigate }) => {
  const [isShowOption, setIsShowOption] = useState(false);
  const handleClickOptions = (e,flag) => {
    e.stopPropagation()
    if(flag === 'MENU') navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)
      if(flag === 'WISHLIST') console.log('WISHLIST')
        if(flag === 'QUICK_VIEW') console.log('WISHLIST')
  }
  
  return (
    <div className="w-full flex-auto text-base px-[10px]">
      <div
        className="w-full border p-[15px] flex-flex-col items-center"
        onClick={e => navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${
          productData?.title
        }`)}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setIsShowOption(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setIsShowOption(false);
        }}
      >
        <div className="w-full relative">
          {isShowOption && (
            <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
              <span onClick={(e) => handleClickOptions(e,'QUICK_VIEW')}><SelectOption icon={<FaHeart color="purple" />} /></span>
              <span onClick={(e) => handleClickOptions(e,'MENU')}><SelectOption icon={<IoIosMenu color="purple" />} /></span>
              <span onClick={(e) => handleClickOptions(e,'WISHLIST')}><SelectOption icon={<FaEye color="purple" />} /></span>
            </div>
          )}
          <img
            src={productData?.thumb || ""}
            alt="https://conversion.mycareersfuture.gov.sg/Portal/img/ImageNotFound.jpg?1458"
            className="w-[274px] h-[274px] object-cover"
          />
          {!normal && (
            <>
              <img
                src={label}
                alt=""
                className="absolute top-[-20px] left-[-19px] w-[70px] h-[56px] object-cover"
              />
              {isNew ? (
                <span className="font-bold top-[-5px] left-[-1px] text-pink-300 absolute">
                  New
                </span>
              ) : (
                <span className="font-bold top-[-5px] left-[2px] text-pink-300 absolute">
                  Hot
                </span>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col gap-1 mt-[15px] items-start w--full ">
          <span className="flex h-4">
            {renderStartFromNumber(productData?.totalRatings)?.map(
              (el, index) => (
                <span key={index}>{el}</span>
              )
            )}
          </span>
          <span className="line-clamp-1">{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VND`}</span>
        </div>
      </div>
    </div>
  );
};

export default withBaseComponent(memo(Product));
