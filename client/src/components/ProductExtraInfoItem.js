import React from 'react'

const ProductExtraInfoItem = ({icon,title,sub}) => {
  return (
    <div className='flex items-center p-3 gap-4 mb-[10px] border bg-main'>
      <span className='p-2 bg-main rounded-full flex items-center justify-center text-white text-[22px]'>{icon}</span>
      <div className='flex flex-col text-sm text-white'>
          <span className='font-medium'>{title}</span>
          <span className='text-xs'>{sub}</span>
      </div>
    </div>
  )
}

export default ProductExtraInfoItem
