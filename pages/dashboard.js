import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext'
import styles from '../styles/dashboard.module.css';
import Image from 'next/image';
import { storage } from '../lib/firebase';
import {uploadBytes, ref, getDownloadURL} from 'firebase/storage';
import { v4 } from "uuid";
import { db } from '../lib/firebase';
import {doc, setDoc} from 'firebase/firestore'
import { collection, getDocs } from "firebase/firestore";

export default function dashboard() {
  const { userInfo, currentUser } = useAuth()
  const [ showForm, setShowForm ] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [blogPostUrl, setBlogPostUrl] = useState(null);
  const [instaPostUrl, setInstaPostUrl] = useState(null);
  const [queriedData, setQueriedData] = useState([]);
  const [Error, setError] = useState("")
  const [uploaded, setUploaded] = useState(0)//Updates everytime an upload happens to cause a useEffect

  async function uploadData(event){
    event.preventDefault();
      try {
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        let snapShot = await uploadBytes(imageRef, imageUpload);
        let downloadUrl = await getDownloadURL(snapShot.ref);
        let uploadData = await setDoc(doc(db, "users", currentUser.uid, "posts", v4()), {
            imageUrl: downloadUrl,
            instagramPostUrl: instaPostUrl,
            BlogPostURL: blogPostUrl
        });
        changeFormVisibilityState();
        setUploaded(uploaded + 1);
      } catch (error) {
        console.log(error);
      }
      
  }

  function changeFormVisibilityState(){
    setShowForm(!showForm);
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
      console.log(currentUser.uid);
      fetchData();
    }
  }, [currentUser.uid, uploaded]);

  return (
    <div className={styles.container}>
      <form className={styles.overlayForm} style={{visibility: showForm? "visible" : "hidden"}} method="post">
            <div className={styles.formWeburl}>
            <label className={styles.formLabels}>BlogPost URL</label>
                <input type="url" className={styles.formInputs} onChange={(e) => setBlogPostUrl(e.target.value)} placeholder="https://www.myblog.com/post1"/>
            </div>
            <div className={styles.formPosturl}>
                <label className={styles.formLabels} >Post URL</label>
                <input className={styles.formInputs} type="url" onChange={(e) => setInstaPostUrl(e.target.value)} placeholder="https://www.myblog.com/post1"/>
            </div>
            <div className={styles.formImageinput}>
                <input type="file" onChange={(e) => {setImageUpload(e.target.files[0])}}/>
            </div>
            <div className={styles.formBtns}>
                <a className={styles.btnCancel} onClick={changeFormVisibilityState}>Cancel</a>
                <button type="submit" className={styles.btnSave} onClick={async (e) => {await uploadData(e);}}>Save</button>
            </div>
      </form>
      <div className={styles.containerOverlay} style={{visibility: showForm? "visible" : "hidden"}}>  
      </div>
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
                  <div className={styles.itemWrap} onClick={changeFormVisibilityState}>
                      <Image className={styles.wrapImage} src="/Images/ads/Image1.png" alt="Image"
                      height={175}
                      width={175}/>
                  </div>
              </div>
              {currentUser.uid !== undefined ? 
                queriedData.map(post =>(
                <div className={styles.gridItem} key={post.id}>
                      <Link href={post.BlogPostURL}>
                      <div className={styles.itemWrap}>
                        {post.imageUrl && <Image className={styles.wrapImage} src={post.imageUrl} alt="Image"
                        height={175}
                        width={175}/> }
                      </div>
                    </Link>
                </div>
            )) : <p>Loading...</p>}
                  
          </div>
      </div>
    </div>
  )
}