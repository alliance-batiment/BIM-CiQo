import { Tooltip, Fab } from "@material-ui/core";

const ToolTipsElem = ({
  title,
  placement,
  disabled,
  className,
  onClick,
  children
}) => {
  return (
    <Tooltip arrow title={title} placement={placement}>
      <Fab size="small" className={className} onClick={onClick} disabled={disabled}>
        {children}
      </Fab>
    </Tooltip>
  );
};

export default ToolTipsElem;
