import { clsx } from "clsx";
import React, { memo } from "react";

const InputField = ({
  value,
  setValue,
  nameKey,
  type = "text",
  invalidFields,
  setInvalidFields,
  style,
  fullWidth,
  placeholder,
  isShowLabel
}) => {

    const labelText = nameKey ? nameKey.charAt(0).toUpperCase() + nameKey.slice(1) : "";

    return (
      <div className={clsx("flex flex-col mb-2 relative",fullWidth && 'w-full')}>
        {!isShowLabel && value?.trim() !== '' && (
          <label
            className="text-[10px] absolute top-0 left-2 block text-main px-1 animate-slide-top-sm"
            htmlFor={nameKey}
          >
            {labelText}
          </label>
        )}
        <input
          type={type}
          id={nameKey}
          className={clsx("px-4 py-2 rounded-sm w-full my-2 placeholder:text-sm placeholder:italic outline-none",style)}
          placeholder={placeholder || nameKey?.slice(0,1).toUpperCase() + nameKey?.slice(1)}
          value={value}
          onChange={e => setValue(prev => ({...prev, [nameKey]: e.target.value}))}
          onFocus={() => setInvalidFields && setInvalidFields([])}
        />
        {invalidFields?.some(el => el.name === nameKey) && <smail className='text-main italic'>{invalidFields.find(el => el.name === nameKey)?.mes}</smail>}
      </div>
    );
};

export default memo(InputField);
