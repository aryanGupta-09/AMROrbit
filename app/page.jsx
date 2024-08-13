"use client";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Plots from "@/components/home/Plots";

export default function Home() {
  return (
    <main className="mx-auto pt-4">
      <Provider store={store}>
        <Plots />
      </Provider>
    </main>
  );
}
