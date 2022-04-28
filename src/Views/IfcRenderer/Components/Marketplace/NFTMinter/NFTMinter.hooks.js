import { useEffect, useState } from 'react';
import {
  Vector2
} from "three";
import axios from "axios";

function UseNFTMinter({
  bimData
}) {
  const [state, setState] = useState({
    bimData,
    loading: true,
    views: {
      value: 'home',
      list: ['home', 'storage', 'validation']
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

  return {
    state,
    setState,
  }
}

export {
  UseNFTMinter
};