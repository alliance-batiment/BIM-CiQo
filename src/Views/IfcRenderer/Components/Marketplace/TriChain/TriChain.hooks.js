import { useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Grid,
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Card,
  CardHeader,
  CardActionArea,
  CardContent,
  Avatar,
  IconButton,
  Popover,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Fab,
  CircularProgress
} from "@material-ui/core";
import {
  Vector2
} from "three";
import axios from "axios";

function UseTriChain({
  bimData,
  setBimData
}) {
  const [state, setState] = useState({
    bimData,
    loading: true,
    connection: {
      status: true,
      message: 'Connected',
      provider: 'https://rpc-mumbai.matic.today',
      chainIds: [80001, 137]
    },
    views: {
      value: 'home',
      index: 0,
      list: ['home', 'create-nft', 'my-nfts', 'dashboard', 'resell-nft']
    },
    nfts: {
      value: {
        name: '',
        description: '',
        image: '',
        model: '',
        file: '',
        metadataHash: '',
        tokenId: '',
        tokenURI: '',
        x: 0,
        y: 0,
        z: 0
      },
      list: []
    },
    nft: {
      name: '',
      description: '',
      image: '',
      file: '',
      metadataHash: '',
      rarible: {
        tokenAddress: '',
        tokenId: ''
      }
    }
  })

  const handleAlert = () => {
    console.log('Alert')
  }

  return {
    state,
    setState,
  }
}

export {
  UseTriChain
};