import React from 'react';
import close from '../images/close.svg';
import { currentDateUTC } from '../utils';
import Icon from './Icon';
import Picker from './Picker';

interface PickerBoxProps {
    value?: number;
    pickerType: 'date' | 'time' | 'datetime';
    placeholder?: string;
    startYear?: number | 'current';
    endYear?: number | 'current';
    position: string;
    handleChange: (v: number) => void;
    handleClose: (v?: boolean) => void;
    handleReset: () => void;
    dataQa?: string;
    showResetButton?: boolean;
    localTimeZone?: boolean;
}

const PickerBox: React.FC<PickerBoxProps> = ({
    handleClose,
    handleChange,
    handleReset,
    placeholder,
    pickerType,
    startYear,
    endYear,
    value,
    position,
    dataQa,
    showResetButton = true,
    localTimeZone,
}) => {
    const [isShowReset, setShowReset] = React.useState(showResetButton);
    const pickers: Array<'date' | 'time'> = pickerType === 'datetime' ? ['date', 'time'] : [pickerType];
    const start =
        startYear === 'current' ? (localTimeZone ? new Date().getFullYear() : new Date().getUTCFullYear()) : startYear;
    const end =
        endYear === 'current' ? (localTimeZone ? new Date().getFullYear() : new Date().getUTCFullYear()) : endYear;
    const timestamp = React.useMemo(() => {
        let result: number;
        const nowDate = value && value !== 0 ? value : localTimeZone ? new Date().getTime() : currentDateUTC();
        const nowYear = localTimeZone ? new Date(nowDate).getFullYear() : new Date(nowDate).getUTCFullYear();
        result = nowDate;
        if (startYear && startYear !== 'current' && startYear > nowYear)
            result = localTimeZone
                ? new Date(nowDate).setFullYear(startYear)
                : new Date(nowDate).setUTCFullYear(startYear);
        if (endYear && endYear !== 'current' && endYear < nowYear)
            result = localTimeZone ? new Date(nowDate).setFullYear(endYear) : new Date(nowDate).setUTCFullYear(endYear);
        return result;
    }, [startYear, endYear, value]);
    React.useEffect(() => {
        if (pickerType === 'time') setShowReset(false);
    }, [showResetButton, pickerType]);
    return (
        <div className={`dt-picker-box dt-picker-box-${position}`}>
            <div className={'dt-picker-box__header'}>
                <div className={'dt-picker-close dt-input-icon'} onClick={() => handleClose(false)}>
                    <Icon id={close.id} viewBox={close.viewBox} name={'small'} />
                </div>
                <div className={'dt-picker-title'}>{placeholder}</div>
            </div>
            <div className={'dt-picker-box__content'}>
                {pickers.map((item) => (
                    <Picker
                        key={item}
                        type={item}
                        timestamp={timestamp}
                        onChange={handleChange}
                        startYear={start}
                        endYear={end}
                        localTimeZone={localTimeZone}
                    />
                ))}
            </div>
            <div className={'dt-picker-box__footer'}>
                <div className={'dt-picker-box__footer_left'}>
                    {(!endYear ||
                        endYear === 'current' ||
                        endYear >= (localTimeZone ? new Date().getFullYear() : new Date().getUTCFullYear())) &&
                        pickerType !== 'time' && (
                            <button
                                className={'dt-picker-button'}
                                onClick={() => handleChange(localTimeZone ? new Date().getTime() : currentDateUTC())}
                                data-qa={dataQa ? `dt_btn-today-${dataQa}` : 'dt_btn-today'}
                            >
                                Сегодня
                            </button>
                        )}
                </div>
                <div className={'dt-picker-box__footer_right'}>
                    {isShowReset && (
                        <button
                            className={'dt-picker-button'}
                            onClick={handleReset}
                            data-qa={dataQa ? `dt_btn-reset-${dataQa}` : 'dt_btn-reset'}
                        >
                            Сбросить
                        </button>
                    )}
                    <button
                        className={'dt-picker-button dt-picker-button--blue'}
                        onClick={() => {
                            if (!value) handleChange(localTimeZone ? new Date().getTime() : currentDateUTC());
                            handleClose(true);
                        }}
                        data-qa={dataQa ? `dt_btn-done-${dataQa}` : 'dt_btn-done'}
                    >
                        Готово
                    </button>
                </div>
            </div>
        </div>
    );
};
export default PickerBox;
