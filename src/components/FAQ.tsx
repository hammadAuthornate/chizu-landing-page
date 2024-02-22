import { useState } from "react";

export default function FAQ() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  function HelpIcon() {
    return (
      <svg
        className="w-5 h-5 me-2 shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        ></path>
      </svg>
    );
  }
  function DropDownIcon({ id }: { id: number }) {
    return (
      <svg
        data-accordion-icon
        className={`w-3 h-3 ${selectedId === id ? "" : "rotate-180"} shrink-0`}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5 5 1 1 5"
        />
      </svg>
    );
  }

  const FAQs = [
    {
      title: "What is Chizu?",
      description:
        "Chizu is a token on the ether network that can mint NFTs on the blockchain.",
      id: 1,
    },
    {
      title: "How can i mint for free?",
      description:
        "If you have the Founders Pass OR the Executive Founders Pass, Chizu can allow you to mint NFTs for free for a specific number of times at a reduced minting price.",
      id: 2,
    },
    {
      title: "What are the minting charges?",
      description:
        "The Standard Minting charges are 0.003 Eth, but for Users that have Founders pass or the Executive Founders Pass, they have the reduced minitng price of 0.001 ETH.",
      id: 3,
    },
  ];

  return (
    <div className="mt-20 flex flex-col items-center">
      <div className="max-w-xl w-full">
        <div className="my-8 font-extrabold text-4xl text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
          Frequently Asked Questions
        </div>
        <div id="accordion-open" data-accordion="open">
          <div>
            {FAQs.map((faq, index) => (
              <div key={index}>
                <h2 id={faq.id.toString()}>
                  <button
                    onClick={() => {
                      selectedId === faq.id
                        ? setSelectedId(null)
                        : setSelectedId(faq.id);
                    }}
                    type="button"
                    className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-200 border  border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-200  hover:bg-gray-100/20  gap-3"
                    data-accordion-target={faq.id.toString()}
                    aria-expanded="true"
                    aria-controls={faq.id.toString()}
                  >
                    <span className="flex items-center">
                      <HelpIcon /> {faq.title}
                    </span>
                    <DropDownIcon id={faq.id} />
                  </button>
                </h2>
                {selectedId === faq.id && (
                  <div
                    id={faq.id.toString()}
                    className="my-4"
                    aria-labelledby={faq.id.toString()}
                  >
                    <div className="p-5 border rounded-md border-gray-200 ">
                      <p className="mb-2 text-gray-200 text-center">
                        {faq.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
