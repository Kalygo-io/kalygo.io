import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { PeraWalletConnect } from "@perawallet/connect";
import { AlgorandChainIDs } from "@perawallet/connect/dist/util/peraWalletTypes";

type EmptyNetwork = "";
type SupportedAlgorandNetworks = "MainNet" | "TestNet" | "localhost";
type SupportedEthereumNetworks = "Mainnet" | "Sepolia" | "Goerli" | "localhost";
type SupportedNetworks =
  | EmptyNetwork
  | SupportedEthereumNetworks
  | SupportedAlgorandNetworks;

type SupportedBlockchains = "Algorand" | "Ethereum" | "Solana";
interface SupportedBlockchain {
  name: string;
  enabled: boolean;
}

// Define a type for the slice state
interface SettingsState {
  selectedEthereumNetwork: string;
  selectedAlgorandNetwork: string;
  supportedAlgorandNetworksAlgoSigner: string[];
  supportedAlgorandNetworksPera: string[];
  supportedAlgorandWallets: { name: string; enabled: boolean }[];
  supportedEthereumNetworks: string[];
  supportedBlockchains: SupportedBlockchain[];
  accountsEthereum: any[];
  accountsAlgorand: any[];
  isPeraSessionConnected: boolean;
  selectedEthereumAccount: string;
  selectedAlgorandAccount: string;
  selectedBlockchain: string;
  selectedAlgorandWallet: string;
}

interface SettingsStateForSpread {
  network?: string[];
  supportedBlockchains?: SupportedBlockchain[];
  supportedNetworks?: string[];

  selectedAccount?: string;
  selectedEthereumNetwork?: string;
  selectedAlgorandNetwork?: string;
  selectedBlockchain?: string;
  selectedAlgorandWallet?: string;
  accountsAlgorand?: any[];
  accountsEthereum?: any[];

  isPeraSessionConnected?: boolean;
}

// Define the initial state using that type
const initialState: SettingsState = {
  selectedEthereumNetwork: "Goerli",
  selectedAlgorandNetwork: "TestNet",
  // selectedAlgorandNetwork: "localhost",
  supportedAlgorandNetworksAlgoSigner: ["MainNet", "TestNet", "localhost"],
  supportedAlgorandNetworksPera: ["MainNet", "TestNet"],
  supportedAlgorandWallets: [
    {
      name: "AlgoSigner",
      enabled: false,
    },
    {
      name: "Pera",
      enabled: true,
    },
  ],
  supportedEthereumNetworks: ["Mainnet", "Sepolia", "Goerli", "localhost"],
  supportedBlockchains: [
    { name: "Algorand", enabled: true },
    { name: "Ethereum", enabled: false },
    { name: "Polygon", enabled: false },
    { name: "Cardano", enabled: false },
    { name: "Avalanche", enabled: false },
    { name: "Solana", enabled: false },
  ],
  accountsEthereum: [],
  accountsAlgorand: [],
  // selectedAccount: "T4N73AL4F4ZL6VJZWJ2QP2KV5VJEHJYFTFMVNTWG45MP4S4EDPJIWC45WI",
  // selectedAccount: "RHKHUONCBB7JOIQ2RDCSV3NUX5JFKLLOG2RKN4LRIJ6DQMAIBTFLLO72DM",
  // selectedAlgorandAccount:
  //   "YRRGGYPFQYUIKHTYCWL3V7FGMDNNVZ46QJKE6GQQDURQL3NIVUIUFQSXAY", // localhost
  // selectedAlgorandWallet: "AlgoSigner",
  selectedAlgorandWallet: "Pera",
  // selectedAlgorandAccount:
  //   "STRA24PIDCBJIWPSH7QEBM4WWUQU36WVGCEPAKOLZ6YK7IVLWPGL6AN6RU",
  selectedAlgorandAccount:
    "MTUSAPRF4IN37AYD5OO2UUXFTDBU53IFYICMTTXA4BCH66MU7MWP5IBDFI",
  // selectedAlgorandAccount:
  //   "MTUSAPRF4IN37AYD5OO2UUXFTDBU53IFYICMTTXA4BCH66MU7MWP5IBDFI",
  selectedEthereumAccount: "",
  // selectedBlockchain: "Ethereum",
  selectedBlockchain: "Algorand",
  // selectedAccount: "QHGMAMCTEHZ2RQV2DRXSPAKIIT3REVK46CHNDJSW6WNXJLSJ7BB76NHDGY",
  // selectedAccount: "",
  isPeraSessionConnected: false,
};

export const fetchAlgoSignerNetworkAccounts = createAsyncThunk(
  "algosigner/fetchNetworkAccounts",
  async (network: string, thunkAPI) => {
    console.log("->", network, thunkAPI);

    if (typeof (window as any).AlgoSigner !== "undefined") {
      console.log("window.AlgoSigner", (window as any).AlgoSigner);

      try {
        let accounts = await (window as any).AlgoSigner.accounts({
          ledger: network,
        });

        return {
          // network,
          accounts,
        };
      } catch (e) {
        console.error(e);

        return {
          // network,
          accounts: [],
        };
      }
    } else {
      console.error("NO AlgoSigner");

      return {
        // network,
        accounts: [],
      };
    }
  }
);

