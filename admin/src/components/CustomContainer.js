import React from 'react';
import '../components/SideMenu.css';

const CustomContainer = (props) => {

  const { width, height, backgroundColor, margin , borderRadius, boxShadow, justifyContent, position, top,left, bottom} = props;

  const  style = {
    bottom: bottom,
    top:top,
    left:left,
    position:position,
    display: "flex",
    alignItems: "center",
    justifyContent: justifyContent,
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: `${backgroundColor}`,
    margin: `${margin}`,
    borderRadius: `${borderRadius}px`,
    boxShadow:`${boxShadow}`
  };
  
  return(
    <div style={style}>
       {props.children}
    </div>


  )
}

export default CustomContainer
