import Form from '../components/Form'
import React from 'react'
import { useNavigate} from 'react-router-dom'
import "../styles/Form.css"

function Login({ onLogin }) {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="login-form">
            <Form route="/api/token/" method="login" onLogin={onLogin} />
            <button className="button-register-account" onClick={handleRegisterClick} style={{ marginTop: '20px' }}>
                Register an Account
            </button>
        </div>
    );
}

export default Login