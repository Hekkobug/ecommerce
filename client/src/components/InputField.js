import React from "react";

const InputField = ({
  value,
  setValue,
  nameKey,
  type = "text",
  invalidFields,
  setInvalidFields,
}) => {

    const labelText = nameKey ? nameKey.charAt(0).toUpperCase() + nameKey.slice(1) : "";

    return (
      <div className="w-full flex flex-col mb-2 relative">
        {value.trim() !== '' && (
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
          className="px-4 py-2 rounded-sm w-full my-2 placeholder:text-sm placeholder:italic outline-none"
          placeholder={labelText}
          value={value}
          onChange={e => setValue(prev => ({...prev, [nameKey]: e.target.value}))}
          onFocus={() => setInvalidFields([])}
        />
        {invalidFields?.some(el => el.name === nameKey) && <smail className='text-main italic'>{invalidFields.find(el => el.name === nameKey)?.mes}</smail>}
      </div>
    );
};

export default InputField;
