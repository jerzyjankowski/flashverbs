import * as React from 'react'
import {CardsPool, Configuration} from "../types";
import {createContext, Dispatch, SetStateAction, useState} from "react";

const defaultConfiguration: Configuration = {
    maxNumberOfCards: 30,
    cardsPool: CardsPool.ALL,
    fromNative: true,
    sameSpeed: false,
}

const ConfigurationContext = createContext<{configuration: Configuration, setConfiguration?: Dispatch<SetStateAction<Configuration>>}>({ configuration: defaultConfiguration })

const CountProvider = ({children}: any) => {
    const [configuration, setConfiguration] = useState<Configuration>(defaultConfiguration)
    const value = {configuration, setConfiguration}
    return <ConfigurationContext.Provider value={value}>{children}</ConfigurationContext.Provider>
}

export {CountProvider, ConfigurationContext}