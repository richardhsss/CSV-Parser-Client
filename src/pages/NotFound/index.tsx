import styles from './styles.module.css';

function NotFound() {
  return (
    <section className={styles.section}>
      <h1 className={styles.title}>
        404
        <br />
        Page Not Found
      </h1>
    </section>
  );
}

export default NotFound;
