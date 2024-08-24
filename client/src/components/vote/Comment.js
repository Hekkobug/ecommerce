import React, { memo } from 'react'
import moment from 'moment'
import {renderStartFromNumber} from "ultils/helper";
import avatar from 'assets/avatar_default.png'
const Comment = ({image = avatar,name='Anonymus',updatedAt,comment,star}) => {
  return (
    <div className='flex gap-4'>
      <div className='flex-none'>
        <img src={image} alt='avatar' className='w-[48px] h-[48px] object-cover rounded-full'/>
      </div>
      <div className='flex flex-col flex-auto'>
        <div className='flex justify-between items-center'>
            <h3>{name}</h3>
            <span className='text-sm italic'>{moment(updatedAt)?.fromNow()}</span>
        </div>
        <div className='flex flex-col gap-2 pl-4 mt-4 border border-main bg-pink-50'>
            <span className='flex items-center gap-1'>
                <span className='font-semibold'>Vote:</span>
                <span className="flex items-center gap-1">
                  {renderStartFromNumber(star)?.map((el, index) => (
                    <span key={index}>{el}</span>
                  ))}
                </span>
            </span>
            <span className='flex gap-1'>
                <span className='font-semibold'>Comment:</span>
                <span className="flex items-center gap-1">{comment}</span>
            </span>
        </div>
      </div>
    </div>
  )
}

export default memo(Comment)
