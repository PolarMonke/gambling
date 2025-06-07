import { useState } from "react";
import Capthca from "../components/Captcha";
import LogInForm from "../components/LogInForm";
import RegistrationForm from "../components/RegistrationForm";
import "../styles/SignIn.css";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
    const [activeForm, setActiveForm] = useState('login');
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({}); // Store form data in SignIn
    const navigate = useNavigate();

    const handleFormSwitch = (formType) => {
        setActiveForm(formType);
        setFormData({});
    };

    const handleRegister = async () => {
        if (!isCaptchaVerified) {
            setError('Please verify you are not a robot');
            return;
        }
        setIsLoading(true);
        setError('');

        console.log("Registering with data:", formData);

        try {
            const response = await fetch('http://localhost:5062/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Login: formData.username,
                    Email: formData.email,
                    Password: formData.password
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            alert('Registration successful! You can now log in.');
            setActiveForm('login');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!isCaptchaVerified) {
            setError('Please verify you are not a robot');
            return;
        }

        setIsLoading(true);
        setError('');

        console.log("Logging in with data:", formData);

        try {
            const response = await fetch('http://localhost:5062/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Login: formData.username,
                    Password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('authToken', data.token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="sign-in-container">
            <div className="form-switcher">
                <button 
                    className={activeForm === 'login' ? 'active' : ''}
                    onClick={() => handleFormSwitch('login')}
                >
                    Login
                </button>
                <button 
                    className={activeForm === 'register' ? 'active' : ''}
                    onClick={() => handleFormSwitch('register')}
                >
                    Register
                </button>
            </div>

            {activeForm === 'login' ? (
                <LogInForm setFormData={setFormData} />
            ) : (
                <RegistrationForm setFormData={setFormData} />
            )}

            <Capthca onVerification={() => setIsCaptchaVerified(true)} />

            <button 
                className="submit-button" 
                onClick={activeForm === 'login' ? handleLogin : handleRegister}
                disabled={!isCaptchaVerified || isLoading}
            >
                {isLoading ? (
                    <>
                        <span className="spinner"></span>
                        Processing...
                    </>
                ) : activeForm === 'login' ? 'Log In' : 'Register'}
            </button>
        </div>
    );
};
export default SignIn;
