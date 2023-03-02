import React, { useEffect, useState } from 'react';
import { currentDateUTC, getDaysOfMonth, getHoursList, getMinutesList, getMonthList, getYearsList } from '../utils';
import PickerGroup from './PickerGroup';

interface PickerProps {
    timestamp?: number;
    type?: 'date' | 'time';
    startYear?: number;
    endYear?: number;
    onChange?: (v: any) => void;
    localTimeZone?: boolean;
}

type GroupItemType = {
    type: string;
    items: string[];
    selected: string;
};

type GroupType = {
    date: GroupItemType[];
    time: GroupItemType[];
};

const Picker: React.FC<PickerProps> = ({
    timestamp,
    type = 'date',
    startYear,
    endYear,
    onChange,
    localTimeZone,
}) => {
    const [curTimestamp, setCurimestamp] = useState(localTimeZone ? new Date().getTime() : currentDateUTC());
    let month: string = new Date(curTimestamp).toLocaleDateString('ru', { month: 'long', timeZone: 'UTC' });
    if (localTimeZone) {
        month = new Date(curTimestamp).toLocaleDateString('ru', { month: 'long' });
    }
    month = month.charAt(0).toUpperCase() + month.substr(1);
    const groups: GroupType = {
        date: [
            {
                type: 'month',
                items: getMonthList(localTimeZone),
                selected: month,
            },
            {
                type: 'days',
                items: getDaysOfMonth(localTimeZone, curTimestamp),
                selected: localTimeZone
                    ? new Date(curTimestamp).toLocaleDateString('ru', { day: '2-digit' })
                    : new Date(curTimestamp).toLocaleDateString('ru', { day: '2-digit', timeZone: 'UTC' }),
            },
            {
                type: 'year',
                items: getYearsList(localTimeZone, startYear, endYear),
                selected: localTimeZone
                    ? new Date(curTimestamp).toLocaleDateString('ru', { year: 'numeric' })
                    : new Date(curTimestamp).toLocaleDateString('ru', { year: 'numeric', timeZone: 'UTC' }),
            },
        ],
        time: [
            {
                type: 'hours',
                items: getHoursList(localTimeZone),
                selected: localTimeZone
                    ? new Date(curTimestamp).toLocaleTimeString('ru', { hour: '2-digit' })
                    : new Date(curTimestamp).toLocaleTimeString('ru', { hour: '2-digit', timeZone: 'UTC' }),
            },
            {
                type: 'minutes',
                items: getMinutesList(localTimeZone),
                selected: localTimeZone
                    ? new Date(curTimestamp)
                          .toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
                          .split(':')[1]
                    : new Date(curTimestamp)
                          .toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
                          .split(':')[1],
            },
        ],
    };
    useEffect(() => {
        if (timestamp) setCurimestamp(timestamp);
    }, [timestamp, localTimeZone]);
    const handleChange = (result: Array<string | number>) => {
        let returned: number = localTimeZone ? new Date(curTimestamp).getTime() : currentDateUTC();

        const [type, value, index] = result;
        if (typeof index === 'number') {
            switch (type) {
                case 'month':
                    if (localTimeZone) {
                        returned = new Date(curTimestamp).setMonth(index, new Date(curTimestamp).getDate());
                    } else {
                        returned = new Date(curTimestamp).setUTCMonth(index, new Date(curTimestamp).getUTCDate());
                    }
                    break;
                case 'year':
                    if (localTimeZone) {
                        returned = new Date(curTimestamp).setFullYear(
                            Number(value),
                            new Date(curTimestamp).getMonth(),
                            new Date(curTimestamp).getDate()
                        );
                    } else {
                        returned = new Date(curTimestamp).setUTCFullYear(
                            Number(value),
                            new Date(curTimestamp).getUTCMonth(),
                            new Date(curTimestamp).getUTCDate()
                        );
                    }
                    break;
                case 'days':
                    if (localTimeZone) {
                        returned = new Date(curTimestamp).setDate(index + 1);
                    } else {
                        returned = new Date(curTimestamp).setUTCDate(index + 1);
                    }
                    break;
                case 'hours':
                    if (localTimeZone) {
                        returned = new Date(curTimestamp).setHours(index);
                    } else {
                        returned = new Date(curTimestamp).setUTCHours(index);
                    }
                    break;
                case 'minutes':
                    if (localTimeZone) {
                        returned = new Date(curTimestamp).setMinutes(index);
                    } else {
                        returned = new Date(curTimestamp).setUTCMinutes(index);
                    }
                    break;
            }
        }
        if (typeof onChange === 'function') onChange(returned);
    };
    return (
        <div className={'dt-picker dt-picker-' + type}>
            {groups[type].map((item: GroupItemType, index: number) => (
                <PickerGroup key={`group_${index}`} {...item} onChange={handleChange} />
            ))}
            <div className={'dt-picker-selected'}>{type === 'time' && ':'}</div>
        </div>
    );
};
export default Picker;
