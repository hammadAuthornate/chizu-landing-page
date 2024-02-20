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
  //   "function mint(uint payableAmount, uint quantity)",
  "function mint(uint256 quantity) external payable",
];

export default function SmartContract() {
  const [foundersPassToken, setFoundersPassToken] = useState(null);
  const [execFoundersPassToken, setExecFoundersPassToken] = useState(null);
  const [currentUserBalance, setCurrentUserBalance] = useState<
    number | string | null
  >(null);
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [mintPrice, setMintPrice] = useState(0.003);
  const [freeMints, setFreeMints] = useState(0);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      const formatedBalance = formatUnits(USDTBalance, 18);
      console.log(formatedBalance);
      setCurrentUserBalance(formatedBalance);

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
      setErrorMessage(null);
    } catch (e) {
      alert("there was an error fetching user balance.");
      console.error("error occurred when fetching details", e);
      setErrorMessage(e as string);
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
      const mintToken = await contract.mint(
        // parsedPrice.toString()
        quantityValue.toString()
      );
      const res = await mintToken.wait();
      console.log(mintToken);
      console.log(res);
      setErrorMessage(null);
    } catch (e) {
      console.error("error occcured while minitng", e);
      setErrorMessage(e as string);
    }
  }

  return (
    <>
      <div className="my-8 mt-20 font-extrabold text-4xl text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
        Chizu Token Minter
      </div>

      <div id="mint" className="flex justify-center my-5 mt-10">
        <button
          className="bg-blue-400 rounded-xl py-2 px-6 font-bold"
          onClick={getBalance}
        >
          {foundersPassToken !== null ? "Refresh" : "Get"} User Balance
        </button>
      </div>

      <div className="flex justify-center ">
        <div className="bg-slate-900/50 max-w-lg w-full rounded-2xl p-10 shadow-2xl drop-shadow-2xl shadow-purple-600">
          <div>
            {currentUserBalance !== null && (
              <div className="text-center text-lg">
                <u>Current Balance:</u> {currentUserBalance}
              </div>
            )}
          </div>
          <div className="flex justify-center">
            {foundersPassToken !== null && (
              <div className="my-2">
                {foundersPassToken === 0n ? (
                  <div className="p-2 bg-purple-700 font-light text-center max-w-sm rounded-xl">
                    <img src="/cross.svg" alt="" className="inline" />
                    You Do Not have the Founders Pass
                  </div>
                ) : (
                  <div className="p-2 bg-blue-500 font-bold text-center">
                    <img src="/check.svg" alt="" className="inline" />
                    You Have the Founders Pass
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-center">
            {execFoundersPassToken !== null && (
              <div className="my-2">
                {execFoundersPassToken === 0n ? (
                  <div className="p-2 bg-purple-700 font-light text-center max-w-sm rounded-xl">
                    <img src="/cross.svg" alt="" className="inline" />
                    You Do Not have the Executive Founders Pass
                  </div>
                ) : (
                  <div className="p-2 bg-blue-500 font-bold text-center">
                    <img src="/check.svg" alt="" className="inline" />
                    You Have the Executive Founders Pass
                  </div>
                )}
              </div>
            )}
          </div>
          {isConnected ? (
            <div>
              <div className="text-center text-blue-400 font-bold text-2xl text-balance">
                NFT Minting Price: {mintPrice.toString()} ETH
              </div>
              <div>
                {freeMints !== 0 && (
                  <div>You can mint {freeMints} NFTs for free.</div>
                )}
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  onClick={MintToken}
                  className="bg-green-600 py-2 px-10 rounded-full font-bold text-lg"
                >
                  Mint NFTs
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-bounce text-center">
              Waiting for Wallet to Connect...
            </div>
          )}
          <div className="flex justify-center">
            {errorMessage && (
              <div className="bg-red-800 text-center p-2 rounded-3xl z-50 my-5">
                An Error Has Occured!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
