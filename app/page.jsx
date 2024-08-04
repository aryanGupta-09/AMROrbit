"use client";
import '../polyfills.js';
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Options from "@/components/home/Options";
import Plots from "@/components/home/Plots";

export default function Home() {
  return (
    <main className="w-[90vw] mx-auto">
      <Provider store={store}>
        <div className="mt-4 mb-4 text-center">
          <h1 className="text-4xl">Vivli Dashboard</h1>
          <p>A dashboard for visualizing antibiotic resistance data.</p>
        </div>
        <Options />
        <Plots />
      </Provider>
    </main>
  );
}
