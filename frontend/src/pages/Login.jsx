import { useState } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

function Login() {

    const navigate = useNavigate();

    const [isSignup, setIsSignup] = useState(false);

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        try {

            if (isSignup) {

                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            } else {

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            }

            navigate("/dashboard");

        } catch (err) {

            setError(err.message);

        }

    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h1>Echo</h1>

                <p>Asynchronous Digital Time Capsule</p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    <button type="submit">

                        {isSignup
                            ? "Create Account"
                            : "Login"}

                    </button>

                </form>

                {error && (

                    <p className="error">

                        {error}

                    </p>

                )}

                <button

                    className="toggle"

                    onClick={() =>
                        setIsSignup(!isSignup)
                    }

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