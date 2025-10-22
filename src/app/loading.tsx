import styles from "./load.module.css";

export default function Loading() {
  return (
    <div
      className={styles.overlay}
      role="status"
      aria-live="polite"
      aria-label="Chargement en cours"
    >
      <div className={styles.contentWrapper}>
        <div className={styles.logoContainer}>
          <img src="/logo.svg" alt="Logo de ColiGoo" width="80" />
        </div>

        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    </div>
  );
}
