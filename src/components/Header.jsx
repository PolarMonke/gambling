import React from "react"
import '../styles/Header.css'
import { Link } from "react-router-dom"

const Header = () => {
    return (
        <header>
            <Link to={"/"}><img src="src/assets/logo.svg" alt="logo" /></Link>
            <div className="header-items">
                <div>Slots</div>
                <div>Gacha</div>
                <div>Quests</div>
            </div>
        </header>
    )
}

export default Header;