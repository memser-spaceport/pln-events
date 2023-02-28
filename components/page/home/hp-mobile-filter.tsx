import {useContext, useState} from 'react'
import HpFilters from './hp-filters'
import { HpContext } from './hp-helper'
function HpMobileFilter(props) {
    const {filters} = useContext(HpContext)
    const [mobileFilters, setFilters] = useState({...filters})

    const onFilterChange = (type, key, value) => {
        if(type === 'multiSelect') {
            if(filters[key].includes(key)) {
                const newFilter = {...mobileFilters}
                newFilter[key] = mobileFilters[key].filter(v => v !== value);
                setFilters({...newFilter})
            } else {
                const newFilter = {...mobileFilters};
                newFilter[key].push(value);
                setFilters({...newFilter})

            }
        } else if(type === 'single-select') {
             const newFilter= {...mobileFilters}
             newFilter[key] = value
             setFilters({...newFilter})
        }
    }


    return <>
        <HpFilters/>
    </>
}

export default HpMobileFilter