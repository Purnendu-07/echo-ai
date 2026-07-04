import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();

    const { login, signup, loginWithGoogle } = useAuth();

    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (isSignup) {
                await signup(email, password);
            } else {
                await login(email, password);
            }

            navigate("/feed");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate("/feed");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-bg" aria-hidden="true">
                <div className="login-bg-orb login-bg-orb--1" />
                <div className="login-bg-orb login-bg-orb--2" />
                <div className="login-bg-orb login-bg-orb--3" />
            </div>

            <div className="login-card">
                <header className="login-header">
                    <div className="login-logo" aria-hidden="true">
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
                            <path
                                d="M14 28c4-8 16-8 20 0M18 20c2-3 10-3 12 0"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                    <h1 className="login-title">Echo</h1>
                    <p className="login-subtitle">Asynchronous Digital Time Capsule</p>
                </header>

                <div className="login-mode-toggle">
                    <button
                        type="button"
                        className={`login-mode-btn ${!isSignup ? "login-mode-btn--active" : ""}`}
                        onClick={() => setIsSignup(false)}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={`login-mode-btn ${isSignup ? "login-mode-btn--active" : ""}`}
                        onClick={() => setIsSignup(true)}
                    >
                        Create Account
                    </button>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label className="login-label" htmlFor="login-email">
                            Email
                        </label>
                        <input
                            id="login-email"
                            className="login-input"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label" htmlFor="login-password">
                            Password
                        </label>
                        <input
                            id="login-password"
                            className="login-input"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete={isSignup ? "new-password" : "current-password"}
                        />
                    </div>

                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button type="submit" className="login-btn login-btn--primary">
                        {isSignup ? "Create Account" : "Login"}
                    </button>

                    <div className="login-divider">
                        <span>or</span>
                    </div>

                    <button
                        type="button"
                        className="login-btn login-btn--google"
                        onClick={handleGoogleLogin}
                    >
                        <svg className="login-google-icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </button>
                </form>

                <button
                    type="button"
                    className="login-toggle"
                    onClick={() => setIsSignup(!isSignup)}
                >
                    {isSignup
                        ? "Already have an account? Login"
                        : "Create New Account"}
                </button>
            </div>
        </div>
    );
}

export default Login;
