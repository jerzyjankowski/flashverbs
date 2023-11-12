import React from 'react';

type Props = { label: string, value: any, realValue: any, callback: (value: any) => void }
const ConfigurationButton = (props: Props) => {
    return <button
        className={`configurationButton ${props.realValue === props.value ? 'active' : ''}`}
        onClick={() => props.callback(props.value)}
    >{props.label}</button>
}

export default ConfigurationButton
