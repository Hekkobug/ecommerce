import React, { memo } from 'react'

const Button = ({ children, handleOnClick, style, fw, type = 'button', disabled = false }) => {
  return (
    <button
      type={type}
      disabled={disabled} // Thêm thuộc tính disabled
      className={`${style ? style : `px-4 py-2 rounded-md text-white bg-main text-semibold my-2 ${fw ? 'w-full' : 'w-fit'}`} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} // Thêm class cho trạng thái disabled
      onClick={() => { !disabled && handleOnClick && handleOnClick() }} // Ngăn sự kiện onClick khi disabled
    >
      {children}
    </button>
  )
}

export default memo(Button)
