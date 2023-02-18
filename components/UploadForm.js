import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext'
import styles from '../styles/dashboard.module.css';
import Image from 'next/image';
import { storage } from '../lib/firebase';
import {uploadBytes, ref, getDownloadURL} from 'firebase/storage';
import { v4 } from "uuid";
import { db } from '../lib/firebase';
import {doc, setDoc} from 'firebase/firestore';
import React from 'react';


export default function UploadForm(props){
    const { userInfo, currentUser } = useAuth()
    const [imageUpload, setImageUpload] = useState("/images/placeholder1.png");
    const [blogPostUrl, setBlogPostUrl] = useState(null);
    const [instaPostUrl, setInstaPostUrl] = useState(null);
    const [notification, setNotification] = useState("")
    const inputRef = React.useRef(null)
    const [uploaded, setUploaded] = useState(0)

    
    async function handleImageSelect(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImageUpload(reader.result);
        };
        reader.readAsDataURL(file);
    }

    async function uploadData(event){
        event.preventDefault();
          try {
            if((BlogPostURL === null) || (instaPostUrl === null) || (imageUpload === "/images/placeholder1.png")){
                throw "All fields must have values"
            }
            const imagePath = `images/${imageUpload.name + v4()}`;
            const imageRef = ref(storage, imagePath);
            let snapShot = await uploadBytes(imageRef, imageUpload);
            setNotification("Uploading...")
            let downloadUrl = await getDownloadURL(snapShot.ref);
            let uploadData = await setDoc(doc(db, "users", currentUser.uid, "posts", v4()), {
                imageUrl: downloadUrl,
                instagramPostUrl: instaPostUrl,
                BlogPostURL: blogPostUrl,
                AbsolutImagePath: imagePath
            });
            props.changeFormVisibilityState();
            setUploaded(prev => prev + 1);
            setNotification("Upload successfully")
          } catch (error) {
            setNotification(error)
          }
    }
    function clickInput(){
        inputRef.current.click();
    }

    useEffect(() =>{
        props.onUpload(uploaded);
    }, [uploaded])
    
    return(
        <>
            <div className={styles.overlayForm} style={{visibility: props.showForm? "visible" : "hidden"}}>
                <div className={styles.formWeburl}>
                <label className={styles.formLabels}>BlogPost URL</label>
                    <input type="url" className={styles.formInputs} onChange={(e) => setBlogPostUrl(e.target.value)} placeholder="https://www.myblog.com/post1"/>
                </div>
                <div className={styles.formPosturl}>
                    <label className={styles.formLabels} >Post URL</label>
                    <input className={styles.formInputs} type="url" onChange={(e) => setInstaPostUrl(e.target.value)} placeholder="https://www.myblog.com/post1"/>
                </div>
                <div className={styles.formImageinput}>
                    <img src={imageUpload} className={styles.formImageinput_image} alt="Click button below to select image"/>
                    <button className={styles.imageSelectBtn} onClick={async (e) => {await clickInput()}}>Select Image</button>
                    <input ref={inputRef} type="file" accept=".jpeg, .jpg, .png" onChange={(e) => {handleImageSelect(e)}}/>
                </div>
                <div className={styles.formBtns}>
                    <a className={styles.btnCancel} onClick={() => {props.changeFormVisibilityState()}}>Cancel</a>
                    <button className={styles.btnSave} onClick={async (e) => {await uploadData(e);}}>Save</button>
                </div>

                <div className={styles.notification}>{JSON.stringify(notification)}</div>
            </div>
            <div className={styles.containerOverlay} style={{visibility: props.showForm? "visible" : "hidden"}}>  
            </div>
        </>
    )
}