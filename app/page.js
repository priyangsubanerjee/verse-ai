"use client";
import Image from "next/image";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { useEffect, useState } from "react";

export default function Home() {
  const [model, setModel] = useState(null);
  const [response, setResponse] = useState("");
  const [messages, setMessages] = useState([]);
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  useEffect(() => {
    if (true) {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

      const model_ = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `You are an literary expert. You explain verse's in most simple language. Use simplest form of english. also write the meaning of the verse in simple words.`,
        safetySettings,
      });

      setModel(model_);
    }
  }, []);

  const submitQuery = async () => {
    let query = document.getElementById("inputdiv").textContent;
    setMessages((messages) => [...messages, { text: query, type: "user" }]);
    let result = await model.generateContent(`Simplify & also write the meaning of the verse in simple words: ${query}`);
    let response = await result.response;
    response = response.text();
    response = response.replace("*", "");
    setMessages((messages) => [...messages, { text: response, type: "bot" }]);
    document.getElementById("inputdiv").textContent = "";
    document.getElementById("placeholder-dummy").classList.remove("opacity-0");
  };

  return (
    <div className="min-h-svh bg-neutral-50 flex items-center">
      <div className="max-w-[500px] overflow-y-auto w-full border border-neutral-200 bg-white h-[90vh] rounded-xl shadow-2xl shadow-background/5 mx-auto relative">
        <div className="sticky top-0 inset-x-0 bg-white">
          <div className="flex items-center justify-between py-4 px-5">
            <div></div>
            <div className="flex items-center gap-2">
              <img src="/icon.png" className="h-10" alt="" />
              <h2 className="font-semibold text-xl text-neutral-800">Verse.ai</h2>
            </div>
            <button className="h-10 w-10 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5" viewBox="0 0 12 12">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  d="M10 4c-.8-1.1-2-2.5-4.1-2.5c-2.5 0-4.4 2-4.4 4.5s2 4.5 4.4 4.5c1.3 0 2.5-.6 3.3-1.5m1.3-7.5V4c0 .3-.2.5-.5.5H7.5"
                  strokeWidth={1.3}
                ></path>
              </svg>
            </button>
          </div>
          <div className="bg-gradient-to-r from-pink-50 to-blue-50 py-2 text-neutral-700">
            <p className="text-sm text-center">Bridging faith and understanding.</p>
          </div>
        </div>
        <div className="h-auto min-h-svh space-y-2 pt-2 pb-2 px-2">
          {messages.map((message, index) => {
            return (
              <div className="flex" key={index}>
                <div
                  className={`max-w-[80%] p-2 rounded-md text-sm text-neutral-800 leading-relaxed ${
                    message.type == "user" ? "ml-auto bg-blue-50" : " ml-0 bg-neutral-50"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            );
          })}
        </div>
        <div className="sticky bottom-0 inset-x-0 bg-white border-t border-neutral-200 shadow-2xl">
          <div className="flex items-end px-1">
            <div className="w-full h-auto relative ml-3">
              <p id="placeholder-dummy" className="absolute bottom-0 h-full flex items-center transition-all text-neutral-400">
                Start typing here
              </p>
              <div
                onInput={(e) => {
                  let text = e.target.textContent;
                  if (text.length > 0) {
                    document.getElementById("placeholder-dummy").classList.add("opacity-0");
                  } else {
                    document.getElementById("placeholder-dummy").classList.remove("opacity-0");
                  }
                }}
                contentEditable
                id="inputdiv"
                className="w-full relative min-h-14 outline-none pt-4"
              ></div>
            </div>
            <button
              onClick={() => submitQuery()}
              className="h-10 px-4 mb-2 gap-1 bg-neutral-800 text-white rounded-md shrink-0 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M4.4 19.425q-.5.2-.95-.088T3 18.5V14l8-2l-8-2V5.5q0-.55.45-.837t.95-.088l15.4 6.5q.625.275.625.925t-.625.925z"
                ></path>
              </svg>
              <span className="font-medium">Send</span>
            </button>
          </div>
          <div className="bg-neutral-100 py-2 text-neutral-700">
            <p className="text-sm text-center">Ai can make mistakes, so double-check it</p>
          </div>
        </div>
      </div>
    </div>
  );
}
