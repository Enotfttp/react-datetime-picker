export const getYearsList = (timeZone: boolean | undefined, startYear: number | undefined, endYear: number | undefined): string[] => {
    let now = new Date().getUTCFullYear();
    if (timeZone) {
        now = new Date().getFullYear();
    }
    let period = 20,
        d = 0.5;
    if (startYear && endYear) {
        period = endYear - startYear;
        if (endYear === now) d = 1;
        else if (now === startYear) d = 0;
        else d = (period - (endYear - now)) / period;
    }
    if (startYear && !endYear) {
        period = now - startYear + 10;
        if (now === startYear) d = 0;
        else d = (period - 10) / period;
    }
    if (!startYear && endYear) {
        period = endYear - now + 10;
        if (endYear === now) d = 1;
        else d = (period - (endYear - now)) / period;
    }
    return Array.from({ length: period + 1 }, (e, i) => {
        if (d) return String(now - period * d + i);
        else return String(now + i);
    });
};
export const getMonthLength = (timeZone: boolean | undefined, timestamp: number): number => {
    let year = new Date(timestamp).getUTCFullYear();
    let month = new Date(timestamp).getUTCMonth();
    if (timeZone) {
        year = new Date(timestamp).getFullYear();
        month = new Date(timestamp).getMonth();
    }
    return 33 - new Date(year, month, 33).getDate();
};
export const getMonthList = (timeZone: boolean | undefined): string[] => {
    return Array.from({ length: 12 }, (e, i) => {
        let result: any = new Date(0, i + 1, 0).toLocaleDateString('ru', { month: 'long', timeZone: 'UTC' });
        if (timeZone) {
            result = new Date(0, i + 1, 0).toLocaleDateString('ru', { month: 'long' });
        }
        result = result.charAt(0).toUpperCase() + result.substr(1);
        return result;
    });
};
export const getDaysOfMonth = (timeZone: boolean | undefined, timestamp: number): string[] => {
    return Array.from({ length: getMonthLength(timeZone, timestamp) }, (e, i) => {
        let result = new Date(0, 0, i + 1).toLocaleDateString('ru', { day: '2-digit', timeZone: 'UTC' });
        if (timeZone) {
            result = new Date(0, 0, i + 1).toLocaleDateString('ru', { day: '2-digit' });
        }
        return result;
    });
};
export const getHoursList = (timeZone: boolean | undefined): string[] => {
    return Array.from({ length: 24 }, (e, i) => {
        let result = new Date(0, 0, 0, i, 0).toLocaleTimeString('ru', { hour: '2-digit', timeZone: 'UTC' });
        if (timeZone) {
            result = new Date(0, 0, 0, i, 0).toLocaleTimeString('ru', { hour: '2-digit' });
        }
        return result;
    });
};
export const getMinutesList = (timeZone: boolean | undefined): string[] => {
    return Array.from({ length: 60 }, (e, i) => {
        let result = new Date(0, 0, 0, 0, i, 0)
            .toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
            .split(':')[1];
        if (timeZone) {
            result = new Date(0, 0, 0, 0, i, 0)
                .toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
                .split(':')[1];
        }
        return result;
    });
};

const isScrollable = (el: HTMLElement) => {
    const hasScrollableContent = el.scrollHeight > el.clientHeight;
    const overflowYStyle = window.getComputedStyle(el).overflowY;
    const isOverflowAuto = overflowYStyle.indexOf('auto') !== -1;
    return hasScrollableContent && isOverflowAuto;
};

export function getScrollableParent(el: HTMLElement | null): HTMLElement | null {
    return !el || el === document.body
        ? document.body
        : isScrollable(el)
            ? el
            : getScrollableParent(el.parentNode as HTMLElement);
}

export const currentDateUTC = (): number => {
    return Date.now() - Math.abs(new Date().getTimezoneOffset());
};

