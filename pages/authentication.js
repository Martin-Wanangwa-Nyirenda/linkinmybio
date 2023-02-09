import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from "next/router";
import styles from '../styles/login.module.css';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

export default function login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [isLoggingIn, setIsLoggingIn] = useState(true);

    const { login, signup, currentUser } = useAuth();
    const route = useRouter();
    
    async function submitHandler(event) {
        event.preventDefault();
        if (!email || !password) {
            setError('Please enter email and password')
            return
        }
        if (isLoggingIn) {
            try {
                const login_ = await login(email, password);
                setLoginStatus();
                route.push("/dashboard");
            } catch (err) {
                setError('Incorrect email or password')
            }
            return
        }
        const signup_ = await signup(email, password);
        setLoginStatus_();
    }

    function setLoginStatus_(){
        if(isLoggingIn)
        { 
            setIsLoggingIn(false);
        }else if(!isLoggingIn)
            setIsLoggingIn(true);
    }
    function setLoginStatus(event){
        event.preventDefault();
        if(isLoggingIn)
        { 
            setIsLoggingIn(false);
        }else if(!isLoggingIn)
            setIsLoggingIn(true);
    }
    return(
       <>
            <Head>
                <title>Login Page</title>
            </Head>
            <header className={styles.header}>
                <h1 className={styles.headerLogo}>LinkInMyBio</h1>
                <Link href="/signup" className={styles.headerText} onClick={setLoginStatus}>{isLoggingIn ? "Don't have an account" : 'I already have an account'}</Link>
            </header>
            <div className={styles.container}>
                <div className={styles.containerImagesection}>
                    <Image
                     src={isLoggingIn ? "/images/imagelg1.png" : "/images/imagelg.png"}
                    alt=""
                    className={styles.imagesectionImage}
                    height={650}
                    width={650}/>
                </div>
                <div className={styles.containerLoginsection}>
                    <form className={styles.loginsectionLoginform}>
                        <h1 className={styles.loginformHeadtext}>{isLoggingIn ? "Login into your account" : "Create an account."}</h1>
            
                        <input 
                            type="email"
                            className={styles.loginformEmail} 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"/>
                        <input
                            type="password" 
                            className={styles.loginformPassword}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}/>
                        <input 
                            type="button"
                            className={styles.loginformSubmitbutton} 
                            onClick={submitHandler} 
                            value="Continue"/>
                    </form>
                    
                </div>
            </div>
       </>
    );
}

