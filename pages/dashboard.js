import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext'
import styles from '../styles/dashboard.module.css';
import Image from 'next/image';
import { db } from '../lib/firebase';
import { collection, getDocs } from "firebase/firestore";
import React from 'react';
import UploadForm  from '../components/UploadForm';
import EditForm from '../components/EditForm';

export default function dashboard() {
  const { userInfo, currentUser } = useAuth()
  const [ showForm, setShowForm ] = useState(false);
  const [queriedData, setQueriedData] = useState([]);
  const [Error, setError] = useState("")
  const [uploaded, setUploaded] = useState(0)//Updates everytime an upload happens to cause a useEffect
  const [isEditFormMounted, setIsEditFormMounted] = useState(false)
  const [selectedPost, setSelected] = useState("")
  const inputRef = React.useRef(null)

  function changeFormVisibilityState(){
    console.log("Running")
    setShowForm(!showForm);
  }

  function changeEditFormVisibility(postid){
    setSelected(postid);
    setIsEditFormMounted(!isEditFormMounted);
  }

  function getUploaded(upd){
    setUploaded(upd);
  }


  useEffect(() => {
    if(currentUser.uid !== undefined){
      async function fetchData() {
        const postsRef = collection(db, "users", currentUser.uid, "posts");
        const snapshot = await getDocs(postsRef);
        const postData = snapshot.docs.map((doc) => {
          const data = doc.data();
          data.id = doc.id;
          return data;
        });
        console.log(postData);
        setQueriedData(postData);
        
      }
      console.log(currentUser.uid);
      fetchData();
    }
  }, [currentUser.uid, uploaded]);

  return (
    <div className={styles.container}>
      <UploadForm onUpload={getUploaded} changeFormVisibilityState={changeFormVisibilityState} showForm={showForm}/>
      {isEditFormMounted && <EditForm postid={selectedPost} formvisibilityhandler={changeEditFormVisibility} onUpload={getUploaded} postsdata={queriedData}/>} 
      <div className={styles.content}>
          <div className={styles.head}>
              <div className={styles.logo}>
                  <Image className={styles.logoImage} src="/images/ads/Logo.jpg" alt="techtrends"
                  height={95}
                  width={95}/>
                  <h1 className={styles.logoText}>Techtrends</h1>
              </div>
          </div>
          
          <div className={styles.gridContainer}>

              <div className={styles.gridItem}>
                  <div className={styles.itemWrap} onClick={() => {changeFormVisibilityState()}}>
                      <Image className={styles.wrapImage} src="/Images/ads/Image1.png" alt="Image"
                      height={175}
                      width={175}/>
                  </div>
              </div>
              {currentUser.uid !== undefined ? 
                queriedData.map(post =>(
                <div className={styles.gridItem} key={post.id} onClick={() => {changeEditFormVisibility(post.id)}}>
                      <div className={styles.itemWrap}>
                        {post.imageUrl && <Image className={styles.wrapImage} src={post.imageUrl} alt="Image"
                        height={175}
                        width={175}/> }
                      </div>
                </div>
            )) : <p>Loading...</p>}
                  
          </div>
      </div>
    </div>
  )
}