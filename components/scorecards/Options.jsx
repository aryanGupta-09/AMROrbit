import Box from "@mui/joy/Box";

import Image from "next/image";
import antibioticLogo from "@/public/images/antibiotic.svg";
import organismLogo from "@/public/images/organism.svg";
import sampleTypeLogo from "@/public/images/sample.svg";

import { useSelector } from "react-redux";
import { scorecardOptionsSelector } from "@/redux/reducers/scorecardOptionsReducer";
import { useDispatch } from "react-redux";
import { actions } from "@/redux/reducers/scorecardOptionsReducer";
import CustomSelect from "../common/CustomSelect";

import antibioticsData from "@/public/antibiotics.json";

export default function Options() {
  const options = useSelector(scorecardOptionsSelector);

  const dispatch = useDispatch();

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
        items={organisms}
        flex={0.3}
      />

      <CustomSelect
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
        items={antibiotics} // Dynamically updated antibiotics list
        flex={0.3}
      />

      <CustomSelect
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
        items={["Blood", "Urine", "Wound", "Sputum"]}
        flex={0.3}
      />
    </Box>
  );
}
