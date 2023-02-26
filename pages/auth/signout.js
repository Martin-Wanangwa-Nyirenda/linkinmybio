import styles from "../../styles/signout.module.css"
import { useRouter } from "next/router";
import { useAuth } from '../../context/AuthContext'
import Head from 'next/head';

export default function SignOut(){
    const { logout } = useAuth()
    const route = useRouter();

    function signouthandler(){
        logout()
        route.push("/auth/signin");
    }

    return(
        <>
            <Head>
                <title>Log out</title>
            </Head>
            <div className={styles.container}>
                <span className={styles.text}>Are you sure, you want to logout?</span>
                <div className={styles.buttons}>
                    <button className={styles.btn} onClick={() => signouthandler()}>Yes</button>
                    <button className={styles.btn} onClick={() => route.push("/dashboard")}>No</button>
                </div>
            </div>
        </>
    )
}