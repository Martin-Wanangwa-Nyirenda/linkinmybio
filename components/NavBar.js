import styles from '../styles/navbar.module.css'
import { getNameFromEmail } from "../lib/helperFunctions";
import { useAuth } from "../context/AuthContext";

export default function NavBar(){
    const { userInfo, currentUser } = useAuth()
    
    return(
        <nav className={styles.navbar}>
            <div className={styles.navbarlogo}>Logo</div>
            <a href="#">
                <div className={styles.navbarprofile}>
                    <span className={styles.profilename}>{getNameFromEmail(currentUser.email)}</span>
                    <img src="/images/ads/logo.jpg" className={styles.profileimage}/>
                </div>
            </a>
        </nav>
    )
}