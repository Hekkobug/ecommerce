import React, { memo } from "react";

const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity }) => {
  return (
    <div className="flex items-center gap-2">
      <span
        onClick={() => handleChangeQuantity("minus")}
        className="p-2 border-r border-purple-700 cursor-pointer text-main"
      >
        -
      </span>
      <input
        className="py-2 outline-none w-[50px] text-pink-500 text-center"
        type="number"
        value={quantity}
        onChange={(e) => handleQuantity(e.target.value)}
        min="1"
      />
      <span
        onClick={() => handleChangeQuantity("plus")}
        className="p-2 border-l border-purple-700 cursor-pointer text-main"
      >
        +
      </span>
    </div>
  );
};

export default memo(SelectQuantity);
