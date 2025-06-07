import { useState } from "react";
import "../styles/RegistrationForm.css";

const RegistrationForm = ({ setFormData }) => {
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
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Confirm Password</label>
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