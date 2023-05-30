import React from 'react'
import { NavLink } from 'react-router-dom'

function PageNotFound() {
    return (
        <div className="not-found flex flex-col justify-center items-center w-full h-full">
            <img
                src={require(('../../assets/page-not-found.png'))}
                alt="not-found"
            />
            <NavLink to="/" className="link-home text-blue-500 underline">
                Go Home
            </NavLink>
        </div>
    )
}

export default PageNotFound