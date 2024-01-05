import styles from './SubmitButton.module.css'

export default function SubmitButton({text}) {
    return (
        <div className={styles.btn_container}>
            <button className={styles.btn}>{text}</button>
        </div>
    )
}