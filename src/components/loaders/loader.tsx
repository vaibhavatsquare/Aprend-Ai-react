import Image from "next/image";
import styles from './loader.module.css';


const Loader = () => {
  return (
    <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center bg-[#ffffff] z-50">
      <div className="flex gap-3 justify-center items-center">
        <img src="/images/appLogo.svg" alt="Loading" className="w-[150px] h-[150px]" />
        <div className="flex flex-col text-primary items-center">
          <div className={`${styles.loader}`} />
        </div>
      </div>
    </div>
  );
};

export default Loader;
