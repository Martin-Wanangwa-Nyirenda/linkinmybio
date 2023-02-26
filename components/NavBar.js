import styles from '../styles/navbar.module.css'
import { getNameFromEmail } from "../lib/helperFunctions";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { db, storage } from '../lib/firebase';
import { doc, getDoc } from "firebase/firestore";
import {getDownloadURL, ref} from 'firebase/storage';
import Link from 'next/link';

export default function NavBar(){
    const { userInfo, currentUser } = useAuth()
    const [profileImage, setProfileImage] = useState("")
    const [pagename, setPageName] = useState("")

    useEffect(() => {
        if(currentUser.uid !== undefined){
          async function fetchData() {
            const userRef = doc(db, "users", currentUser.uid);
            const snapshot = await getDoc(userRef);
            const data = snapshot.data()
            const imageRef = ref(storage, data.profileImage);
            let downloadUrl = await getDownloadURL(imageRef);
            setProfileImage(downloadUrl)
            setPageName(data.pagename)
            
          }
          fetchData();
        }
      }, [currentUser.uid]);
    return(
        <nav className={styles.navbar}>
            <a href='/' className={styles.navbarlogo}>LinkInMybio</a>
            <Link href="/profile">
                <div className={styles.navbarprofile}>
                    <span className={styles.profilename}>{pagename}</span>
                    <img src={profileImage} className={styles.profileimage}/>
                </div>
            </Link>
        </nav>
    )
}