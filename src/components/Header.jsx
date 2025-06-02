import React from "react"
import '../styles/Header.css'

const Header = () => {
    return (
        <header>
            <img src="src/assets/logo.svg" alt="logo" />
            <div className="header-items">
                <div>Slots</div>
                <div>Gacha</div>
                <div>Quests</div>
            </div>
        </header>
    )
}

export default Header;