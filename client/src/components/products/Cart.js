import Button from 'components/buttons/Button';
import withBaseComponent from 'hocs/withBaseComponent';
import React, { memo } from 'react'
import { IoMdClose } from "react-icons/io";
import { useSelector } from 'react-redux';
import { showCart } from 'store/app/appSlice';
import { formatMoney } from 'ultils/helper';
import { ImBin } from "react-icons/im";
import { getCurrent } from 'store/user/asyncAction';
import { toast } from 'react-toastify';
import { apiRemoveCart } from 'apis';
import path from 'ultils/path';

const Cart = ({dispatch,navigate}) => {
    const {currentCart} = useSelector(state => state.user)
    const removeCart = async(pid,color) => {
        const response = await apiRemoveCart(pid,color)
        if(response.success){
          dispatch(getCurrent())
          console.log(currentCart)
        }
          else toast.error(response.mes)
    }
  return (
    <div onClick={e => e.stopPropagation()} className='w-[400px] h-screen overflow-y-auto grid grid-rows-10 bg-pink-700 text-white p-6'>
      <header className='border-b border-purple-300 flex items-center justify-between row-span-1 h-full font-bold text-2xl'>
        <span>Your Cart</span>
        <span onClick={() => dispatch(showCart())} className='cursor-pointer p-2'><IoMdClose size={24}/></span>
      </header>
      <section className='row-span-7 gap-3 flex flex-col h-full max-h-full overflow-y-auto p-3'>
        {!currentCart && <span className='text-xs italic'>Your cart is empty.</span>}
        {currentCart && currentCart?.map(el => (
            <div key={el._id} className='flex gap-2 justify-between items-center'>
                <div className='flex gap-2'>
                <img src={el?.product?.thumb} alt='thumb' className='w-16 h-16 object-cover'/>
                <div className='flex flex-col gap-1'>
                    <span className='text-sm text-purple-300'>{el?.product?.title}</span>
                    <span className='text-[10px]'>{el.color}</span>
                    <span className='text-[10px]'>{`Quanntity: ${el.quantity}`}</span>
                    <span className='text-sm'>{formatMoney(el?.product?.price) + ' VNĐ'}</span>
                </div>
                </div>
                <span onClick={() => removeCart(el.product?._id,el.color)} className='h-8 w-8 flex items-center justify-center rounded-full hover:bg-main cursor-pointer'><ImBin size={20}/></span>
            </div>
        ))}
      </section>
      <div className='row-span-2 flex flex-col justify-between h-full'>
        <div className='flex items-center justify-between pt-4 border-t'>
            <span>Subtotal:</span>
            <span>{formatMoney(currentCart?.reduce((sum,el) => sum + Number(el.product?.price) * el.quantity,0)) + ' VNĐ'}</span>
        </div>
        <span className='text-center text-purple-300 italic text-xs'>Shipping, taxes, and discounts calculated at checkout.</span>
        <Button handleOnClick={() => {
            dispatch(showCart())
            navigate(`/${path.MEMBER}/${path.DETAIL_CART}`)
        }} style='rounded-none w-full bg-main py-3'>Shopping Cart</Button>
      </div>
    </div>
  )
}

export default withBaseComponent(memo(Cart))
