"use client";
import '../polyfills.js';
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Plots from "@/components/home/Plots";

export default function Home() {
  return (
    <main className="w-[90vw] mx-auto mt-4">
      <Provider store={store}>
        <Plots />
      </Provider>
    </main>
  );
}
