export const getUniqueValuesFromEvents = (key, allEvents) => {
    let items = [];
    switch (key) {
        case 'startYear':
        case 'location':
        case 'eventType':
            if(key !== 'startYear') {
                items.push('All')
            }
            allEvents.forEach(event => {
                if (!items.includes(event[key])) {
                    items.push(event[key])
                }
            })
            break;
        case 'topics':
            items.push('All')
            allEvents.forEach(event => {
                const eventTopics = event?.topics ?? [];
                eventTopics.forEach(topic => {
                    if (!items.includes(topic)) {
                        items.push(topic)
                    }
                })
            })
    }

    return items;
}