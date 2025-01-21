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
    const [ answerConjugation, setAnswerConjugation ] = useState(0)
    const [ leftToLearn, setLeftToLearn ] = useState(0)
    const [ turn, setTurn ] = useState(1)
    const [ round, setRound ] = useState(0) // only for same speed
    const [ lastCardInRound, setLastCardInRound ] = useState(false) // only for same speed
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
        } else if (cardsPool === CardsPool.NEW) {
            cardsToRandomize = [...config.newOrHard]
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
        setRound(1)
        setFlashcards(cards)
        setLeftToLearn(cards.length)
        setLastCardInRound(false)
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
            setRound(minRepetitions + 1)
            setLastCardInRound(cardsToRandomize.length === 1)
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
        const displayConjugation = () => {
            setShowConjugation(true)
            hideModal()
        }
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
            hideModal()
        }
        return settingsModalOpen && <div className="settingsModalWrapper" onClick={hideModal}>
          <div className="settingsModal" onClick={event => event.stopPropagation()}>
            <h1>SETTINGS</h1>
            <button onClick={displayConjugation}>show conjugation</button>
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
            Turn: {configuration.sameSpeed ? `${round}/` : ''}{turn}, Flashcards left: {leftToLearn}, Time: {displayTime}
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

    const getAnswerText = () => {
        if (questionTurn || !currentCard) {
            return '?'
        } else if (!configuration.fromNative) {
            return currentCard.pl
        } else {
            switch(answerConjugation) {
                case 0: return currentCard.it
                case 1: return `io ${currentCard.presentIndicative.singular.first}`
                case 2: return `tu ${currentCard.presentIndicative.singular.second}`
                case 3: return `lui ${currentCard.presentIndicative.singular.third}`
                case 4: return `noi ${currentCard.presentIndicative.plural.first}`
                case 5: return `voi ${currentCard.presentIndicative.plural.second}`
                case 6: return `loro ${currentCard.presentIndicative.plural.third}`
            }
        }
    }

    return (
        <div className={`wrapper ${lastCardInRound ? 'lastCardWrapper' : ''}`}>
            {getSettingsModal()}
            {getHeader()}
            {currentCard && !showConjugation && <div className="cards">
                    <div className="card" onClick={openSettingsModal}>
                        {configuration.fromNative ? currentCard.pl : currentCard.it}
                    </div>
                    <div className="card" onClick={() => questionTurn ? null : setAnswerConjugation(x => (x + 1) % 7)}>
                        {getAnswerText()}
                    </div>
            </div>
            }
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
