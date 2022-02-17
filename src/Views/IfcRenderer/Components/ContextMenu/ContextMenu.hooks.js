import { useEffect, useCallback, useState } from "react";

const useContextMenu = () => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);

  // const handleContextMenu = useCallback(
  //   (event) => {
  //     event.preventDefault();
  //     setAnchorPoint({ x: event.pageX, y: event.pageY });
  //     setShow(true);
  //   },
  //   [setShow, setAnchorPoint]
  // );

  const handleContextMenu = (event) => {
    event.preventDefault();
    setAnchorPoint({ x: event.pageX, y: event.pageY });
    setShow(true);
  };

  const handleClick = useCallback(() => show && setShow(false), [show]);

  useEffect(() => {
    function rightclick() {
      var rightclick;
      var e = window.event;
      setShow(true);
      if (e.which) rightclick = (e.which == 3);
      else if (e.button) rightclick = (e.button == 2);
      if (rightclick) {
        setShow(true);
        // document.addEventListener("contextmenu", handleContextMenu);
        window.oncontextmenu = handleContextMenu;
      } else {
        setShow(false);
        //document.removeEventListener("contextmenu", handleContextMenu);
      }
      //alert(rightclick); // true or false, you can trap right click here by if comparison
    }

    window.onmousedown = rightclick;
    // document.addEventListener("click", handleClick);
    // document.addEventListener("contextmenu", handleContextMenu);
    // return () => {
    //   document.removeEventListener("click", handleClick);
    //   document.removeEventListener("contextmenu", handleContextMenu);
    // };
  });

  return { anchorPoint, show };
};

export default useContextMenu;