import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../services/firebase";

import {
    login,
    signup,
    logout,
    loginWithGoogle,
    resetPassword,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(

            auth,

            async (firebaseUser) => {

                if (firebaseUser) {

                    const token = await firebaseUser.getIdToken();

                    const data = {
                        email: firebaseUser.email,
                        uid: firebaseUser.uid,
                        token,
                    };

                    localStorage.setItem(
                        "echoUser",
                        JSON.stringify(data)
                    );

                    setUser(data);

                } else {

                    localStorage.removeItem("echoUser");
                    setUser(null);

                }

                setLoading(false);

            }

        );

        return unsubscribe;

    }, []);

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        loginWithGoogle,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;