"use client";
import React from "react";
import { useEffect } from "react";
type Props = { pdfUrl: string };

const PDFViewer = ({ pdfUrl }: Props) => {
  // useEffect(() => {
  //   fetch(pdfUrl)
  //     .then((response) => response.blob())
  //     .then((res) => {
  //       console.log(res);
  //     });
  // }, []);
  return (
    // <div className="max-h-screen oveflow-scroll flex-[5] hidden md:block">
    <iframe src={pdfUrl} width="100%" height="100%"></iframe>
    // </div>
  );
};

export default PDFViewer;
