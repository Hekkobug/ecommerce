import React, { memo } from "react";
import { formatMoney, renderStartFromNumber } from "../../ultils/helper";
import withBaseComponent from "hocs/withBaseComponent";

const ProductCard = ({ price, totalRatings, title, thumb, image,pid,navigate,caterogy }) => {
  return (
    <div onClick={() =>
      navigate(
        `/${caterogy?.toLowerCase()}/${pid}/${title}`
      )
    } className="w-1/3 cursor-pointer flex-auto px-[10px] mb-[20px]">
      <div className="flex w-full border">
      <img src={image} alt="products" className="w-[120px] object-contain p-4" />
      <div className="flex flex-col gap-1 mt-[15px] items-start  w-full text-xs ">
        <span className="line-clamp-1 capitalize text-sm">{title?.toLowerCase()}</span>
        <span className="flex h-4">{renderStartFromNumber(totalRatings, 14)?.map((el,index) =>(
          <span key={index}>{el}</span>
        ))}</span>
        <span>{`${formatMoney(price)} VND`}</span>
      </div>
      </div>
    </div>
  );
};

export default withBaseComponent(memo(ProductCard));
