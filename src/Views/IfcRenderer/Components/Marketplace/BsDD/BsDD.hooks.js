import { useEffect, useState } from 'react';
import axios from "axios";

const {
  REACT_APP_THIRD_PARTY_API
} = process.env;

function UseBsDD({
  bimData
}) {
  const [state, setState] = useState({
    bimData,
    loading: false,
    views: {
      value: "home",
      list: []
    },
    search: {
      value: '',
      list: []
    },
    domains: {
      value: "",
      list: [],
      selection: []
    },
    classifications: {
      value: "",
      list: []
    },
    properties: {
      value: "",
      list: []
    }
  });

  async function handleGetCountry() {
    try {
      const res = await axios({
        method: "get",
        url: `${REACT_APP_THIRD_PARTY_API}/bsdd/country`
      })
      console.log('res', res.data)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function handleGetDomain() {
    try {
      const res = await axios({
        method: "get",
        url: `${REACT_APP_THIRD_PARTY_API}/bsdd/domain`,
        params: {
          namespaceUri: ''
        }
      })
      console.log('res', res.data)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function handleGetTextSearchListOpen({
    searchText,
    typeFilter,
    domainNamespaceUris
  }) {
    try {
      setState({
        ...state,
        loading: true
      })
      const res = await axios({
        method: "get",
        url: `${REACT_APP_THIRD_PARTY_API}/bsdd/textSearchListOpen`,
        params: {
          searchText,
          typeFilter,
          domainNamespaceUris
        }
      })
      console.log('res', res.data)
      const {
        domains,
        classifications,
        properties
      } = res.data;
      console.log('domains', domains)
      setState({
        ...state,
        loading: false,
        search: {
          value: searchText,
          list: [...state.search.list, searchText]
        },
        domains: {
          ...state.domains,
          list: domains
        },
        classifications: {
          ...state.classifications,
          list: classifications
        },
        properties: {
          ...state.properties,
          list: properties
        }
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  const handleGetClassification = async (view, data) => {
    try {
      setState({
        ...state,
        loading: true
      })
      const res = await axios({
        method: "get",
        url: `${REACT_APP_THIRD_PARTY_API}/bsdd/classification`,
        params: {
          namespaceUri: data.namespaceUri,
          languageCode: '',
          includeChildClassificationReferences: true
        }
      })
      console.log('res', res.data);
      const classification = res.data;

      setState({
        ...state,
        loading: false,
        views: {
          ...state.views,
          value: view
        },
        classifications: {
          ...state.classifications,
          value: classification
        }
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  const handleGetProperty = async (view, data) => {
    try {
      setState({
        ...state,
        loading: true
      })
      console.log('data', data);
      const res = await axios({
        method: "get",
        url: `${REACT_APP_THIRD_PARTY_API}/bsdd/property`,
        params: {
          namespaceUri: data.namespaceUri,
          languageCode: '',
        }
      })
      console.log('res', res.data);
      const property = res.data;

      setState({
        ...state,
        loading: false,
        views: {
          ...state.views,
          value: view
        },
        properties: {
          ...state.properties,
          value: property
        }
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  async function handleGetDomainClassifications() {
    try {
      const res = await axios({
        method: "get",
        url: `${REACT_APP_THIRD_PARTY_API}/bsdd/domain/classifications`,
        params: {
          namespaceUri: '',
          useNestedClassifications: ''
        }
      })
      console.log('res', res.data)
    } catch (err) {
      console.log('err', err)
    }
  }


  async function handleGetLanguage() {
    try {
      const res = await axios({
        method: "get",
        url: `${REACT_APP_THIRD_PARTY_API}/bsdd/language`
      })
      console.log('res', res.data)
    } catch (err) {
      console.log('err', err)
    }
  }

  return {
    state,
    setState,
    handleGetCountry,
    handleGetDomain,
    handleGetTextSearchListOpen,
    handleGetClassification,
    handleGetProperty
  }
};

export {
  UseBsDD
};