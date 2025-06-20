import { useState } from "react";
import "../styles/LogInForm.css";
import { useTranslation } from 'react-i18next';

const LogInForm = ({ setFormData }) => {
    const { t } = useTranslation();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <form className="login-form">
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
                <label>{t('Password')}</label>
                <input
                    type="password"
                    name="password"
                    onChange={handleInputChange}
                    required
                />
            </div>
        </form>
    );
};
export default LogInForm;