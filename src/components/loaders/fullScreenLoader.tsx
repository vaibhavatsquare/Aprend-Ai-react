import React from "react";
import Image from "next/image";
import styles from './loader.module.css';

const FullScreenLoader = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col justify-center items-center">
        <Image src="/images/appLogo.svg" alt="Loading" width={150} height={150} />
        <div className="flex flex-col text-primary items-center">
          <div className={`${styles.loader}`}></div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
