import React, {useCallback, useEffect, useState} from "react";
import config from "./config"
import {Card, CardsPool, Configuration as ConfigurationType} from "./types";
import './index.css';
import {Configuration} from "./components";
import {useConfiguration} from "./hooks/useConfiguration";

const Engine = () => {
    const [ flashcards, setFlashcards ] = useState<Card[]>([])
    const [ currentCard, setCurrentCard ] = useState<Card>()
    const [ questionTurn, setQuestionTurn ] = useState(true)
    const [ showConjugation, setShowConjugation ] = useState(false)
    const [ leftToLearn, setLeftToLearn ] = useState(0)
    const [ turn, setTurn ] = useState(1)
    const [ settingsModalOpen, setSettingsModalOpen ] = useState(false)
    const [ startTime, setStartTime ] = useState(new Date().getTime())
    const [ displayTime, setDisplayTime ] = useState('00:00')

    const {
        configuration,
        setFromNative,
    } = useConfiguration()

    const updateTime = useCallback(() => {
        const timeDeltaSeconds =  Math.floor((new Date().getTime() - startTime) / 1000)
        const seconds = timeDeltaSeconds % 60
        const minutes = Math.floor(timeDeltaSeconds / 60)
        const newDisplayTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
        setDisplayTime(newDisplayTime)
    }, [startTime, setDisplayTime])
    useEffect(
        () => {
            const intervalId = setInterval(updateTime, 200)
            return () => clearInterval(intervalId)
        }, [updateTime])

    const initializeFlashcards = () => {
        const { maxNumberOfCards, cardsPool } = configuration
        let cardsToRandomize: Card[] = [...config.all] // CardsPool.ALL or CardsPool.SAVED if none saved
        if (cardsPool === CardsPool.SAVED) {
            const questionsIdsSavedText = localStorage.getItem("questions")
            if (questionsIdsSavedText) {
                const questionsIdsSaved = JSON.parse(questionsIdsSavedText) as number[]
                cardsToRandomize = [...config.all.filter(card => questionsIdsSaved.indexOf(card.id) > -1)]
            }
        } else if (cardsPool === CardsPool.IRREGULAR) {
            cardsToRandomize = [...config.irregular]
        } else if (cardsPool === CardsPool.TEST) {
            cardsToRandomize = [...config.test]
        }
        const cards = []
        for (let i = 0; i < maxNumberOfCards && cardsToRandomize.length > 0; i++) {
            const cardId = Math.floor(Math.random() * cardsToRandomize.length)
            cards.push({
                ...cardsToRandomize[cardId],
                repetitions: 0
            })
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
        setStartTime(new Date().getTime())
        return cards
    }

    const randomizeFlashcard = (turn: number, flashcards: Card[]) => {
        const cardsToLearn = flashcards.filter(card => !card.learnt)
        const omitLastTurns = cardsToLearn.length > 3 ? 3 : cardsToLearn.length - 1
        let cardsToRandomize = cardsToLearn.filter(card => !card.lastTurn || turn - omitLastTurns > card.lastTurn)
        if (configuration.sameSpeed) {
            const minRepetitions = Math.min(...cardsToRandomize.map(card => card.repetitions || 0))
            cardsToRandomize = cardsToRandomize.filter(card => card.repetitions === minRepetitions)
        }
        const cardId = Math.floor(Math.random() * cardsToRandomize.length)
        setCurrentCard(cardsToRandomize[cardId])
    }

    const start = () => {
        const cards = initializeFlashcards()
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
                repetitions: currentCard!.repetitions! + 1,
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
            setFromNative(!configuration.fromNative)
            hideModal()
        }
        const closeQuestions = () => {
            setCurrentCard(undefined)
            hideModal()
        }
        const saveQuestions = () => {
            const questionsIds = flashcards.filter(card => !card.learnt).map(card => card.id)
            localStorage.setItem("questions", `${JSON.stringify(questionsIds)}`)
        }
        return settingsModalOpen && <div className="settingsModalWrapper" onClick={hideModal}>
          <div className="settingsModal" onClick={event => event.stopPropagation()}>
            <h1>SETTINGS</h1>
            <button onClick={reverseQuestions}>reverse questions</button>
            <button onClick={restartQuestions}>restart questions</button>
            <button onClick={saveQuestions}>save hard questions</button>
            <button onClick={closeQuestions}>close questions</button>
            <button onClick={hideModal}>close settings</button>
          </div>
        </div>
    }

    const openSettingsModal = () => {
        setSettingsModalOpen(true)
    }

    const getHeader = () => {
        return currentCard && <div className="header">
            Turn: {turn}, Flashcards left: {leftToLearn}, Time: {displayTime}
        </div>
    }

    const getFooter = () => {
        if (!currentCard) {
            return <div className="buttons">
                <button onClick={start}>START</button>
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
                {configuration.fromNative ? currentCard.pl : currentCard.it}
            </div>}
            {currentCard && !showConjugation && <div className="card" onClick={() => questionTurn ? null : setShowConjugation(true)}>
                {questionTurn ? '?' : configuration.fromNative ? currentCard.it : currentCard.pl}
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
            {!currentCard && <div className="card"><Configuration /></div>}
            {getFooter()}
        </div>
    );
}

export default Engine;
