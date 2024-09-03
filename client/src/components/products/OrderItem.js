import SelectQuantity from 'components/common/SelectQuantity';
import React, { memo, useEffect, useState } from 'react'
import { formatMoney } from "ultils/helper";
import { updateCart } from "store/user/userSlice";
import withBaseComponent from 'hocs/withBaseComponent';

const OrderItem = ({dispatch,color,dfQuantity=1,price,title,thumbnail,pid }) => {
  const [quantity,setQuantity] = useState(() => dfQuantity)
  const handleQuantity = (number) => {
    if(+number >1) setQuantity(number)
  }
    const handleChangeQuantity =(flag) => {
        setQuantity((prevQuantity) => {
          let newQuantity = parseInt(prevQuantity, 10);
          if (flag === "minus" && newQuantity === 1) return newQuantity;
          if (flag === "minus") newQuantity -= 1;
          if (flag === "plus") newQuantity += 1;
          return newQuantity;
        });
      }
      useEffect(() => {
    dispatch(updateCart({pid,quantity,color}))
      },[quantity])
  return (
    <div className="w-main mx-auto font-bold border-b py-3 grid grid-cols-10">
            <span className="col-span-6 w-full text-center">
            <div className='flex gap-2 px-4 py-3'>
                <img src={thumbnail} alt='thumb' className='w-28 h-28 object-cover'/>
                <div className='flex flex-col items-start gap-1'>
                    <span className='text-sm text-purple-500'>{title}</span>
                    <span className='text-[10px] font-main'>{color}</span>
                </div>
                </div>
            </span>
            <span className="col-span-1 w-full text-center">
                <div className="flex items-center h-full">
                <SelectQuantity
                quantity={quantity}
                handleChangeQuantity={handleChangeQuantity}
                handleQuantity={handleQuantity}
              />
                </div>
            </span>
            <span className="col-span-3 w-full h-full flex items-center justify-center text-center">
            <span className='text-lg'>{formatMoney(price * quantity) + ' VNĐ'}</span>
            </span>
      </div>
  )
}

export default withBaseComponent(memo(OrderItem))
