import IconSparkel from "@/src/components/icons/iconSparkel";
import Image from "next/image";
import React from "react";
import { AiOutlineFire } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { IoArrowForwardSharp } from "react-icons/io5";
import { LuChevronRight } from "react-icons/lu";

const Home = () => {
  return (
    <div className="px-4 grid grid-cols-3 gap-4">
      <div className="h-[calc(100vh-80px)] p-2 overflow-y-auto scrollbar col-span-2 flex flex-col gap-4">
        <div className="relative w-full flex items-start justify-between gap-4 rounded-lg px-4 py-6 bg-linear-to-r from-[#F97316] via-[#ED482F] to-[#EF4444]">
          <h1 className="text-2xl text-white">
            You've studied 3 days in a row! <br />
            Keep it up 💪
          </h1>
          <AiOutlineFire className="text-white text-4xl" />
          <div className="absolute -bottom-3 right-5 flex gap-2 items-center text-[#FFFFFF80] font-medium">
            <h2 className="text-5xl">3</h2>
            <p className="text-xl">days</p>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="p-2 border border-gray-200 rounded-lg flex flex-col items-center justify-center"
              style={{
                boxShadow: "0px 0px 1px 0px #00000040",
              }}
            >
              <p className="text-sm text-secondary">MON</p>
              <p className="text-sm font-medium">{21 + index}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex gap-2 items-center justify-between">
            <h2 className="text-xl font-semibold">Today's Task</h2>
            <p className="text-secondary">
              Progress: <span className="text-black font-medium">60%</span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 rounded-lg flex gap-2 items-center justify-between cursor-pointer"
                style={{
                  boxShadow: "0px 0px 1px 0px #00000040",
                }}
              >
                <div className="flex flex-col gap-2">
                  <h3>
                    Math practice - Algebra
                    <p className="text-sm text-secondary flex gap-2 items-center">
                      Flashcards <GoDotFill className="text-primary" />
                      <span className="text-primary font-semibold">
                        Completed
                      </span>
                    </p>
                  </h3>
                </div>

                <LuChevronRight className="text-2xl text-secondary" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right part */}
      <div className="flex flex-col gap-4">
        <div className="relative h-[126px] border-2 border-[#3A86FF] flex flex-col justify-end gap-4 bg-primary rounded-xl p-4">
          <IconSparkel />
          <h2 className="text-white text-sm tracking-wider">
            YOUR <span className="font-medium">AI TUTOR</span> IS READY TO HELP
          </h2>
          <Image
            src="/images/home/robot.svg"
            alt="AI Tutor"
            width={120}
            height={120}
            className="absolute bottom-0 right-0"
          />
        </div>

        <div className="relative flex flex-col gap-3 justify-end p-4 rounded-xl h-[166px] bg-[#BDFF43]">
          <IoArrowForwardSharp className="-rotate-45 absolute top-2 ring-2" />
          <h2 className="text-xl font-medium">Upload Notes</h2>
          <p>Upload images to create new <br />study sets.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
