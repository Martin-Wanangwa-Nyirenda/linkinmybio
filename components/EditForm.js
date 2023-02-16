import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext'
import styles from '../styles/dashboard.module.css';
import Image from 'next/image';
import {uploadBytes, ref, getDownloadURL, deleteObject} from 'firebase/storage';
import { v4 } from "uuid";
import { db, storage } from '../lib/firebase';
import {doc, setDoc, deleteDoc} from 'firebase/firestore';
import React from 'react';


export default function EditForm(props){
    const post = props.postsdata.find(obj => obj.id === props.postid);
    const { userInfo, currentUser } = useAuth();
    const [imageUpload, setImageUpload] = useState(post.imageUrl);
    const [blogPostUrl, setBlogPostUrl] = useState(post.BlogPostURL);
    const [instaPostUrl, setInstaPostUrl] = useState(post.instagramPostUrl);
    const [imageDownloadUrl, setimageDownloadUrl] = useState("");
    const [isUpdated, setIsUpdated] = useState(false)
    const [IsFieldsUpdated, setIsFieldsUpdated] = useState(false)
    const [isImageUpdated, setIsImageUpdated] = useState(false)
    const [Error, setError] = useState("")
    const inputRef = React.useRef(null)
    const [uploaded, setUploaded] = useState(0)

    async function handleImageSelect(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImageUpload(reader.result);
        };
        reader.readAsDataURL(file);
        const imageRef = ref(storage, post.AbsolutImagePath);
        let snapShot = await uploadBytes(imageRef, file);
        let downloadURL = await getDownloadURL(snapShot.ref);
        setimageDownloadUrl(downloadURL);  
    }

    async function editData(event){
        console.log("This run EDIT")
        event.preventDefault();
        
        if(IsFieldsUpdated){
            const documentName = await doc(db, "users", currentUser.uid, "posts", props.postid).path;
            let docRef = await doc(db, documentName)
            await setDoc(docRef, {
                imageUrl: imageDownloadUrl,
                instagramPostUrl: instaPostUrl,
                BlogPostURL: blogPostUrl,
            }, { merge: true });
            setUploaded(prev => prev + 1);
            props.formvisibilityhandler("")
        }else if(isImageUpdated){
            const documentName = await doc(db, "users", currentUser.uid, "posts", props.postid).path;
            let docRef = await doc(db, documentName)
            await setDoc(docRef, {
                imageUrl: imageDownloadUrl
            }, { merge: true });
            setUploaded(prev => prev + 1);
            props.formvisibilityhandler("")
        }
    }

    async function deletePost(){
        const documentName = await doc(db, "users", currentUser.uid, "posts", props.postid).path;
        await deleteObject(ref(storage, post.AbsolutImagePath));
        await deleteDoc(doc(db, documentName))
        setUploaded(prev => prev + 1);
        props.formvisibilityhandler("")
    }

    function clickInput(){
        inputRef.current.click();
    }

    useEffect(() => {
        console.log("Save")
    }, [imageDownloadUrl])


    useEffect(() => {
        console.log("This run 3")
        props.onUpload(uploaded);
    }, [uploaded])
    
    return(
        <>
            <div className={styles.overlayForm}>
                <div className={styles.formWeburl}>
                <label className={styles.formLabels}>BlogPost URL</label>
                    <input type="url" className={styles.formInputs} value={blogPostUrl} onChange={(e) => {
                        setBlogPostUrl(e.target.value)
                        setIsFieldsUpdated(true)
                        setIsUpdated(true)
                        }}/>
                </div>
                <div className={styles.formPosturl}>
                    <label className={styles.formLabels} >Post URL</label>
                    <input className={styles.formInputs} type="url" onChange={(e) => setInstaPostUrl(e.target.value)} value={instaPostUrl} />
                </div>
                <div className={styles.formImageinput}>
                    <img src={imageUpload} className={styles.formImageinput_image} alt="Click button below to select image"/>
                    <button className={styles.imageSelectBtn} onClick={async (e) => {await clickInput()}}>Select Image</button>
                    <input ref={inputRef} type="file" accept=".jpeg, .jpg, .png" onChange={(e) => 
                        {handleImageSelect(e)
                         setIsUpdated(true)
                        }}/>
                </div>
                <div className={styles.formBtns}>
                    <button className={styles.btnDelete} onClick={async (e) => {deletePost()}}>Delete</button>
                    <a className={styles.btnCancel} onClick={() => {props.formvisibilityhandler("")}}>Cancel</a>
                    <button className={styles.btnSave} onClick={async (e) => {await editData(e);}}>Save</button>
                </div>
            </div>
            <div className={styles.containerOverlay}>  
            </div>
        </>
    )
}