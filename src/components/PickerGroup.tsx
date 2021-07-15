import React from 'react';

const PickerGroup: React.FC<any> = ({ type, items, selected, onChange }) => {
    const groupRef = React.createRef<any>();
    const [isDragging, setDragging] = React.useState(null as any);
    const [isMouseMove, setMouseMove] = React.useState(false);
    const setCurrentPosition = () => {
        const select = groupRef.current?.querySelector('.dt-picker-item--selected');
        if (select) {
            select.scrollIntoView({
                block: 'center',
            });
        }
    };
    const isInViewport = (el: any) => {
        const rect = el.getBoundingClientRect();
        const view = groupRef.current.getBoundingClientRect();
        return rect.top >= view.y + view.height / 2 - 30 && rect.bottom <= view.y + view.height / 2 + 30;
    };
    const handleDragStart = (e: any) => {
        setDragging({
            top: groupRef.current.scrollTop,
            y: e.clientY,
        });
    };
    const handleDragStop = () => {
        if (groupRef.current) {
            let result: any = null;
            const arr = Array.prototype.slice.call(groupRef.current.querySelectorAll('.dt-picker-item'));
            for (let i = 0; i < arr.length; i++) {
                if (isInViewport(arr[i]) && !arr[i].classList.contains('dt-picker-item--selected')) {
                    groupRef.current
                        .querySelector('.dt-picker-item--selected')
                        ?.classList.remove('dt-picker-item--selected');
                    arr[i].classList.add('dt-picker-item--selected');
                    result = [type, arr[i].textContent, i];
                    break;
                }
            }
            setTimeout(() => setCurrentPosition(), 30);
            if (result) {
                onChange(result);
            }
            if (isMouseMove) {
                setTimeout(() => setMouseMove(false), 0);
            }
        }
        setDragging(null);
    };
    const handleDrag = (e: any) => {
        if (isDragging && groupRef.current) {
            groupRef.current.scrollTop = isDragging.top - (e.clientY - isDragging.y);
            if (!isMouseMove) setMouseMove(true);
        }
    };
    const handleClick = (e: any) => {
        if (!isMouseMove && groupRef.current) {
            const el = e.target;
            groupRef.current.querySelector('.dt-picker-item--selected')?.classList.remove('dt-picker-item--selected');
            el.classList.add('dt-picker-item--selected');
            setCurrentPosition();
            onChange([type, el.textContent, [...el.parentNode.children].indexOf(el)]);
        }
    };
    let timeout: any = null;
    const handleWheel = (e: any) => {
        clearTimeout(timeout);
        if (!isMouseMove && groupRef.current) {
            e.stopPropagation();
            groupRef.current.scrollTop += e.deltaY;
            timeout = setTimeout(() => handleDragStop(), 200);
        }
    };
    React.useEffect(() => {
        setCurrentPosition();
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', handleDragStop);
        return () => {
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleDragStop);
        };
    }, [groupRef, handleDragStop]);
    return (
        <div className={'dt-picker-group dt-picker-' + type} ref={groupRef}>
            <div
                className={'dt-picker-scrollable' + isDragging ? ' dt-picker-onmousemove' : ''}
                onMouseDown={handleDragStart}
                onWheel={handleWheel}
                onClick={handleClick}
            >
                {items.map((item: any, index: number) => (
                    <div
                        key={`item_${index}`}
                        className={`dt-picker-item dt-picker-${type}__item` +
                                    (item === selected ? ' dt-picker-item--selected' : '')}
                    >
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
};
export default PickerGroup;