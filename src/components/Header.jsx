import React from "react"
import '../styles/Header.css'
import { Link } from "react-router-dom"
import { Logo } from "./Logo"

const Header = () => {
    const isLoggedIn = () => {
        return !!localStorage.getItem('authToken');
    };

    return (
        <header>
            <Logo />
            <div className="header-items">
                <div>Slots</div>
                <div>Gacha</div>
                {isLoggedIn ? (<div>Quests</div>) : (<div>LogIn</div>)}
                {/* <Link to={'/signin'}>SignIn</Link> */}
            </div>
        </header>
    )
}

export default Header;