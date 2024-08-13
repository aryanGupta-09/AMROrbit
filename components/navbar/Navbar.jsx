"use client";
import Image from 'next/image';
import tavLabLogo from '@/public/images/tavlab.svg';
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import OptionsBar from "./OptionsBar";

export default function Navbar() {
    return (
        <div className="bg-[#C3C8F5] sticky top-0 z-50">
            <div className="flex items-center justify-between pt-4 pb-4">
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                    <h1 className="text-4xl">Vivli Dashboard</h1>
                    <p className="text-lg opacity-70">A dashboard for visualizing antibiotic resistance data.</p>
                </div>
                <div className="ml-auto pr-5">
                    <Image
                        src={tavLabLogo}
                        alt="TavLab logo"
                        className="h-[60px] w-auto"
                    />
                </div>
            </div>
            <Provider store={store}>
                <OptionsBar />
            </Provider>
        </div>
    );
}