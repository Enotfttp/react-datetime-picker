import React, { InputHTMLAttributes } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
    value: number | undefined;
    pickerType: 'date' | 'time' | 'datetime';
    placeholder: string;
    meta?: { [k: string]: string | null };
    dataQa?: string;
    localTimeZone?: boolean;
}

const Field: React.FC<FieldProps> = ({ meta, placeholder, value, pickerType, dataQa, localTimeZone, ...props }) => {
    let options: any;
    switch (pickerType) {
        case 'date':
            options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            };
            break;
        case 'time':
            options = {
                hour: 'numeric',
                minute: 'numeric',
            };
            break;
        case 'datetime':
            options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            };
            break;
    }
    const dateToString = (timestamp: number): string => {
        if (value && value !== 0) {
            if (pickerType === 'time') {
                if (localTimeZone) return new Date(timestamp).toLocaleTimeString('ru', options);
                else return new Date(timestamp).toLocaleTimeString('ru', { timeZone: 'UTC', ...options });
            } else {
                if (localTimeZone) return new Date(value).toLocaleDateString('ru', options);
                else return new Date(value).toLocaleDateString('ru', { timeZone: 'UTC', ...options });
            }
        } else if (pickerType === 'time') {
            if (localTimeZone) return new Date().toLocaleTimeString('ru', options);
            else return new Date().toLocaleTimeString('ru', { timeZone: 'UTC', ...options });
        } else {
            return '';
        }
    };
    const [val, setVal] = React.useState<string>(value ? dateToString(value) : '');
    const [state, setState] = React.useState<any>({ hasLabel: !!value, touched: false });
    React.useEffect(() => {
        setVal(value ? dateToString(value) : '');
        if (!!value === !state.hasLabel) setState({ hasLabel: !!value, touched: true });
    }, [value, state.hasLabel]);
    return (
        <div
            className={
                'dt-input-wrapper' +
                (state.hasLabel ? ' dt-input-wrapper--filled' : '') +
                (meta && meta.error ? ' error' : '') +
                (meta && !meta.error && !!val.length ? ' success' : '') +
                (props.className ? ' ' + props.className : '')
            }
        >
            <input
                value={val}
                type={'text'}
                readOnly={true}
                className={'dt-input'}
                onFocus={() => setState({ hasLabel: true, touched: false })}
                onBlur={(e) => setState({ hasLabel: !!e.target.value?.length, touched: true })}
                data-qa={dataQa ? `dt_input-${dataQa}` : 'dt_input'}
            />
            <label htmlFor={props.name} className={'dt-input-label'}>
                {placeholder}
            </label>
            {meta && meta.error && <div className={'dt-input-error'}>{meta.error}</div>}
        </div>
    );
};
export default Field;
