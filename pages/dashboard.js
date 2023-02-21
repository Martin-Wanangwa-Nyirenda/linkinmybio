import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'
import styles from '../styles/dashboard.module.css';
import Image from 'next/image';
import { db } from '../lib/firebase';
import { collection, getDocs } from "firebase/firestore";
import React from 'react';
import UploadForm  from '../components/UploadForm';
import EditForm from '../components/EditForm';
import NavBar from '../components/navbar';

export default function dashboard() {
  const { userInfo, currentUser } = useAuth()
  const [ showForm, setShowForm ] = useState(false);
  const [queriedData, setQueriedData] = useState([]);
  const [Error, setError] = useState("")
  const [uploaded, setUploaded] = useState(0)//Updates everytime an upload happens to cause a useEffect
  const [isEditFormMounted, setIsEditFormMounted] = useState(false)
  const [selectedPost, setSelected] = useState("")
  const inputRef = React.useRef(null)
  const [userlink, setUserLink] = useState("https://nextjs.org/docs/messages/fast-refresh-reload")

  function changeFormVisibilityState(){
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
        setQueriedData(postData);
        
      }
      fetchData();
    }
  }, [currentUser.uid, uploaded]);

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <UploadForm onUpload={getUploaded} changeFormVisibilityState={changeFormVisibilityState} showForm={showForm}/>
        {isEditFormMounted && <EditForm postid={selectedPost} formvisibilityhandler={changeEditFormVisibility} onUpload={getUploaded} postsdata={queriedData}/>} 
        

        <div className={styles.containerhead}>
          <div className={styles.userlinkwrapper}>
            <span className={styles.userLinkLabel}>Your link</span>
            <span className={styles.userlink}>{userlink}</span>
            <button className={styles.btnCopy}>Copy</button>
          </div>
          <button className={styles.addpostbtn} onClick={() => changeFormVisibilityState()}>Add Post</button>
        </div>
        
        <div className={styles.content}>
            <div className={styles.gridContainer}>
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
    </div>
  )
}