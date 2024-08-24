import React, { memo } from "react";

const SelectOption = ({ icon }) => {
  return (
    <div className="w-10 h-10 bg-pink-200 rounded-full border shadow-md flex items-center justify-center hover:bg-pink-400 hover:text-white cursor-pointer">
      {icon}
    </div>
  );
};

export default memo(SelectOption);
