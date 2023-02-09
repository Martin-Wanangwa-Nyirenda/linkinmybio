import styles from '../styles/dashboard.module.css';
import Image from 'next/image';
import { useState } from 'react';

export default function addPost(){
    const [imagePublicId, setImagePublicId] = useState("");

    function showUploadWidget() {
        cloudinary.openUploadWidget({
               cloudName: "dsnxclsda",
               uploadPreset: "ml_default",
               sources: [
                           "local",
                           "google_drive", 
                           "facebook",   
                           "instagram",  
                           "camera"    ],
               googleApiKey: "<image_search_google_api_key>",
               showAdvancedOptions: false,    
               cropping: false,    
               multiple: false,    
               defaultSource: "local",    
               styles: {        
                   palette: {            
                       window: "#FFFFFF",            
                       windowBorder: "#90A0B3",            
                       tabIcon: "#0078FF",            
                       menuIcons: "#5A616A",            
                       textDark: "#000000",            
                       textLight: "#FFFFFF",            
                       link: "#0078FF",            
                       action: "#FF620C",            
                       inactiveTabIcon: "#0E2F5A",            
                       error: "#F44235",            
                       inProgress: "#0078FF",            
                       complete: "#20B832",            
                       sourceBg: "#E4EBF1"        
                   },        
                   fonts: {            
                       default: null,            
                       "'Fira Sans', sans-serif": {                
                           url: "https://fonts.googleapis.com/css?family=Fira+Sans",
                           active: true            
                       }        
                   }    
               }},
               (err, result) => {
                    if (
                        result.event === "success" &&
                        result.info.resource_type === "image"
                    ) {
                        console.log(result.info);
                        setImagePublicId(result.info.public_id);
                    }
                     });
    }
    return(
        <div className={styles.container}>
            <div className={styles.head}>
                <div className={styles.logo}>
                    <Image className={styles.logoImage} src="/images/ads/Logo.jpg" alt="techtrends"
                    height={95}
                    width={95}/>
                    <h1 className={styles.logoText}>Techtrends</h1>
                </div>
            </div>
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
                    <Image src='/images/ads/image2.png'/>
                    <Button className={styles.btnSave}>Upload Image</Button>
                </div>
                <div className={styles.formBtns}>
                    <a className={styles.btnCancel} onClick={changeFormVisibilityState}>Cancel</a>
                    <button type="submit" className={styles.btnSave} onclick={changeFormVisibilityState}>Save</button>
                </div>
            
            </form>
    </div>
    )
}