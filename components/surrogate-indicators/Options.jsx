import Box from '@mui/joy/Box';

import Image from 'next/image';
import organismLogo from '@/public/images/organism.svg';
import sampleTypeLogo from '@/public/images/sample.svg';

import { useSelector } from "react-redux";
import { scorecardOptionsSelector } from "@/redux/reducers/scorecardOptionsReducer";
import { useDispatch } from 'react-redux';
import { actions } from '@/redux/reducers/leadLagOptionsReducer';
import CustomSelect from '../common/CustomSelect';

export default function Options() {
    const options = useSelector(scorecardOptionsSelector);

    const dispatch = useDispatch();
    const handleChange = (newValue, action) => {
        dispatch(action(newValue));
    };

    return (
        <Box display="flex" justifyContent="space-around" className="mb-6" px={15}>
            <CustomSelect
                placeholder={options.organism || "Organism"}
                icon={
                    <Image
                        src={organismLogo}
                        alt="organism-logo"
                        className="h-[35px] w-auto filter invert-[100%] transform scale-x-[-1]"
                        style={{ marginTop: '0.15rem', marginBottom: '0.15rem' }}
                    />
                }
                handleChange={handleChange}
                action={actions.setOrganism}
                items={["Klebsiella pneumoniae", "Escherichia coli"]}
                flex={0.4}
            />

            <CustomSelect
                placeholder={options.sampleType || "Sample Type"}
                icon={
                    <Image
                        src={sampleTypeLogo}
                        alt="sample-type-logo"
                        className="h-[35px] w-auto filter invert-[100%]"
                        style={{ marginTop: '0.15rem', marginBottom: '0.15rem' }}
                    />
                }
                handleChange={handleChange}
                action={actions.setSampleType}
                items={["Blood", "Urine"]}
                flex={0.4}
            />
        </Box>
    );
}