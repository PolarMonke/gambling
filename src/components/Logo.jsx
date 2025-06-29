import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import logoDefault from "../assets/logo.png";
import logoJune from "../assets/logo_june.png";
import "../styles/Logo.css";

export const Logo = () => {
    const [logo, setLogo] = useState(logoDefault);
    useEffect(() => {
        if (new Date().getMonth() === 5) {
            setLogo(logoJune);
        }
    }, [])
    return (
        <Link to={"/"} className="logo">
            <img src={logo} alt="logo" />
        </Link>
    );
}