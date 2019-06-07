# Alexa Playground
Alexa Playground (a.k.a lost-playground) is a skill designed without any specific purpose.
Currently, it includes free online api's to convert currency, get a random fact, 
get weather given a location.

All contributions and PR's are welcome. Add more stuff and make this project more random!!!

## Convert currency
commands like this can be used :
```
"what is the value of {baseCountry} in {country}",
"what is the value of {country} currency",
"what is the value of {country}",
"how much is {country} currency",
```
USD is always default if no `baseCountry` is mentioned. Example: 
```
baseCountry: United States(default)(optional)
Country: India
```

## Get a random fact
commands like this can be used :
```
"tell me something i don't know",
"enlighten me",
"tell me something",
"tell a random fact",
"generate a random fact",
```

## Find weather of a location
commands like this can be used : (date is optional and uses current day as default.
 `date` can be today, tomorrow, etc)
```
"weather in {city}",
"what is the weather in {city}",
"weather in {city} on {date}",
"tell me the weather in {city} {date}", (tomorrow, etc)
"what is the weather in {city} on {date}",
```