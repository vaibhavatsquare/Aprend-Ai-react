"use client"
import { useRedirect } from "@/src/hooks/router.hooks"
import { useEffect } from "react"

const Page = () => {
  useEffect(() => {
    useRedirect("/login", true);
  }, [])
  
  return null;
}

export default Page