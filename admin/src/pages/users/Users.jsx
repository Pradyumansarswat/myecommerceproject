import React from 'react'
import UsersData from '../../components/userdata/UsersData'

const Users = () => {
  return (
    <main className='flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen'>
      <header className='bg-white shadow-md p-4 sticky top-0 z-10'>
        <h1 className='text-2xl font-bold text-gray-800'>Users</h1>
      </header>
      <div className='flex-grow p-4 sm:p-6 md:p-8'>
        <UsersData />
      </div>
    </main>
  )
}

export default Users
