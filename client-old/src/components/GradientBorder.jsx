import React from "react";

const GradientBorder = ({
  colors = ["#ff6ec4", "#7873f5", "#4ade80"],
  speed = 6,
  width = "300px",
  height = "150px",
  children,
}) => {
  const gradientColors = colors.join(", ");

  const style = {
    position: "relative",
    padding: "3px",
    borderRadius: "12px",
    background: `linear-gradient(270deg, ${gradientColors})`,
    backgroundSize: "600% 600%",
    animation: `gradientShift ${speed}s ease infinite`,
    width,
    height,
    boxSizing: "border-box",
  };

const contentStyle = {
  background: "white",
  borderRadius: "8px",
  height: "100%",
  width: "100%",
  padding: "20px",
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "center",
  // alignItems: "flex-start", // Note: 'left' isn't valid for alignItems, see note below
};


  return (
    <>
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <div style={style}>
        <div style={contentStyle}>{children}</div>
      </div>
    </>
  );
};

export default GradientBorder;