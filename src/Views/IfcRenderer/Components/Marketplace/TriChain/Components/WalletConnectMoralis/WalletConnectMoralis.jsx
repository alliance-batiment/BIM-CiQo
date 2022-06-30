import { useEffect, useState } from "react";
import {
  Modal,
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
  Box
} from '@mui/material';
import { useMoralis } from "react-moralis";
import { getEllipsisTxt } from "./helpers/formatters";
import { getExplorer } from "./helpers/networks";
import { connectors } from "./config";



const styles = {
  account: {
    height: "42px",
    padding: "0 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
    borderRadius: "12px",
    backgroundColor: "rgb(244, 244, 244)",
    cursor: "pointer",
  },
  text: {
    color: "#21BF96",
  },
  connector: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "auto",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "20px 5px",
    cursor: "pointer",
  },
  icon: {
    alignSelf: "center",
    fill: "rgb(40, 13, 95)",
    flexShrink: "0",
    marginBottom: "8px",
    height: "30px",
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  }
};

const WalletConnectMoralis = ({

}) => {
  const { authenticate, isAuthenticated, account, chainId, logout } = useMoralis();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

  if (!isAuthenticated || !account) {
    return (
      <>
        <div onClick={() => setIsAuthModalVisible(true)}>
          <p style={styles.text}>Authenticate</p>
        </div>
        <Modal
          hideBackdrop
          open={isAuthModalVisible}
          onClose={() => setIsAuthModalVisible(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...styles.modal, width: 400 }}>
            <div
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "20px",
              }}
            >
              Connect Wallet
          </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {connectors.map(({ title, icon, connectorId }, key) => (
                <div
                  style={styles.connector}
                  key={key}
                  onClick={async () => {
                    try {
                      await authenticate({ provider: connectorId });
                      window.localStorage.setItem("connectorId", connectorId);
                      setIsAuthModalVisible(false);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  <img src={icon} alt={title} style={styles.icon} />
                  <Typography style={{ fontSize: "14px" }}>{title}</Typography>
                </div>
              ))}
            </div>
          </Box>
        </Modal>
      </>
    );
  }

  return (
    <>
      {/* <button
        onClick={async () => {
          try {
            console.log("change")
            await web3._provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x38" }],
            });
            console.log("changed")
          } catch (e) {
            console.error(e);
          }
        }}
      >
        Hi
      </button> */}
      <div style={styles.account} onClick={() => setIsModalVisible(true)}>
        <p style={{ marginRight: "5px", ...styles.text }}>
          {getEllipsisTxt(account, 6)}
        </p>
        {/* <Blockie currentWallet scale={3} /> */}
      </div>
      <Modal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          Account
        <Card
            style={{
              marginTop: "10px",
              borderRadius: "1rem",
            }}
            bodyStyle={{ padding: "15px" }}
          >
            {/* <Address
            avatar="left"
            size={6}
            copyable
            style={{ fontSize: "20px" }}
          /> */}
            <div style={{ marginTop: "10px", padding: "0 10px" }}>
              <a
                href={`${getExplorer(chainId)}/address/${account}`}
                target="_blank"
                rel="noreferrer"
              >
                {/* <SelectOutlined style={{ marginRight: "5px" }} /> */}
              View on Explorer
            </a>
            </div>
          </Card>
          <Button
            size="large"
            type="primary"
            style={{
              width: "100%",
              marginTop: "10px",
              borderRadius: "0.5rem",
              fontSize: "16px",
              fontWeight: "500",
            }}
            onClick={async () => {
              await logout();
              window.localStorage.removeItem("connectorId");
              setIsModalVisible(false);
            }}
          >
            Disconnect Wallet
        </Button>
        </>
      </Modal>
    </>
  );
};

export default WalletConnectMoralis;