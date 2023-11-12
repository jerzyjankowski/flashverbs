import {CardsPool, Configuration} from "../types";
import {useCallback, useContext} from "react";
import {ConfigurationContext} from "../context/ConfigurationProvider";

export const useConfiguration = () => {
    const { configuration, setConfiguration } = useContext(ConfigurationContext)
    const setMaxNumberOfCards = useCallback(
        (maxNumber: number) => setConfiguration ? setConfiguration((configuration: Configuration) => ({ ...configuration, maxNumberOfCards: maxNumber })) : null,
        [setConfiguration]
    )
    const setCardsPool = useCallback(
        (newCardsPool: CardsPool) => setConfiguration ? setConfiguration((configuration: Configuration) => ({ ...configuration, cardsPool: newCardsPool })) : null,
        [setConfiguration]
    )
    const setFromNative = useCallback(
        (newFromNative: boolean) => setConfiguration ? setConfiguration((configuration: Configuration) => ({ ...configuration, fromNative: newFromNative })) : null,
        [setConfiguration]
    )
    const setSameSpeed = useCallback(
        (newSameSpeed: boolean) => setConfiguration ? setConfiguration((configuration: Configuration) => ({ ...configuration, sameSpeed: newSameSpeed })) : null,
        [setConfiguration]
    )
    return {
        configuration,
        setMaxNumberOfCards,
        setCardsPool,
        setFromNative,
        setSameSpeed,
    }
}
