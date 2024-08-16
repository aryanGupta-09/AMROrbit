"use client";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Options from "@/components/scorecards/options-bar/Options";
import Plots from "@/components/scorecards/plots/Plots";

export default function Scorecards() {
    return (
        <main className="mx-auto my-6">
            <Provider store={store}>
                <Options />
                <Plots />
            </Provider>
        </main>
    );
}
