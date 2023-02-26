import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from "next/router";
import styles from '../../styles/login.module.css';
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

    if(currentUser !== null){
        route.push("/dashboard");
        return
    }
    
    async function submitHandler(event) {
        event.preventDefault();
        if (!email || !password) {
            setError('Please enter email and password')
            return
        }
        
        try {
            const login_ = login(email, password);
            route.push("/dashboard");
        } catch (err) {
            setError('Incorrect email or password')
        }
    }
    

    return(
        <>
            <Head>
                <title>Login</title>
            </Head>
            <header className={styles.header}>
                <h1 className={styles.headerLogo}>LinkInMyBio</h1>
            </header>
            <div className={styles.container}>
                <div className={styles.containerImagesection}>
                    <Image
                     src={"/images/imagelg1.png"}
                    alt=""
                    className={styles.imagesectionImage}
                    height={650}
                    width={650}
                    />
                </div>
                <div className={styles.containerLoginsection}>
                    <form className={styles.loginsectionLoginform}>
                        <h1 className={styles.loginformHeadtext}>Login to your account.</h1>
            
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

                    <Link href="/auth/signup" className={styles.accountStatus}>I don't have an account</Link>
                </div>
            </div>
       </>
    )
}