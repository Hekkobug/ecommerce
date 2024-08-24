import React, { memo, useEffect, useRef } from 'react'
import { AiFillStar } from 'react-icons/ai'

const Votebar = ({ number, ratingCount, ratingTotal }) => {
  const percentRef = useRef(null)

  useEffect(() => {
    if (percentRef.current) {
      const percent = Math.round(ratingCount * 100 / ratingTotal) || 0
      percentRef.current.style.cssText = `right: ${100 - percent}%`
    }
  }, [ratingCount, ratingTotal])

  return (
    <div className='flex items-center gap-2 text-sm text-main'>
      <div className='flex w-[10%] items-center justify-center gap-1 text-sm'>
        <span>{number}</span>
        <AiFillStar color='purple' />
      </div>
      <div className='w-[75%]'>
        <div className='w-full h-[6px] relative rounded-l-full rounded-r-full bg-pink-100'>
          <div ref={percentRef} className='absolute inset-0 bg-main'></div>
        </div>
      </div>
      <div className='w-[15%] justify-end text-xs text-400'>{`${ratingCount || 0} reviewers`}</div>
    </div>
  )
}

export default memo(Votebar)
