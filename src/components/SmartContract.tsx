import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import {
  BrowserProvider,
  Contract,
  formatUnits,
  parseEther,
  toBigInt,
} from "ethers";
import { useEffect, useState } from "react";

const ChizuAddress = "0xD73220Cb4715C566b8e1666fAace44B8a3979790";

// taken from the Contract Source Code
const foundersPass = "0xcF2Bc3205c58F44A74eb489884C2619D51FF6bc1";
const execFoundersPass = "0x3115549Dc529776C03fD868E314a9796D91F2ad0";

const ChizuAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint)",
  //   "function transfer(address to, uint amount)",
  //   "event Transfer(address indexed from, address indexed to, uint amount)",
  "function mint(uint payableAmount, uint quantity)",
];

export default function SmartContract() {
  const [foundersPassToken, setFoundersPassToken] = useState(null);
  const [execFoundersPassToken, setExecFoundersPassToken] = useState(null);
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [mintPrice, setMintPrice] = useState(0.003);
  const [freeMints, setFreeMints] = useState(0);

  useEffect(() => {
    if (isConnected) {
      getBalance();
    }
  }, [isConnected]);

  async function getBalance() {
    if (!isConnected) {
      alert("user is disconnected!");
      throw Error("User disconnected");
    }

    if (walletProvider === undefined) {
      alert("wallet provider not available!");
      throw Error("wallet provider not available!");
    }
    try {
      const ethersProvider = new BrowserProvider(walletProvider!);
      const signer = await ethersProvider.getSigner();
      // The Contract object
      console.log(address);
      const USDTContract = new Contract(ChizuAddress, ChizuAbi, signer);
      const USDTBalance = await USDTContract.balanceOf(address);
      console.log(formatUnits(USDTBalance, 18));

      const FoundersPassContract = new Contract(foundersPass, ChizuAbi, signer);
      const foundersPassBalance = await FoundersPassContract.balanceOf(address);
      console.log("founders pass", foundersPassBalance);
      setFoundersPassToken(foundersPassBalance);

      const ExecFoundersPassContract = new Contract(
        execFoundersPass,
        ChizuAbi,
        signer
      );
      const execfoundersPassBalance = await ExecFoundersPassContract.balanceOf(
        address
      );
      console.log("exec founders pass", execfoundersPassBalance);
      setExecFoundersPassToken(execfoundersPassBalance);
      //   console.log(execfoundersPassBalance === 0n);

      if (foundersPassBalance !== 0n && execfoundersPassBalance !== 0n) {
        console.log("user has both Passes");
        setMintPrice(0.001);
        setFreeMints(5);
      } else if (foundersPassBalance === 0n && execfoundersPassBalance !== 0n) {
        console.log("user has the exec founders pass");
        setMintPrice(0.001);
        setFreeMints(3);
      } else if (foundersPassBalance !== 0n && execfoundersPassBalance === 0n) {
        console.log("user has the founders pass");
        setMintPrice(0.001);
        setFreeMints(1);
      } else if (foundersPassBalance === 0n && execfoundersPassBalance === 0n) {
        console.log("user has no passes");
        setMintPrice(0.003);
        setFreeMints(0);
      }
    } catch (e) {
      alert("there was an error fetching user balance.");
      console.error("error occurred when fetching details", e);
    }
  }

  async function MintToken() {
    try {
      const ethersProvider = new BrowserProvider(walletProvider!);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(ChizuAddress, ChizuAbi, signer);
      const balance = await contract.balanceOf(address);
      console.log("user balance ", balance);

      console.log("minting price ", mintPrice);
      const parsedPrice = parseEther(mintPrice.toString());
      console.log("minting price parsed ", parsedPrice);

      const quantityValue = toBigInt(1);
      //   const quantityValue = formatUnits("1", 18);
      console.log("quantity ", quantityValue);
      const mintToken = await contract.mint(parsedPrice, quantityValue);
      console.log(mintToken);
    } catch (e) {
      console.error("error occcured while minitng", e);
    }
  }

  return (
    <>
      <div className="flex justify-center my-5 mt-10">
        <button className="bg-blue-400 rounded-xl p-2" onClick={getBalance}>
          {foundersPassToken !== null ? "Refresh" : "Get"} User Balance
        </button>
      </div>
      <div>
        {foundersPassToken !== null && (
          <div className="my-2">
            {foundersPassToken === 0n ? (
              <div className="p-4 bg-red-700 font-light text-center">
                You Do Not have the Founders Pass
              </div>
            ) : (
              <div className="p-2 bg-green-500 font-bold text-center">
                You Have the Founders Pass
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        {execFoundersPassToken !== null && (
          <div className="my-2">
            {execFoundersPassToken === 0n ? (
              <div className="p-4 bg-red-700 font-light text-center">
                You Do Not have the Executive Founders Pass
              </div>
            ) : (
              <div className="p-2 bg-green-500 font-bold text-center">
                You Have the Executive Founders Pass
              </div>
            )}
          </div>
        )}
      </div>
      <div className="text-center text-blue-300 font-bold text-2xl">
        You can Mint The NFTs with a price of {mintPrice.toString()} ETH
      </div>
      <div>
        {freeMints !== 0 && <div>You can mint {freeMints} NFTs for free.</div>}
      </div>
      <div className="mt-5 flex justify-center">
        <button
          onClick={MintToken}
          className="bg-green-500 p-3 rounded-full font-bold text-lg"
        >
          Mint NFTs
        </button>
      </div>
    </>
  );
}
