"use client";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Options from "@/components/surrogate-indicators/Options";
import Plots from "@/components/surrogate-indicators/Plots";

export default function SurrogateIndicators() {
    return (
        <main className="mx-auto my-6">
            <Provider store={store}>
                <Options />
                <Plots />
            </Provider>
        </main>
    );
}