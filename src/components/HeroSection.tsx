export default function HeroSection() {
  return (
    <div className="flex flex-col items-center mt-20">
      <div className="font-extrabold text-4xl text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
        Welcome to Chizu Token Minting
      </div>
      <div className=" mt-8 text-center font-light max-w-md text-xl">
        Chizu NFT Minting creates unique, tradeable digital assets, ushering in
        a new era of professional creativity.
      </div>
      <div
        onClick={() =>
          document!
            .getElementById("mint")!
            .scrollIntoView({ behavior: "smooth" })
        }
        className="cursor-pointer my-8 text-2xl underline underline-offset-8 text hover:text-pink-700"
      >
        Start Minting for Free!
      </div>
    </div>
  );
}
