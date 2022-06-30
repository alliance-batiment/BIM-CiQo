import {
  Modal,
  Card,
  CardContent,
  CardHeader,
  Button,
  IconButton,
  Grid,
  Typography
} from '@mui/material';
import ClearIcon from "@mui/icons-material/Clear";
import { useWeb3React } from "@web3-react/core";
import { connectors } from "./connectors";
import { toHex, truncateAddress } from "./utils";

export default function SelectWalletModal({ isOpen, closeModal }) {
  const { activate } = useWeb3React();

  const setProvider = (type) => {
    window.localStorage.setItem("provider", type);
  };

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card>
        <CardHeader
          title={"Select Wallet"}
          action={
            <IconButton
              aria-label="settings"
              // aria-describedby={id}
              // onClick={() => setShowValidation(false)}
              size="small"
            >
              <ClearIcon />
            </IconButton>
          }
        />
        <CardContent>

          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Button
                variant="outline"
                onClick={() => {
                  activate(connectors.coinbaseWallet);
                  setProvider("coinbaseWallet");
                  closeModal();
                }}
              >
                <img
                  src="/cbw.png"
                  alt="Coinbase Wallet Logo"
                  width={25}
                  height={25}
                  borderRadius="3px"
                />
                <Typography>Coinbase Wallet</Typography>
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outline"
                onClick={() => {
                  activate(connectors.walletConnect);
                  setProvider("walletConnect");
                  closeModal();
                }}
              >
                <img
                  src="/wc.png"
                  alt="Wallet Connect Logo"
                  width={26}
                  height={26}
                  borderRadius="3px"
                />
                <Typography>Wallet Connect</Typography>
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outline"
                onClick={() => {
                  activate(connectors.injected);
                  setProvider("injected");
                  closeModal();
                }}
              >
                <img
                  src="/mm.png"
                  alt="Metamask Logo"
                  width={25}
                  height={25}
                  borderRadius="3px"
                />
                <Typography>Metamask</Typography>
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Modal >
  );
}