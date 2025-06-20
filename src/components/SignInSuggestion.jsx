import "../styles/SignInSuggestion.css"
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const SignInSuggestion = () => {
    const { t } = useTranslation();
    return (
        <div className="sign-in-suggestion">
            <img src="src/assets/chips.png" className="decoration chips" />

            <div className="block">
                <div>{t('BEGIN YOUR GAMBLING CAREER NOW!')}</div>
                <Link to={"/signin"}><button>{t('SIGN IN')}</button></Link>
            </div>

            <img src="src/assets/chips.png" className="decoration chips" />
        </div>
    )
}

export default SignInSuggestion;