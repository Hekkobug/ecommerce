import { MemberSidebar } from 'components'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import path from 'ultils/path'

const MemberLayout = () => {
  const {isLoggedIn,current} = useSelector(state => state.user)
  if(!isLoggedIn || !current) return <Navigate to={`/${path.LOGIN}`} replace={true}/>  
  return (
    <div className='flex'>
    <MemberSidebar/>
      <div className='flex-auto bg-cyan-300 min-h-screen'>
      <Outlet/>
      </div>
    </div>
  )
}

export default MemberLayout
