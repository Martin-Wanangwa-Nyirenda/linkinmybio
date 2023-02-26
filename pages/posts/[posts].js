import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../styles/posts.module.css'
import Image from 'next/image';
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from '../../lib/firebase';
import { doc, getDoc } from "firebase/firestore";
import {ref, getDownloadURL} from 'firebase/storage';
import Head from 'next/head';

export default function Posts(){
  const [queriedData, setQueriedData] = useState([]);
  const [profileImage, setProfileImage] = useState("")
  const [pageName, setPageName] = useState("")
  const router = useRouter()
  const posts = router.query.posts;

 
  useEffect(() => {
    if(posts !== undefined){
      async function fetchData() {
        const postsRef = collection(db, "users", posts, "posts");
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
  }, [posts]);

  useEffect(() => {
      async function fetchData() {
        const userRef = doc(db, "users", posts);
        const snapshot = await getDoc(userRef);
        const data = snapshot.data()
        const imageRef = ref(storage, data.profileImage);
        let downloadUrl = await getDownloadURL(imageRef);
        setProfileImage(downloadUrl)
        setPageName(data.pagename)
      }
      fetchData();
  });
  
  return(
    <div className={styles.container}>
      <Head>
          <title>{pageName}</title>
      </Head>
      <div className={styles.head}>
              <div className={styles.logo}>
                  <img className={styles.logoImage} src={profileImage}/>
                  <h1 className={styles.logoText}>{pageName}</h1>
              </div>
        </div>
      <div className={styles.contentposts}>
          <div className={styles.gridContainer}>
          {posts !== undefined ? 
            queriedData.map(post =>(
                <div className={styles.gridItem} key={post.id}>
                      <Link href={post.BlogPostURL}>
                      <div className={styles.itemWrap}>
                        <img className={styles.wrapImage} src={post.imageUrl} alt="Image"/>
                      </div>
                    </Link>
                </div>
              )) : <p>Loading...</p>}
          </div>
      </div>

    </div>
  )
}

