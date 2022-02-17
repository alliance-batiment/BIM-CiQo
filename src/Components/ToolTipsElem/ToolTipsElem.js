import { Tooltip, Fab } from "@material-ui/core";

const ToolTipsElem = ({
  title,
  placement,
  className,
  onClick,
  children
}) => {
  return (
    <Tooltip arrow title={title} placement={placement}>
      <Fab size="small" className={className} onClick={onClick}>
        {children}
      </Fab>
    </Tooltip>
  );
};

export default ToolTipsElem;
