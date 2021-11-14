import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

const style = {
  position: 'absolute',
  marginTop: '1em',
  display: "flex",
  left: '5em',
  alignItems: "center",
  justifyContent: "center",
  // border: "solid 1px #ddd",
  // background: "#f0f0f0",
  zIndex: 100
};

const DraggableCard = ({
  children
}) => {
  const [state, setState] = useState({
    width: 400,
    height: 400,
    x: 50,
    y: 10
  });

  return (
    <Rnd
      style={style}
      size={{ width: state.width, height: state.height }}
      position={{ x: state.x, y: state.y }}
      onDragStop={(e, d) => {
        setState({ x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setState({
          width: ref.style.width,
          height: ref.style.height,
          ...position
        });
      }}
    >
      {children}
    </Rnd>
  );
};

export default DraggableCard;
