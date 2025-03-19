"use client";
import Image from "next/image";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { useEffect, useState } from "react";

export default function Home() {
  const [model, setModel] = useState(null);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
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
        systemInstruction: `You are an literary expert. You explain verse's in most simple language. Use simplest form of english.`,
        safetySettings,
      });

      setModel(model_);
    }
  }, []);

  const submitQuery = async () => {
    const result = await model.generateContent(`Simplify the verse: ${query}`);
    const response = await result.response;
    let text = response.text().toString();
    text = text.replace("*", "");
    setResponse(text);
  };

  return (
    <div className="pt-20">
      <main className="p-4 max-w-3xl mx-auto">
        <textarea
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setResponse("");
          }}
          className="border-2 block border-black/20 p-4 w-full"
          rows={7}
          name=""
          placeholder="Enter a verse"
          id=""
        ></textarea>
        <button onClick={() => submitQuery()} className="bg-background text-white px-5 rounded mt-3 font-semibold h-12">
          Simplify
        </button>
        <div className="mt-7">{response}</div>
      </main>
    </div>
  );
}
