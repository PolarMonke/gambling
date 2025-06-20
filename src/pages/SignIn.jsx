import { useState } from "react";
import Capthca from "../components/Captcha";
import LogInForm from "../components/LogInForm";
import RegistrationForm from "../components/RegistrationForm";
import "../styles/SignIn.css";
import { useNavigate } from "react-router-dom";
import { api } from '../api/mockApi';
import { useTranslation } from 'react-i18next';

const SignIn = () => {
    const { t } = useTranslation();
    const [activeForm, setActiveForm] = useState('login');
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({});
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
            const data = await api.register({
            Login: formData.username,
            Email: formData.email,
            Password: formData.password
            });
            alert('Registration successful! You can now log in.');
            setActiveForm('login');
        } catch (err) {
            setError(err.message);
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
            const data = await api.login({
            Login: formData.username,
            Password: formData.password
            });
            localStorage.setItem('authToken', data.token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="sign-in-container">
            <div className="form-switcher">
                <button 
                    className={activeForm === 'login' ? 'active' : ''}
                    onClick={() => handleFormSwitch('login')}
                >
                    {t('Login')}
                </button>
                <button 
                    className={activeForm === 'register' ? 'active' : ''}
                    onClick={() => handleFormSwitch('register')}
                >
                    {t('Register')}
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
                        {t('Processing...')}
                    </>
                ) : activeForm === 'login' ? 'Log In' : 'Register'}
            </button>
        </div>
    );
};
export default SignIn;
