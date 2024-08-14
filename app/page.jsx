"use client";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Plots from "@/components/home/Plots";

export default function Home() {
  return (
    <main className="mx-auto py-3 mt-3 mb-8">
      <Provider store={store}>
        <Plots />
      </Provider>
    </main>
  );
}
