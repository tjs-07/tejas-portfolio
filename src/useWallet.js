import { useCallback, useEffect, useState } from "react";

const CHAINS = {
  "0x1": "Ethereum", "0xaa36a7": "Sepolia", "0x89": "Polygon", "0xa4b1": "Arbitrum One",
  "0xa": "Optimism", "0x2105": "Base", "0x38": "BNB Chain",
};
const eth = () => (typeof window !== "undefined" ? window.ethereum : undefined);
const toEth = (hex) => (Number(BigInt(hex)) / 1e18).toFixed(4);

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [chain, setChain] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");
  const hasProvider = !!eth();

  const refresh = useCallback(async (acc) => {
    const p = eth();
    if (!p || !acc) { setBalance(null); return; }
    try {
      const [id, bal] = await Promise.all([
        p.request({ method: "eth_chainId" }),
        p.request({ method: "eth_getBalance", params: [acc, "latest"] }),
      ]);
      setChain(CHAINS[id] || `Chain ${parseInt(id, 16)}`);
      setBalance(toEth(bal));
    } catch (e) { setError(e.message); }
  }, []);

  useEffect(() => {
    const p = eth();
    if (!p) return;
    p.request({ method: "eth_accounts" }).then((a) => { setAccount(a[0] || null); refresh(a[0]); }).catch(() => {});
    const onAccounts = (a) => { setAccount(a[0] || null); refresh(a[0]); };
    const onChain = () => window.location.reload();
    p.on?.("accountsChanged", onAccounts);
    p.on?.("chainChanged", onChain);
    return () => { p.removeListener?.("accountsChanged", onAccounts); p.removeListener?.("chainChanged", onChain); };
  }, [refresh]);

  const connect = async () => {
    setError("");
    try {
      const a = await eth().request({ method: "eth_requestAccounts" });
      setAccount(a[0]); refresh(a[0]);
    } catch (e) { setError(e.code === 4001 ? "Connection was rejected in your wallet." : e.message); }
  };
  const disconnect = () => { setAccount(null); setBalance(null); setChain(null); };

  const sign = async (message) => {
    setError("");
    try {
      return await eth().request({ method: "personal_sign", params: [message, account] });
    } catch (e) { setError(e.code === 4001 ? "Signature was rejected in your wallet." : e.message); return null; }
  };

  const sendTip = async (to, amountEth) => {
    setError("");
    try {
      const wei = BigInt(Math.round(parseFloat(amountEth) * 1e9)) * 1000000000n;
      return await eth().request({
        method: "eth_sendTransaction",
        params: [{ from: account, to, value: "0x" + wei.toString(16) }],
      });
    } catch (e) { setError(e.code === 4001 ? "Transaction was rejected in your wallet." : e.message); return null; }
  };

  return { account, chain, balance, error, hasProvider, connect, disconnect, sign, sendTip };
}
