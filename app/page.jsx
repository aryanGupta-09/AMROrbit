"use client";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Options from "@/components/home/Options";

export default function Home() {
  return (
    <main>
      <Provider store={store}>
        <div className="mt-4 mb-4 text-center">
          <h1 className="text-4xl">Vivli Dashboard</h1>
          <p>A dashboard for visualizing antibiotic resistance data.</p>
        </div>
        <Options />
      </Provider>
    </main>
  );
}
