import styles from '../styles/dashboard.module.css';

export default function Notification(props){
    return(
        <div className={styles.notification}>{props.notification}</div>
    )
}