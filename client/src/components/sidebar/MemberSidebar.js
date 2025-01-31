import React, { Fragment, memo, useState } from "react";
import logo from "assets/logo_admin.png";
import { memberSidebar } from "ultils/contants";
import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import avatar from "assets/avatar_default.png";
import { IoReturnDownBack } from "react-icons/io5";

const activedStyle = "px-4 py-2 flex items-center gap-2 bg-purple-500";
const notActivedStyle = "px-4 py-2 flex items-center gap-2 hover:bg-pink-400";
const MemberSidebar = () => {
  const [actived, setActived] = useState([]);
  const { current } = useSelector((state) => state.user);
  const handleShowTabs = (tabID) => {
    if (actived.some((el) => el === tabID))
      setActived((prev) => prev.filter((el) => el !== tabID));
    else setActived((prev) => [...prev, tabID]);
  };

  return (
    <div className=" bg-lime-300 h-full-screen py-4 w-[250px] flex-none">
      <div className="w-full flex flex-col items-center justify-center py-4">
        <img
          src={current?.avatar || avatar}
          alt="logo_admin"
          className="w-16 h-16 object-cover"
        />
        <smail>{`${current.lastname} ${current.firstname}`}</smail>
      </div>
      <div>
        {memberSidebar.map((el) => (
          <Fragment key={el.id}>
            {el.type === "SINGLE" && (
              <NavLink
                to={el.path}
                className={({ isActive }) =>
                  clsx(isActive && activedStyle, !isActive && notActivedStyle)
                }
              >
                <span>{el.icon}</span>
                <span>{el.text}</span>
              </NavLink>
            )}
            {el.type === "PARENT" && (
              <div
                onClick={() => handleShowTabs(+el.id)}
                className="flex flex-col"
              >
                <div className="flex items-center justify-between px-4 py-2 hover:bg-orange-400 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span>{el.icon}</span>
                    <span>{el.text}</span>
                  </div>
                  {actived.some((id) => id === el.id) ? (
                    <FaCaretRight />
                  ) : (
                    <FaCaretDown />
                  )}
                </div>
                {actived.some((id) => +id === +el.id) && (
                  <div className="flex flex-col">
                    {el.submenu.map((item) => (
                      <NavLink
                        key={el.text}
                        to={item.path}
                        onClick={(e) => e.stopPropagation()}
                        className={({ isActive }) =>
                          clsx(
                            isActive && activedStyle,
                            !isActive && notActivedStyle,
                            "pl-8"
                          )
                        }
                      >
                        {item.text}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Fragment>
        ))}
        <NavLink className={clsx(notActivedStyle)} to={"/"}><IoReturnDownBack size={25}/>Go home</NavLink>
      </div>
    </div>
  );
};

export default memo(MemberSidebar);
