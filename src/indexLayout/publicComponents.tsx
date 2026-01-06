"use client"
import React, { useEffect, useState } from 'react'
import withPublic from '../hoc/withPublic';

const PublicComponents = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="w-screen h-screen">
      {children}
    </div>
  );
};

export default withPublic(PublicComponents);