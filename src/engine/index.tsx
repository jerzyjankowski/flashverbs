import React, {useCallback, useEffect, useState} from "react";
import config from "./config"
import {Card} from "./types";
import './index.css';

const Engine = () => {
    const [ flashcards, setFlashcards ] = useState<Card[]>([])
    const [ currentCard, setCurrentCard ] = useState<Card>()
    const [ questionTurn, setQuestionTurn ] = useState(true)
    const [ showConjugation, setShowConjugation ] = useState(false)
    const [ leftToLearn, setLeftToLearn ] = useState(0)
    const [ turn, setTurn ] = useState(1)
    const [ settingsModalOpen, setSettingsModalOpen ] = useState(false)
    const [ questionsFromNative, setQuestionsFromNative ] = useState(true)

    const initializeFlashcards = (cardsCap: number) => {
        let cardsToRandomize = [...config.all]
        const cards = []
        for (let i = 0; i < cardsCap && cardsToRandomize.length > 0; i++) {
            const cardId = Math.floor(Math.random() * cardsToRandomize.length)
            cards.push(cardsToRandomize[cardId])
            cardsToRandomize = [
                ...cardsToRandomize.slice(0, cardId),
                ...cardsToRandomize.slice(cardId + 1),
            ]
        }
        setShowConjugation(false)
        setQuestionTurn(true)
        setTurn(1)
        setFlashcards(cards)
        setLeftToLearn(cards.length)
        return cards
    }

    const randomizeFlashcard = (turn: number, flashcards: Card[]) => {
        const cardsToLearn = flashcards.filter(card => !card.learnt)
        const omitLastTurns = cardsToLearn.length > 3 ? 3 : cardsToLearn.length - 1
        const cardsToRandomize = cardsToLearn.filter(card => !card.lastTurn || turn - omitLastTurns > card.lastTurn)
        const cardId = Math.floor(Math.random() * cardsToRandomize.length)
        setCurrentCard(cardsToRandomize[cardId])
    }

    const start = (cardsCap: number) => {
        const cards = initializeFlashcards(cardsCap)
        randomizeFlashcard(turn, cards)
    }

    const checkAnswer = () => {
        setQuestionTurn(false)
    }

    const nextQuestion = (learnt: boolean) => {
        const cardArrayId = flashcards.findIndex(card => card.id === currentCard?.id)
        const newFlashcards = [
            ...flashcards.slice(0, cardArrayId),
            {
                ...flashcards[cardArrayId],
                lastTurn: turn,
                learnt
            },
            ...flashcards.slice(cardArrayId + 1),
        ]
        const newTurn = turn + 1
        setTurn(newTurn)
        setFlashcards(newFlashcards)
        const newLeftToLearn = newFlashcards.filter(card => !card.learnt).length
        setLeftToLearn(newLeftToLearn)

        if (newLeftToLearn > 0) {
            randomizeFlashcard(newTurn, newFlashcards)
            setQuestionTurn(true)
            setShowConjugation(false)
        } else {
            setCurrentCard(undefined)
        }
    }

    const getSettingsModal = () => {
        const hideModal = () => setSettingsModalOpen(false)
        const restartQuestions = () => {
            const newFlashcards = flashcards.map(card => ({ ...card, learnt: false }))
            setFlashcards(newFlashcards)
            setLeftToLearn(newFlashcards.length)
            hideModal()
        }
        const reverseQuestions = () => {
            setQuestionsFromNative(flag => !flag)
            hideModal()
        }
        return settingsModalOpen && <div className="settingsModalWrapper" onClick={hideModal}>
          <div className="settingsModal" onClick={event => event.stopPropagation()}>
            <h1>SETTINGS</h1>
            <button onClick={reverseQuestions}>reverse questions</button>
            <button onClick={restartQuestions}>restart questions</button>
            <button onClick={hideModal}>close settings</button>
          </div>
        </div>
    }

    const openSettingsModal = () => {
        setSettingsModalOpen(true)
    }

    const getHeader = () => {
        return currentCard && <div className="header">
            Turn: {turn}, Flashcards left: {leftToLearn}
        </div>
    }

    const getFooter = () => {
        if (!currentCard) {
            return <div className="buttons">
                <button onClick={() => start(10)}>START 10</button>
                <button onClick={() => start(20)}>START 20</button>
                <button onClick={() => start(30)}>START 30</button>
                <button onClick={() => start(config.all.length)}>START ALL</button>
            </div>
        }
        if (currentCard && questionTurn) {
            return <div className="buttons">
                <button onClick={checkAnswer}>CHECK</button>
            </div>
        }
        if (currentCard && !questionTurn) {
            return <div className="buttons">
                <button onClick={() => nextQuestion(true)}>LEARNT</button>
                {
                    leftToLearn > 1 && <button onClick={() => nextQuestion(false)}>NEXT</button>
                }
            </div>
        }
    }

    return (
        <div className="wrapper">
            {getSettingsModal()}
            {getHeader()}
            {currentCard && !showConjugation && <div className="card" onClick={openSettingsModal}>
                {questionsFromNative ? currentCard.pl : currentCard.it}
            </div>}
            {currentCard && !showConjugation && <div className="card" onClick={() => questionTurn ? null : setShowConjugation(true)}>
                {questionTurn ? '?' : questionsFromNative ? currentCard.it : currentCard.pl}
            </div>}
            {currentCard && showConjugation && <div className="card conjugation" onClick={() => setShowConjugation(false)}>
              <span>{currentCard.pl}</span>
              <span>-------</span>
              <span>{currentCard.it}</span>
              <span>-------</span>
              <span>{currentCard.presentIndicative.singular.first}</span>
              <span>{currentCard.presentIndicative.singular.second}</span>
              <span>{currentCard.presentIndicative.singular.third}</span>
              <span>-------</span>
              <span>{currentCard.presentIndicative.plural.first}</span>
              <span>{currentCard.presentIndicative.plural.second}</span>
              <span>{currentCard.presentIndicative.plural.third}</span>
            </div>}
            {!currentCard && <div className="card"/>}
            {getFooter()}
        </div>
    );
}

export default Engine;
