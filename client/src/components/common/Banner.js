import React, { memo } from 'react'

const Banner = () => {
  return (
    <div className='w-full'>
      <img
        src='https://w.ladicdn.com/s750x550/5f4f8b720a159f159467de0a/01600x950_t8-20240731022858-i2sos.png'
        alt='banner'
        style={{height: '400px' }}
        className='object-fill w-full'
      />
    </div>
  )
}

export default memo(Banner)
