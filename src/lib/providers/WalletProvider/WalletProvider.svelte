<script lang="ts" context="module">
	export interface WalletProviderContext {
		connectWallet: (wallet: Wallet) => void;
		getWallets: () => ChainWalletBase[];
		disconnect: VoidFunction;
	}
	export const AUTO_CONNECT_WALLET_KEY = "auto_connect";

</script>

<script lang="ts">
	import { chains, assets } from 'chain-registry';
	import { Wallet as InjectiveWallet, Wallet, WalletStrategy } from '@injectivelabs/wallet-ts';

	import {
		WalletStatus,
		type ChainWalletBase,
		type LogLevel,
		type WalletManager,
		type WalletRepo
	} from '@cosmos-kit/core';

	import { wallets as cosmostationWallets } from '@cosmos-kit/cosmostation';
    import { wallets as leapMmCosmosSnap } from "@cosmos-kit/leap-metamask-cosmos-snap";
    import { wallets as keplr } from "@cosmos-kit/keplr";

	import { onMount, setContext } from 'svelte';
	import { WALLET_PROVIDER_CONTEXT_KEY } from '$lib/constants';
	import { WALLET_STORE } from '$lib/state/App';
	import { ChainId, EthereumChainId } from '@injectivelabs/ts-types';
	import { PUBLIC_ALCHEMY_API_KEY } from '$env/static/public';


	setContext(WALLET_PROVIDER_CONTEXT_KEY, {
		connectWallet: (wallet: InjectiveWallet) => connectToInjWallet(wallet),
		getWallets: () => appWallets,
		disconnect: async () => {
			await walletRepo.current?.disconnect()
			localStorage.removeItem(AUTO_CONNECT_WALLET_KEY);
			$WALLET_STORE = null;

		}
	});

	let appWallets: ChainWalletBase[] = [];
	let walletManager: WalletManager;
	let walletRepo: WalletRepo;

	

	async function connectToInjWallet(wallet: InjectiveWallet) {
		const strategy = new WalletStrategy({
			wallet,
			chainId: ChainId.Testnet,
			ethereumOptions: {
				ethereumChainId: EthereumChainId.Goerli,
				rpcUrl: `https://eth-goerli.g.alchemy.com/v2/${PUBLIC_ALCHEMY_API_KEY}`
			}
		})

		$WALLET_STORE = strategy

		
	}

	async function connectTo(wallet: ChainWalletBase) {
		wallet.activate();
		await wallet.connect();
		const { walletStatus, message } = walletRepo.current!;

		if (walletStatus === WalletStatus.Connected) {
			await wallet.initOfflineSigner();
		}
		localStorage.setItem(AUTO_CONNECT_WALLET_KEY, wallet.walletInfo.prettyName)
		return { walletStatus, message };
	}
</script>

<slot />
