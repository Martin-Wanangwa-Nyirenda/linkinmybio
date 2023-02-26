import NavBar from "../components/navbar";
import { useAuth } from '../context/AuthContext'
import { db, storage } from '../lib/firebase';
import React, { useState, useEffect } from "react";
import styles from '../styles/profile.module.css'
import { v4 } from "uuid";
import Notification from '../components/notification';
import { useRouter } from "next/router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {uploadBytes, ref, getDownloadURL} from 'firebase/storage';

export default function Profile(){
    const { userInfo, logout, currentUser } = useAuth()
    const [pagename, setPageName] = useState("")
    const [queriedData, setQueriedData] = useState(null);
    const [profileImage, setProfileImage] = useState("")
    const [profileImageView, setProfileImageView] = useState("")
    const inputRef = React.useRef(null)
    const [isTextChanged, setIsTextChanged] = useState(false)
    const [notification, setNotification] = useState("")
    const route = useRouter();
    
    if(currentUser === null){
        route.push("/auth/signin");
        return
    }
    
    async function handleImageSelect(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setProfileImageView(reader.result);
            setProfileImage(file)
        };
        reader.readAsDataURL(file);
        const imagePath = `images/${file.name + v4()}`;
        setNotification("Updating profile picture...")
        const imageRef = ref(storage, imagePath);
        await uploadBytes(imageRef, file);
        await setDoc(doc(db, "users", currentUser.uid), {
            profileImage: imagePath
        }, { merge: true });
        setNotification("Successfully updated profile picture")
    }

    async function UploadPageName(){
        if(pagename === ""){
            setNotification("Please must sure all fields are not empty")
            return
        }
        setNotification("Updating profile details...")
        await setDoc(doc(db, "users", currentUser.uid), {
            pagename: pagename
        }, { merge: true });
        setNotification("Successfully updated profile details")
        route.push("/dashboard")
    }

    function clickInput(){
        inputRef.current.click();
    }

    function signout(){
        route.push("/auth/signout")
    }

    useEffect(() => {
        if(currentUser.uid !== undefined){
          async function fetchData() {
            const userRef = doc(db, "users", currentUser.uid);
            const snapshot = await getDoc(userRef);
            const data = snapshot.data()
            const imageRef = ref(storage, data.profileImage);
            let downloadUrl = await getDownloadURL(imageRef);
            console.log(downloadUrl)
            setProfileImageView(downloadUrl)
            setPageName(data.pagename)
          }
          fetchData();
        }
    }, [currentUser]);

    return(
        <>
            <NavBar />
            <div className={styles.container}>
                <div className={styles.imagewrapper}>
                    <div>
                        <img className={styles.image} src={profileImageView} />
                        <button className={styles.SelectImageBtn} onClick={() => clickInput()}>Set profile picture</button>
                    </div>
                    <input ref={inputRef} type="file"  accept=".jpeg, .jpg, .png" onChange={(e) => {handleImageSelect(e)}} hidden/>
                </div>
              
                <div className={styles.form}>
                    <label className={styles.PageNameLabel}>Page name</label>
                    <input value={pagename} className={styles.PageNameInput} type="text" onChange={(e) => {
                        setPageName(e.target.value)
                        setIsTextChanged(true)
                        }}/>

                    <div className={styles.formcontrolbtns}>
                            <button className={styles.btnLogout} onClick={() => signout()}>Logout</button>
                            <button className={isTextChanged ? styles.btnSave : styles.btnSaveNotActive} onClick={() => UploadPageName()}>Save</button>
                    </div>
                </div>
                
                <Notification notification={notification}/>
            </div>
            
        </>
    )
}