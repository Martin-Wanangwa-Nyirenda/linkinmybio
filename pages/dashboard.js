import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext'
import styles from '../styles/dashboard.module.css';
import Image from 'next/image';



export default function dashboard() {
  const { userInfo, currentUser } = useAuth()
  const [ showForm, setShowForm ] = useState(false);

  function changeFormVisibilityState(){
    setShowForm(!showForm);
  }

  return (
    <div className={styles.container}>
      <form className={styles.overlayForm} style={{visibility: showForm? "visible" : "hidden"}} method="post">
          <div className={styles.formWeburl}>
              <label className={styles.formLabels}>Website URL</label>
              <input type="url" className={styles.formInputs} placeholder="https://www.myblog.com/post1"/>
          </div>
          <div className={styles.formPosturl}>
              <label className={styles.formLabels}>Post URL</label>
              <input className={styles.formInputs} type="url" placeholder="https://www.myblog.com/post1"/>
          </div>
          <div className={styles.formImageinput}>
              <input type="image" />
          </div>
          <div className={styles.formBtns}>
              <a className={styles.btnCancel} onClick={changeFormVisibilityState}>Cancel</a>
              <button type="submit" className={styles.btnSave} onclick={changeFormVisibilityState}>Save</button>
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
                      <Image className={styles.wrapImage} src="/Images/ads/Image1.png" alt="This is random text"
                      height={175}
                      width={175}/>
                  </div>
              </div>
              <div className={styles.gridItem}>
                    <a href="https://www.techtrends.co.zm/mtn-mobile-money-celebrates-100000-merchants-in-zambia/">
                        <Image className={styles.image} src="/Images/ads/Image2.png" alt="This is random text"
                        height={175}
                        width={175}/>
                    </a>
                  </div>
                  <div className={styles.gridItem}>
                    <a href="https://www.techtrends.co.zm/mtn-mobile-money-celebrates-100000-merchants-in-zambia/">
                        <Image className={styles.image} src="/Images/ads/Image2.png" alt="This is random text"
                        height={175}
                      width={175}/>
                    </a>
                  </div>
                  <div className={styles.gridItem}>
                    <a href="https://www.techtrends.co.zm/mtn-mobile-money-celebrates-100000-merchants-in-zambia/">
                        <Image className={styles.image} src="/Images/ads/Image2.png" alt="This is random text"
                        height={175}
                      width={175}/>
                    </a>
                  </div>
                  <div className={styles.gridItem}>
                    <a href="https://www.techtrends.co.zm/mtn-mobile-money-celebrates-100000-merchants-in-zambia/">
                        <Image className={styles.image} src="/Images/ads/Image2.png" alt="This is random text"
                        height={175}
                      width={175}/>
                    </a>
                  </div>
                  <div className={styles.gridItem}>
                    <a href="https://www.techtrends.co.zm/mtn-mobile-money-celebrates-100000-merchants-in-zambia/">
                        <Image className={styles.image} src="/Images/ads/Image2.png" alt="This is random text"
                        height={175}
                        width={175}/>
                    </a>
                  </div>
          </div>
      </div>
    </div>
  )
}