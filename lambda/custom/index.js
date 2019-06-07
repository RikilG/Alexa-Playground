/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const fetch = require('node-fetch');
const currencyList = require('./CountriesAndCurrencies.json');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the playground, you can say hello!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const ConvertCurrencyIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ConvertCurrencyIntent';
  },
  async handle(handlerInput) {
    let speechText = 'Hello World!';
    const repromptText = 'I didn\'t quite catch you';
    let country = handlerInput.requestEnvelope.request.intent.slots.country.value.toUpperCase();
    let baseCountry = handlerInput.requestEnvelope.request.intent.slots.baseCountry.value || 'UNITED STATES';
    let path;
    baseCountry = baseCountry.toUpperCase();
    if(baseCountry.length != 3) baseCountry = currencyList[baseCountry].code
    if(country.length != 3) country = currencyList[country].code
    path = 'base=' + baseCountry + '&symbols=' + country;
    console.log('Path : ' + path);
    await fetch('https://api.exchangeratesapi.io/latest?' + path)
      .then(res => res.json())
      .then(data => {
        speechText = 'one ' + data.base + ' is ' + data.rates[country] + ' ' + country;
        console.log('Path: ' + path);
        console.log('Data received: ' + data);
      })
      .catch(err => {
        speechText = 'Eror occured!';
        console.log('Error: ' + err);
      })
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  },
};

const FindWeatherIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'FindWeatherIntent';
  },
  async handle(handlerInput) {
    let speechText = 'Find Weather intent invoked';
    const repromptText = 'I didn\'t quite catch you';
    let city = handlerInput.requestEnvelope.request.intent.slots.city.value;
    let date = handlerInput.requestEnvelope.request.intent.slots.date.value || '';
    if(date != '') {
      date = date.split('T')[0].replace(/-/g,'/');
    }
    let woeid; //where-on-earth-id
    let the_temp;
    await fetch('https://www.metaweather.com/api/location/search/?query=' + city)
      .then(res => res.json())
      .then(data => {
        woeid = data[0].woeid;
      })
      .catch(err => {
        speechText = 'Error occured!';
        console.log('Error: ' + err);
      })
    await fetch('https://www.metaweather.com/api/location/' + woeid + '/' + date)
      .then(res => res.json())
      .then(data => {
        if(date === '') {
          the_temp = parseFloat(data.consolidated_weather[0].the_temp).toFixed(2).toString();
          speechText = 'Current temperature is ' + the_temp + ' degrees';
        }
        else {
          the_temp = parseFloat(data[0].the_temp).toFixed(2).toString();
          let min = parseFloat(data[0].min_temp).toFixed(2).toString();
          let max = parseFloat(data[0].max_temp).toFixed(2).toString();
          speechText = 'Temperature will be ' + the_temp + ' degrees with minimum ' + min + ' degrees and maximum ' + max + ' degrees';
        }
      })
      .catch(err => {
        speechText = 'Error occured!';
        console.log('Error: ' + err);
      })
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  },
};

const RandomFactIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RandomFactIntent';
  },
  async handle(handlerInput) {
    let speechText = 'Hello World!';
    const repromptText = 'I didn\'t quite catch you';
    await fetch('https://randomuselessfact.appspot.com/random.json')
      .then(res => res.json())
      .then(data => {
        speechText = data.text;
      })
      .catch(err => {
        console.log('Error: '+err);
        speechText = 'Service error! Please try again later';
      })
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    const speechText = "See you again!";
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    ConvertCurrencyIntentHandler,
    RandomFactIntentHandler,
    FindWeatherIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
