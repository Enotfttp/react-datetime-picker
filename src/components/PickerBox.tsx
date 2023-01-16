import React from 'react';
import close from '../images/close.svg';
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
}) => {
    const pickers: Array<'date' | 'time'> = pickerType === 'datetime' ? ['date', 'time'] : [pickerType];
    const start = startYear === 'current' ? new Date().getFullYear() : startYear;
    const end = endYear === 'current' ? new Date().getFullYear() : endYear;
    const timestamp = React.useMemo(() => {
        let result: number;
        const nowDate = value && value !== 0 ? value : new Date().getTime();
        const nowYear = new Date(nowDate).getFullYear();
        result = nowDate;
        if (startYear && startYear !== 'current' && startYear > nowYear)
            result = new Date(nowDate).setFullYear(startYear);
        if (endYear && endYear !== 'current' && endYear < nowYear) result = new Date(nowDate).setFullYear(endYear);
        return result;
    }, [startYear, endYear, value]);
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
                        dataQa={dataQa}
                    />
                ))}
            </div>
            <div className={'dt-picker-box__footer'}>
                <div className={'dt-picker-box__footer_left'}>
                    {(!endYear || endYear === 'current' || endYear >= new Date().getFullYear()) &&
                        pickerType !== 'time' && (
                            <button
                                className={'dt-picker-button'}
                                onClick={() => handleChange(new Date().getTime())}
                                data-qa={dataQa ? `dt_btn-today-${dataQa}` : 'dt_btn-today'}
                            >
                                Сегодня
                            </button>
                        )}
                </div>
                <div className={'dt-picker-box__footer_right'}>
                    {pickerType !== 'time' && (
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
                            if (!value) handleChange(new Date().getTime());
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
