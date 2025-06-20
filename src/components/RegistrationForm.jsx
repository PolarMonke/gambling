import { useState } from "react";
import "../styles/RegistrationForm.css";
import { useTranslation } from 'react-i18next';

const RegistrationForm = ({ setFormData }) => {
    const { t } = useTranslation();
    const [localError, setLocalError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <form className="registration-form">
            <div className="form-group">
                <label>{t('Username')}</label>
                <input
                    type="text"
                    name="username"
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>{t('Email')}</label>
                <input
                    type="email"
                    name="email"
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>{t('Password')}</label>
                <input
                    type="password"
                    name="password"
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>{t('Confirm Password')}</label>
                <input
                    type="password"
                    name="confirmPassword"
                    onChange={handleInputChange}
                    required
                />
            </div>
            {localError && <div className="error-message">{localError}</div>}
        </form>
    );
};
export default RegistrationForm;