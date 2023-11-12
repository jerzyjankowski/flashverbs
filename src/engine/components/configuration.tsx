import React from 'react';
import './configuration.css';
import {useConfiguration} from "../hooks/useConfiguration";
import {CardsPool} from "../types";
import ConfigurationButton from "./configurationButton";

function Configuration() {
    const {
        configuration,
        setCardsPool,
        setMaxNumberOfCards,
        setFromNative,
        setSameSpeed,
    } = useConfiguration()
    return (
        <div>
            <h5>CARDS POOL</h5>
            <div className="configurationButtons">
                <ConfigurationButton label="ALL" value={CardsPool.ALL} realValue={configuration.cardsPool} callback={setCardsPool} />
                <ConfigurationButton label="IRREGULAR" value={CardsPool.IRREGULAR} realValue={configuration.cardsPool} callback={setCardsPool} />
                <ConfigurationButton label="SAVED" value={CardsPool.SAVED} realValue={configuration.cardsPool} callback={setCardsPool} />
                <ConfigurationButton label="TEST" value={CardsPool.TEST} realValue={configuration.cardsPool} callback={setCardsPool} />
            </div>
            <h5>MAX NUMBER OF CARDS</h5>
            <div className="configurationButtons">
                <ConfigurationButton label="10" value={10} realValue={configuration.maxNumberOfCards} callback={setMaxNumberOfCards} />
                <ConfigurationButton label="20" value={20} realValue={configuration.maxNumberOfCards} callback={setMaxNumberOfCards} />
                <ConfigurationButton label="30" value={30} realValue={configuration.maxNumberOfCards} callback={setMaxNumberOfCards} />
                <ConfigurationButton label="ALL" value={Number.MAX_VALUE} realValue={configuration.maxNumberOfCards} callback={setMaxNumberOfCards} />
            </div>
            <h5>QUESTION TYPE</h5>
            <div className="configurationButtons">
                <ConfigurationButton label="FROM NATIVE" value={true} realValue={configuration.fromNative} callback={setFromNative} />
                <ConfigurationButton label="TO NATIVE" value={false} realValue={configuration.fromNative} callback={setFromNative} />
            </div>
            <h5>QUESTIONING SPEED</h5>
            <div className="configurationButtons">
                <ConfigurationButton label="SAME" value={true} realValue={configuration.sameSpeed} callback={setSameSpeed} />
                <ConfigurationButton label="RANDOM" value={false} realValue={configuration.sameSpeed} callback={setSameSpeed} />
            </div>
        </div>
    );
}

export default Configuration;
