import React, { useContext, useState, useEffect } from 'react'
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    function signup(email, password) {
        createUserWithEmailAndPassword(auth, email, password).then(() => {
            console.log("Sign up successful!");
        }).catch((error)=>{
            console.log(error);
        });
        
        return
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password).then(() => {
           console.log("Login successful!..");
           
        }).catch((error)=>{
            console.log(error);
        });
        
    }

    function logout() {
        return signOut(auth);
    }


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async user => {
            setCurrentUser(user);
            setLoading(false);
        })
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        signup,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}