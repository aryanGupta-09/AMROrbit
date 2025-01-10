import React, { createContext, useContext, useState } from "react";

const ResetContext = createContext({
  resetCount: 0,
  triggerReset: () => {},
});

export const useReset = () => useContext(ResetContext);

export const ResetProvider = ({ children }) => {
  const [resetCount, setResetCount] = useState(0);

  const triggerReset = () => {
    setResetCount((count) => count + 1); 
  };

  return (
    <ResetContext.Provider value={{ resetCount, triggerReset }}>
      {children}
    </ResetContext.Provider>
  );
};
