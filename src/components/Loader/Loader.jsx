import styles from "./loader.module.scss";

const Loader = () => (
  <div className={styles["lds-facebook"]}>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

export default Loader;
