import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import {
  makeStyles
} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  draggableCard: {
    position: 'absolute',
    marginTop: '1em',
    display: "flex",
    left: '5em',
    alignItems: "center",
    justifyContent: "center",
    // border: "solid 1px #ddd",
    backgroundColor: "red",
    zIndex: 100
  }
}));


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
  children,
  disableDragging,
  width,
  height
}) => {
  const classes = useStyles();

  const [state, setState] = useState({
    width: width ? width : 400,
    height: height ? height : 400,
    x: 50,
    y: 10
  });

  return (
    <Rnd
      style={style}
      // className={classes.draggableCard}
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
      disableDragging={disableDragging}
    >
      {children}
    </Rnd>
  );
};

export default DraggableCard;
