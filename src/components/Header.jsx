import React from "react"
import '../styles/Header.css'
import { Link } from "react-router-dom"

const Header = () => {
    const isLoggedIn = () => {
        return !!localStorage.getItem('authToken');
    };

    return (
        <header>
            <Link to={"/"}><img src="src/assets/logo.svg" alt="logo" /></Link>
            <div className="header-items">
                <div>Slots</div>
                <div>Gacha</div>
                {isLoggedIn ? (<div>Quests</div>) : (<div>LogIn</div>)}
            </div>
        </header>
    )
}

export default Header;