export const snapId = import.meta.env.VITE_SNAP_ID ?? `local:http://localhost:8080`;
const snapVersion = import.meta.env.VITE_SNAP_VERSION;
const initialJsonString = "{}";
const installParams = JSON.parse(initialJsonString);
installParams[snapId] = { version: snapVersion };

declare global {
    interface Window {
        ethereum: any;
    }
}

export const isMetaMaskInstalled = (): boolean | undefined => !!window.ethereum && window.ethereum.isMetaMask;

export const isSnapInstalled = async (): Promise<boolean | undefined> => {
  const result = await window.ethereum.request({ method: 'wallet_getSnaps' });
  return Object.keys(result).includes(snapId);
};

export const isSnapInitialized = async (): Promise<boolean | undefined> => {
  const result = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId,
      request: {
        method: 'initialized',
      },
    },
  });
  return result.data.initialized;
};

export const getChains = async () => {
  const result = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId,
      request: {
        method: 'getChains',
      },
    },
  });
  return result.data.chains;
};

export const installSnap = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_requestSnaps',
      params: installParams,
    });

  } catch (err) {
    console.error(err);
    throw err
  }
};

export const initSnap = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'initialize',
        },
      },
    });

  } catch (err) {
    console.error(err);
    throw err
  }
};

export const initialize = async () => {
  try {

    await installSnap();
    await initSnap();
    
    } catch (error) {
      console.log(error);
    }
}