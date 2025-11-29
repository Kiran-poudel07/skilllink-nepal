import React from "react";

interface PageTitleProps {
  title: string;
  children?:React.ReactNode;
  className?: string
}

const PageTitle = ({ title, children,className }:Readonly<PageTitleProps>) => {
 return(

    <h1 className={className}>{children? children:title}</h1>
 )
};

export default PageTitle;
