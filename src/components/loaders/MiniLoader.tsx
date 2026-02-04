import styles from "./miniLoader.module.css";

const MiniLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className={styles.ring}></div>
    </div>
  );
};

export default MiniLoader;
