import React, { useEffect, useState } from 'react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { NextPage } from 'next';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

const Index: NextPage = () => {
    const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
    const { wallet, connected, connecting, adapter } = useWallet();
    const { connection } = useConnection();
    const [isConnecting, setConnecting] = useState(false);
    const [isConnected, setConnected] = useState(false);
    const [address, setAddress] = useState('');
    const [nfts, setNfts] = useState([] as string[]);

    useEffect(() => {
        if (isConnected) setConnecting(false);
        if (connected && !isConnected && !isConnecting) {
            // check nft
            if (wallet && adapter?.publicKey) {
                const publicKey = adapter.publicKey;
                setConnecting(true)
                fetch('/api/nfts')
                    .then(async res => {
                        const nftList = await res.json();

                        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                            publicKey,
                            {
                                programId: new PublicKey(TOKEN_PROGRAM_ID)
                            }
                        );


                        if (tokenAccounts && tokenAccounts.value.length > 0) {
                            const eligibleNfts: string[] = [];
                            for (var i = 0; i < tokenAccounts.value.length; ++i) {
                                const { account } = tokenAccounts.value[i];
                                if (account.data.parsed.info.tokenAmount.amount === '1') {
                                    if (nftList.includes(account.data.parsed.info.mint)) {
                                        eligibleNfts.push(account.data.parsed.info.mint);
                                    }
                                }
                            }

                            if (eligibleNfts.length > 0) {
                                setAddress(publicKey.toBase58());
                                setNfts(eligibleNfts);
                                setConnected(true);
                                return;
                            }
                        }
                        adapter.disconnect().then(() => setConnecting(false));
                    });
            }
        }


    }, [connected, connecting, isConnected, isConnecting, wallet, adapter, connection]);

    useEffect(() => {
        if (nfts.length > 0) {
            // fetch image url
        }
    }, [nfts, connection]);

    return (
        <div>
            {!connected && !isConnected ?
                <WalletMultiButton /> :
                connected && !isConnected ?
                    <span>...connecting</span> :
                    <></>
            }

            {isConnected ? (
                <div>
                    <p>address : { address }</p>
                    <WalletDisconnectButton />
                </div>
            ) : <></>}
        </div>
    );
};

export default Index;
