import { useState } from "react";
import Capthca from "../components/Captcha";
import LogInForm from "../components/LogInForm";
import RegistrationForm from "../components/RegistrationForm";
import "../styles/SignIn.css";

const SignIn = () => {
    const [activeForm, setActiveForm] = useState('login');
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isCaptchaVerified) {
            alert('Please verify you are not a robot');
            return;
        }
        if (activeForm === 'login') {
            // Handle login submission
            
        }
        else {
            // Handle registration submission
        }
    };

    return (
        <div className="sign-in-container">
            <div className="form-switcher">
                <button 
                    className={activeForm === 'login' ? 'active' : ''}
                    onClick={() => setActiveForm('login')}
                >
                    Login
                </button>
                <button 
                    className={activeForm === 'register' ? 'active' : ''}
                    onClick={() => setActiveForm('register')}
                >
                    Register
                </button>
            </div>

            {activeForm === 'login' ? (
                <LogInForm />
            ) : (
                <RegistrationForm />
            )}

            <Capthca onVerification={() => setIsCaptchaVerified(true)} />

            <button 
                className="submit-button" 
                onClick={handleSubmit}
                disabled={!isCaptchaVerified}
            >
                {activeForm === 'login' ? 'Log In' : 'Register'}
            </button>
        </div>
    ) 
}
export default SignIn;