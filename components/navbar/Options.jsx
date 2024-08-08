import Box from '@mui/joy/Box';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { useDispatch } from 'react-redux';
import { actions } from '@/redux/reducers/optionsReducer';

export default function Options() {
    const dispatch = useDispatch();
    const handleChange = (newValue, action) => {
        dispatch(action(newValue));
    };

    return (
        <Box display="flex" justifyContent="space-around" className="mb-4">
            <Select
                placeholder = "Antibiotic"
                indicator = {<ArrowDropDownIcon />}
                onChange = {(e, newValue) => handleChange(newValue, actions.setAntibiotic)}
                sx = {{flex: 1}}
            >
                <Option value="ab1">ab1</Option>
                <Option value="ab2">ab2</Option>
                <Option value="ab3">ab3</Option>
            </Select>
            <Select
                placeholder = "Organism"
                indicator = {<ArrowDropDownIcon />}
                onChange = {(e, newValue) => handleChange(newValue, actions.setOrganism)}
                sx = {{flex: 1}}
            >
                <Option value="org1">org1</Option>
                <Option value="org2">org2</Option>
                <Option value="org3">org3</Option>
            </Select>
        </Box>
    );
}