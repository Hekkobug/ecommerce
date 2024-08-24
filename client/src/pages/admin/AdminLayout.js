import { AdminSidebar } from 'components'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import path from 'ultils/path'

const AdminLayout = () => {
  const {isLoggedIn,current} = useSelector(state => state.user)
  if(!isLoggedIn || !current || +current.role !== 777) return <Navigate to={`/${path.LOGIN}`} replace={true}/>  

  return (
    <div className='flex w-full bg-pink-700 min-h-screen relative text-white'>
      <div className='w-[327px] flex-none fixed top-0 bottom-0'>
        <AdminSidebar/>
      </div>
      <div className='w-[327px]'></div>
      <div className='flex-auto'>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
