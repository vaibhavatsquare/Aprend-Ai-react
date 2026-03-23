import React from "react";
import Image from "next/image";
import styles from './loader.module.css';

const FullScreenLoader = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col justify-center items-center">
        <img src="/images/appLogo.svg" alt="Loading" className="w-[150px] h-[150px]" />
        <div className="flex flex-col text-primary items-center">
          <div className={`${styles.loader}`}></div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
