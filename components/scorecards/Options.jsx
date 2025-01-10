import Box from "@mui/joy/Box";

import Image from "next/image";
import antibioticLogo from "@/public/images/antibiotic.svg";
import organismLogo from "@/public/images/organism.svg";
import sampleTypeLogo from "@/public/images/sample.svg";
import React, { useEffect } from 'react';  

import { useSelector } from "react-redux";
import { scorecardOptionsSelector } from "@/redux/reducers/scorecardOptionsReducer";
import { useDispatch } from "react-redux";
import { actions } from "@/redux/reducers/scorecardOptionsReducer";
import CustomSelect from "../common/CustomSelect";
import { useReset } from "@/app/resetscorecardcontext.js/ResetContext";
import antibioticsData from "@/public/antibiotics.json";
export default function Options() {
  const { resetCount } = useReset();
  const options = useSelector(scorecardOptionsSelector);

  const dispatch = useDispatch();
  useEffect(() => {
    if (resetCount > 0) {
      dispatch(actions.setOrganism("Klebsiella pneumoniae"));
      dispatch(actions.setAntibiotic("Amikacin"));
      dispatch(actions.setSampleType("Blood"));
      dispatch(actions.setCountry("All"));
      
    }
  }, [resetCount, dispatch]);
  // Dispatch updated values when a dropdown value changes
  const handleChange = (newValue, action) => {
      dispatch(action(newValue));
  };

  // Get the list of organisms dynamically
  const organisms = Object.keys(antibioticsData);

  // Get the list of sample types (sources) for the selected organism
  const sampleTypes = Object.keys(antibioticsData[options.organism] || {});

  // Get the list of antibiotics for the selected organism and sample type
  const antibiotics =
    antibioticsData[options.organism]?.[options.sampleType] || [];

  return (
    <Box
      display="flex"
      justifyContent="space-evenly"
      className="mb-4 mx-auto"
      style={{ width: "90%" }}
    >
      {/* Antibiotic Selection */}

      <CustomSelect
        value={options.organism || ""} 
        placeholder={options.organism || "Organism"}
        icon={
          <Image
            src={organismLogo}
            alt="organism-logo"
            className="h-9 2xl:h-[52px] w-auto filter invert-[100%] transform scale-x-[-1]"
            style={{ marginTop: "0.15rem", marginBottom: "0.15rem" }}
          />
        }
        handleChange={handleChange}
        action={actions.setOrganism}
        items={organisms} // List of organisms
        flex={0.3}
      />

      <CustomSelect
        value={options.antibiotic} 
        placeholder={options.antibiotic || "Antibiotic"}
        icon={
          <Image
            src={antibioticLogo}
            alt="antibiotic-logo"
            className="h-10 2xl:h-14 w-auto filter invert-[100%] transform rotate-180"
          />
        }
        handleChange={handleChange}
        action={actions.setAntibiotic}
        items={antibiotics} // List of antibiotics for the selected organism/sampleType
        flex={0.3}
      />

      <CustomSelect
        value={options.sampleType} 
        placeholder={options.sampleType || "Sample Type"}
        icon={
          <Image
            src={sampleTypeLogo}
            alt="sample-type-logo"
            className="h-9 2xl:h-[52px] w-auto filter invert-[100%]"
            style={{ marginTop: "0.15rem", marginBottom: "0.15rem" }}
          />
        }
        handleChange={handleChange}
        action={actions.setSampleType}
        items={["Blood", "Urine", "Wound", "Sputum"]} // List of sample types
        flex={0.3}
      />
    </Box>
  );
}
