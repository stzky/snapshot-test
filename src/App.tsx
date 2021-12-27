import React from 'react';
import './App.css';
import { useAsyncCallback } from 'react-async-hook';
import Web3Modal from 'web3modal';
import { Web3Provider } from '@ethersproject/providers';
import snapshot from '@snapshot-labs/snapshot.js';

export const web3Modal = new Web3Modal({
  network: 'rinkeby',
  cacheProvider: false,
});
const hub = 'https://hub.snapshot.org';
const client = new snapshot.Client712(hub);

function App() {
  const [address, setAddress] = React.useState<string>();
  const [provider, setProvider] = React.useState<any>(window.ethereum);

  const connectWallet = useAsyncCallback(async () => {
    try {
      web3Modal.clearCachedProvider();
      const provider_ = await web3Modal.connect();
      const account = provider_.accounts?.[0] || provider_.selectedAddress;
      setProvider(provider_);
      setAddress(account);
    } catch (err) {
      console.log('error connect wallet', err);
    }
  });

  const sendProposal = useAsyncCallback(async () => {
    if (!address || !provider) {
      throw Error('Wallet not connected');
    }
    const receipt = await client.proposal(new Web3Provider(provider), address, {
      space: 'genart-dao.eth',
      type: 'basic',
      title: 'Test Proposal',
      body: 'This is a test proposal description.',
      choices: ['For', 'Against', 'Abstain'],
      start: 1640372917,
      end: 1640977717,
      snapshot: 9871595,
      network: '4',
      strategies:
        '[{"name":"genart","params":{"symbol":"GENART","decimals":18,"tokenAddress":"0xCCDcFced87f8d91028B4FbbB589fb4CDC24d08Fa","membershipAddress":"0xbAdc470F2E159f01396a546FC63D8c0Db2697f3b"}}]',
      plugins: '{}',
      metadata: '{}',
      timestamp: 1640369317,
    });
    console.log('receipt: ', receipt);
  });

  return (
    <div className="App">
      <div className="buttons">
        <button onClick={connectWallet.execute} className="btn-connect">
          connect
        </button>
        <button onClick={sendProposal.execute} className="btn-send">
          send proposal
        </button>
      </div>
      <div>address: {address || 'not connected'}</div>
    </div>
  );
}

export default App;
