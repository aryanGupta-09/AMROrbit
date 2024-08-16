import Box from '@mui/joy/Box';

import Image from 'next/image';
import antibioticLogo from '@/public/images/antibiotic.svg';
import organismLogo from '@/public/images/organism.svg';
import sampleTypeLogo from '@/public/images/sample.svg';

import { useDispatch } from 'react-redux';
import { actions } from '@/redux/reducers/optionsReducer';
import CustomSelect from './CustomSelect';

export default function Options() {
    const dispatch = useDispatch();
    const handleChange = (newValue, action) => {
        dispatch(action(newValue));
    };

    return (
        <Box display="flex" justifyContent="space-between" className="mb-6" px={15}>
            <CustomSelect
                placeholder="Antibiotic"
                icon={
                    <Image
                        src={antibioticLogo}
                        alt="antibiotic-logo"
                        className="h-[40px] w-auto filter invert-[100%] transform rotate-180"
                    />
                }
                handleChange={handleChange}
                action={actions.setAntibiotic}
                items={["Imipenem", "Meropenem", "Colistin"]}
            />

            <CustomSelect
                placeholder="Organism"
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
            />

            <CustomSelect
                placeholder="Sample Type"
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
            />
        </Box>
    );
}