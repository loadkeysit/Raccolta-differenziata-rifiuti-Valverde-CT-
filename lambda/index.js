const Alexa = require('ask-sdk-core');

// Programma della raccolta differenziata
const schedule = {
    'lunedì': 'organico e sfalci di potatura',
    'martedì': 'plastica e alluminio',
    'mercoledì': 'organico',
    'giovedì': 'secco residuo (solo in date specifiche)',
    'venerdì': 'carta e cartone',
    'sabato': 'organico e vetro',
    'domenica': 'nessuna raccolta'
};



// Handler per l'evento di avvio della skill
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Benvenuto nella skill non ufficiale sulla raccolta differenziata nel comune di Valverde, Catania. Offerta gratuitamente da elonmediatechnology.it (visita il sito web)! Puoi chiedermi cosa devi portare fuori oggi, domani o un altro giorno della settimana.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Chiedimi, ad esempio: "Che rifiuti devo portare fuori oggi?"')
            .getResponse();
    }
};

// Handler per l'intento TonightIntent
const TonightIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'TonightIntent';
    },
    handle(handlerInput) {
        const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString('it-IT', { weekday: 'long' });

        const speakOutput = `Stasera, devi preparare i rifiuti per domani. Domani è ${tomorrow}, e devi portare fuori ${schedule[tomorrow] || 'niente'}.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

// Handler per gestire l'intento DayIntent
const DayIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'DayIntent';
    },
    handle(handlerInput) {
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const daySlot = slots.day && slots.day.value ? slots.day.value.toLowerCase() : null;

        console.log('Slot "day" ricevuto:', daySlot);

        const today = new Date().toLocaleDateString('it-IT', { weekday: 'long' });
        const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString('it-IT', { weekday: 'long' });

        let speakOutput;

        if (!daySlot) {
            // Lo slot non è stato popolato
            speakOutput = 'Non ho capito il giorno. Puoi ripetere? Ad esempio, puoi dire "oggi", "domani" o un giorno della settimana.';
        } else if (daySlot === 'oggi') {
            speakOutput = `Oggi è ${today}. Devi portare fuori ${schedule[today] || 'niente'}.`;
        } else if (daySlot === 'domani') {
            speakOutput = `Domani è ${tomorrow}. Devi portare fuori ${schedule[tomorrow] || 'niente'}.`;
        } else if (schedule[daySlot]) {
            speakOutput = `Il ${daySlot} devi portare fuori ${schedule[daySlot]}.`;
        } else {
            speakOutput = `Non ho informazioni sulla raccolta per il giorno ${daySlot}. Puoi ripetere?`;
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Come posso aiutarti?')
            .getResponse();
    }
};

// Handler per il comando di aiuto
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Puoi chiedermi quale raccolta è prevista oggi, domani o per un giorno specifico della settimana.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Come posso aiutarti?')
            .getResponse();
    }
};

// Handler per i comandi di stop e cancellazione
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent' ||
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'A presto!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

// Handler per riflettere l'intento invocato (utile per il debug)
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `Hai invocato l'intento ${intentName}.`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

// Handler per gestire errori
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.error(`Errore gestito: ${error.message}`);
        const speakOutput = 'Scusa, si è verificato un errore. Per favore riprova.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Per favore riprova.')
            .getResponse();
    }
};

// Configurazione ed esportazione della skill
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        TonightIntentHandler,
        DayIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        IntentReflectorHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
