import "../styles/SignInSuggestion.css"
import { Link } from "react-router-dom";

const SignInSuggestion = () => {
    return (
        <div className="sign-in-suggestion">
            <img src="src/assets/chips.png" className="decoration chips" />

            <div className="block">
                <div>BEGIN YOUR GAMBLING CAREER NOW!</div>
                <Link to={"/signin"}><button>SIGN IN</button></Link>
            </div>

            <img src="src/assets/chips.png" className="decoration chips" />
        </div>
    )
}

export default SignInSuggestion;