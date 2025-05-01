import React from 'react'
import { Link } from 'react-router-dom'

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center text-sm max-md:px-4">
        <h1 className="text-8xl md:text-9xl font-bold text-indigo-500">403</h1>
        <div className="h-1 w-16 rounded bg-indigo-500 my-5 md:my-7"></div>
        <p className="text-sm md:text-base mt-4 text-gray-500 max-w-md text-center">You are not authorized to access this page!</p>
        <div className="flex items-center gap-4 mt-6">

            <Link className="bg-gray-800 px-7 py-2.5 text-white rounded-md active:scale-95 transition-all" to="/home">
            Return Home
            </Link>
                
            <a href="#" className="border border-gray-300 px-7 py-2.5 text-gray-800 rounded-md active:scale-95 transition-all">
                Contact support
            </a>
        </div>
    </div>
  )
}

export default Unauthorized