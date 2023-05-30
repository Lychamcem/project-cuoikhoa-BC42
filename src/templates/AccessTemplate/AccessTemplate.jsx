import React from 'react'
import { Outlet } from 'react-router-dom'

function AccessTemplate() {
  return (
    <div className='w-full grid grid-cols-12' style={{
      height: '100vh'
    }}>
      <div className='col-span-5 w-full h-full flex justify-center items-center' style={{
        background: '#1677ff'
      }}>
        <img src={require("../../assets/logo-access-template.png")} alt='logo' style={{
          width: '80%'
        }} />
      </div>
      <div className='col-span-7 w-full h-full flex justify-center items-center'>
        <Outlet />
      </div>
    </div>
  )
}

export default AccessTemplate