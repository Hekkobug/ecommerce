import React, { Fragment, memo, useState } from "react";
import logo from "assets/logo_admin.png";
import { adminSidebar } from "ultils/contants";
import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import { FaCaretDown,FaCaretRight  } from "react-icons/fa";

const activedStyle = "px-4 py-2 flex items-center gap-2 bg-purple-500";
const notActivedStyle = "px-4 py-2 flex items-center gap-2 hover:bg-pink-400";
const AdminSidebar = () => {
    const [actived,setActived] = useState([])
    const handleShowTabs = (tabID) => {
      if(actived.some(el => el === tabID)) setActived(prev => prev.filter(el => el!== tabID))
    else setActived(prev => [...prev, tabID])
    }
    
  return (
    <div className=" bg-pink-600 h-full py-4">
      <Link to={'/'} className="flex flex-col justify-center items-center p-4 gap-2">
        <img src={logo} alt="logo_admin" className="w-[200px] object-contain" />
        <smail>Admin WorkSpace</smail>
      </Link>
      <div>
        {adminSidebar.map((el) => (
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
              <div onClick={() => handleShowTabs(+el.id)} className="flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 hover:bg-pink-400 cursor-pointer">
                  <div className="flex items-center gap-2">
                  <span>{el.icon}</span>
                  <span>{el.text}</span>
                  </div>
                  {actived.some(id => id === el.id) ? <FaCaretRight/> : <FaCaretDown/>}
                </div>
                {actived.some(id => +id === +el.id) && <div className="flex flex-col">
                  {el.submenu.map((item) => (
                    <NavLink
                      key={el.text}
                      to={item.path}
                      onClick={e => e.stopPropagation()}
                      className={({ isActive }) =>
                        clsx(
                          isActive && activedStyle,
                          !isActive && notActivedStyle,
                          'pl-8'
                        )
                      }
                    >
                      {item.text}
                    </NavLink>
                  ))}
                </div>}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(AdminSidebar);
