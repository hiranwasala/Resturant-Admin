import React from 'react';

const CustomText = (props) => {
  const { title, fontSize, fontWeight, margin, color } = props;

  const textStyle = {
    fontSize: fontSize || 'inherit', 
    fontWeight: fontWeight || 'inherit', 
    margin: margin || 0,
    marginLeft: margin ? margin.left || 0 : 0,
    marginRight: margin ? margin.right || 0 : 0,
    marginTop: margin ? margin.top || 0 : 0,
    marginBottom: margin ? margin.bottom || 0 : 0,
    color: color? color : '#000000'
  };

  return (
    <div style={textStyle}>
      {title}
    </div>
  );
}

export default CustomText;
