import { derived, writable } from 'svelte/store';
import type { Coin } from '@cosmjs/stargate';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { MsgBroadcaster, WalletStrategy } from '@injectivelabs/wallet-ts';
import { Network } from '@injectivelabs/networks';
import { Address as EthereumUtilsAddress } from 'ethereumjs-util';
import { toBech32 } from '@cosmjs/encoding';

export const WALLET_STORE = writable<WalletStrategy | null>(null);
export const SIGNING_COSMOS_CLIENT = writable<SigningCosmWasmClient | null>(null);
export const USER_ADDRESS = writable<string | null>(null);
export const USER_BALANCES = writable<Coin[]>([]);

WALLET_STORE.subscribe(async (wallet) => {
	if (wallet) {
		let [address] = await wallet.getAddresses();
		if (address.startsWith('0x')) {
			// TODO: enforce goerli network
			const buffer = EthereumUtilsAddress.fromString(address).toBuffer();
			address = toBech32('inj', buffer);
		}
		USER_ADDRESS.set(address);
	} else {
		USER_ADDRESS.set(null);
	}
});

export const MESSAGE_BROADCASTER_STORE = derived(WALLET_STORE, ($wallet) => {
	if ($wallet) {
		return new MsgBroadcaster({
			walletStrategy: $wallet,
			// FIXME: don't quite like having this hardcoded
			network: Network.Testnet
		});
	} else {
		return null;
	}
});

export const IS_USER_CONNECTED = derived(USER_ADDRESS, ($userAddress) => {
	return $userAddress !== null;
});
