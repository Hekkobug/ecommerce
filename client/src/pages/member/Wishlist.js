import { Button, Product } from 'components'
import React from 'react'
import { useSelector } from 'react-redux'

const Wishlist = () => {
  const {current} = useSelector((s) => s.user)
  return (
    <div className='w-full relative px-4'>
      <header className="text-3xl font-semibold text-pink-500 py-4 border-b border-b-main">
        My Wishlist
      </header>
      <div className='p-4 w-full flex flex-wrap gap-4'>
          {current?.wishlist?.map((el) => (
            <div className='bg-white rounded-md w-[300px] drop-shadow flex flex-col py-3 gap-3' key={el._id}>
              <Product pid={el._id} productData={el} className="bg-white"/>
              {/* <div className='px-3'>
              <Button>Add to Cart</Button>
              </div> */}
            </div>
          ))}
      </div>
    </div>
  )
}

export default Wishlist
