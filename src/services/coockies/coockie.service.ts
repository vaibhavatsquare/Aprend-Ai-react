"use client";
import Cookies from "js-cookie";

export const setCookie = (key: string, value: string, days: number = 10) => {
  Cookies.set(key, value, {
    expires: days,
    secure: true,
    sameSite: "strict",
  });
};

export const getCookie = (key: string) => {
  return Cookies.get(key);
}

export const removeCookie = (key: string) => {
  Cookies.remove(key);
};
