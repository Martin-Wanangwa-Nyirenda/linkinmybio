import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext'
import styles from '../../styles/dashboard.module.css'
import Image from 'next/image';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../lib/firebase';


export default function Posts(){
  const [queriedData, setQueriedData] = useState([]);
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
  
  return(
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
        
        {posts !== undefined ? 
          queriedData.map(post =>(
              <div className={styles.gridItem} key={post.id}>
                    <Link href={post.BlogPostURL}>
                    <div className={styles.itemWrap}>
                      <Image className={styles.wrapImage} src={post.imageUrl} alt="This is random text"
                      height={175}
                      width={175}/>
                    </div>
                  </Link>
              </div>
            )) : <p>Loading...</p>}
        </div>
    </div>
  )
}

