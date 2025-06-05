import { useState } from "react";
import "../styles/LogInForm.css";

const LogInForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value
        });
    };
  
    return (
        <form className="login-form">
            <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
            </div>
            {error && <div className="error-message">{error}</div>}
        </form>
    )
}
export default LogInForm;