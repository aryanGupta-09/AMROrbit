"use client";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Options from "@/components/scorecards/Options";
import Plots from "@/components/scorecards/plots/Plots";
import { ResetProvider, useReset } from "../resetscorecardcontext.js/ResetContext";

function ScorecardContent() {
  const { resetCount } = useReset(); 

  return (
    <div key={resetCount}>
      {" "}
      {/* Force re-render on reset */}
      <Options />
      <Plots />
    </div>
  );
}



export default function Scorecards() {
  return (
    <main className="mx-auto my-6">
      <Provider store={store}>
        <ResetProvider>
          <ScorecardContent />
        </ResetProvider>
      </Provider>
    </main>
  );
}
