import React from "react";
import { AiOutlineFire } from "react-icons/ai";

const Home = () => {
  return (
    <div className="px-6 py-2 grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <div className="relative w-full flex items-start justify-between gap-4 rounded-lg px-4 py-6 bg-linear-to-r from-[#F97316] via-[#ED482F] to-[#EF4444]">
            <h1 className="text-2xl text-white">You've studied 3 days in a row! <br />Keep it up 💪</h1>
            <AiOutlineFire className="text-white text-4xl" />
            <div className="absolute -bottom-3 right-5 flex gap-2 items-center text-[#FFFFFF80] font-medium">
                <h2 className="text-5xl">3</h2>
                <p className="text-xl">days</p>
            </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Home;