export const fetchPeraNetworkAccounts = createAsyncThunk(
  "pera/fetchNetworkAccounts",
  async (network: string, thunkAPI) => {
    console.log("->->->", network, thunkAPI);

    let chainId: AlgorandChainIDs = 4160;
    switch (network) {
      case "MainNet":
        chainId = 416001;
        break;
      case "TestNet":
        chainId = 416002;
        break;
      case "BetaNet":
        chainId = 416003;
        break;
    }

    console.log("chainId", chainId);

    try {
      const peraWallet = new PeraWalletConnect({
        chainId: chainId,
      });

      let accounts = await peraWallet.connect();
      peraWallet.connector?.on("disconnect", () => peraWallet.disconnect());

      console.log("accounts", accounts);

      console.log("PLATFORM...", peraWallet.platform);

      return {
        accounts,
      };

      // .then((newAccounts) => {
      //   // Setup the disconnect event listener
      //   peraWallet.connector?.on("disconnect", () => peraWallet.disconnect());

      //   // setAccountAddress(newAccounts[0]);

      //   console.log("newAccounts ->", newAccounts);
      // })
      // .catch((error: any) => {
      //   // You MUST handle the reject because once the user closes the modal, peraWallet.connect() promise will be rejected.
      //   // For the async/await syntax you MUST use try/catch
      //   if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
      //     // log the necessary errors
      //   }
      // });
    } catch (e) {
      console.error(e);

      return {
        accounts: [],
      };
    }
  }
);

export const disconnectPera = createAsyncThunk(
  "pera/disconnectPera",
  async (network: string, thunkAPI) => {
    console.log("->->->", network, thunkAPI);

    let chainId: AlgorandChainIDs = 4160;
    switch (network) {
      case "MainNet":
        chainId = 416001;
        break;
      case "TestNet":
        chainId = 416002;
        break;
      case "BetaNet":
        chainId = 416003;
        break;
    }

    console.log("chainId", chainId);

    try {
      const peraWallet = new PeraWalletConnect({
        chainId: chainId,
      });

      peraWallet.disconnect();

      return {
        accounts: [],
      };
    } catch (e) {
      return {
        accounts: [],
      };
    }
  }
);

export const fetchMetamaskNetworkAccounts = createAsyncThunk(
  "metamask/fetchNetworkAccounts",
  async (network: string, thunkAPI) => {
    if (typeof (window as any).ethereum !== "undefined") {
      // ethereum.request({ method: 'eth_requestAccounts' });

      console.log("window.ethereum", (window as any).ethereum);
      try {
        let accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log("accounts", accounts);

        return {
          // network,
          accounts: accounts,
        };
      } catch (e) {
        console.error(e);
        return {
          // network,
          accounts: [],
        };
      }
    } else {
      console.error("NO Metamask");

      return {
        // network,
        accounts: [],
      };
    }
  }
);

export const settingsSlice = createSlice({
  name: "settings",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    changeEthereumNetwork: (
      state: SettingsState,
      action: PayloadAction<SupportedNetworks>
    ) => {
      state.selectedEthereumNetwork = action.payload;
    },
    changeAlgorandNetwork: (
      state: SettingsState,
      action: PayloadAction<SupportedNetworks>
    ) => {
      state.selectedAlgorandNetwork = action.payload;
    },
    updateState: (
      state: SettingsState,
      action: PayloadAction<SettingsStateForSpread>
    ) => {
      state = {
        ...state,
        ...action.payload,
      };

      return state;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      fetchAlgoSignerNetworkAccounts.fulfilled,
      (state, action) => {
        // Add user to the state array
        // state.entities.push(action.payload);
        state.accountsAlgorand = action.payload.accounts;
        // state.selectedAccount =
        //   action.payload.accounts.length > 0
        //     ? action.payload.accounts[0].address
        //     : "";
        // state.selectedNetwork = action.payload.network as SupportedNetworks;
      }
    );

    builder.addCase(fetchPeraNetworkAccounts.fulfilled, (state, action) => {
      state.accountsAlgorand = action.payload.accounts;
    });

    builder.addCase(disconnectPera.fulfilled, (state, action) => {
      state.accountsAlgorand = action.payload.accounts;
    });

    builder.addCase(fetchMetamaskNetworkAccounts.fulfilled, (state, action) => {
      // Add user to the state array
      // state.entities.push(action.payload);
      state.accountsEthereum = action.payload.accounts;
      // state.selectedAccount =
      //   action.payload.accounts.length > 0
      //     ? action.payload.accounts[0].address
      //     : "";
      // state.selectedNetwork = action.payload.network as SupportedNetworks;
    });
  },
});

export const { changeEthereumNetwork, changeAlgorandNetwork, updateState } =
  settingsSlice.actions;

export default settingsSlice.reducer;
