import React, { memo } from 'react'

const Countdown = ({unit, number}) => {
  return (
    <div className='w-[30%] h-[60px] flex justify-center items-center bg-pink-300 rounded-md text-white flex-col'>
      <span className='text-[18px]'>{number}</span>
      <span className='text-xs'>{unit}</span>
    </div>
  )
}

export default memo(Countdown)
