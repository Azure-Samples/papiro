## Getting Started

Make sure to install the dependencies

```bash
yarn install
```

And copy the `.env.example` to `.env`

```bash
cp .env.example .env
```

### Session

Fill your `.env` with `SECRET_COOKIE_PASSWORD` with a 32 character string to use as a session secret.

### CosmosDB

All the cosmos DB information will be necessary, to store the information from the app.

```
COSMOS_DB_URI=
COSMOS_DB_KEY=
COSMOS_DB_NAME=
COSMOS_CONTAINER_NAME=
```

### Storage

The application uses a storage to temporary save the documents to translate, the variables look like.

```
STORAGE_ACCOUNT_BLOB_URI=
STORAGE_ACCOUNT_NAME=
STORAGE_ACCCOUNT_KEY=
```

### Cognitive Services

Fill your `.env` with all the cognitive services variables:

[Translator Service](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/)

[Form Recognizer](https://azure.microsoft.com/en-us/services/form-recognizer/)

[Language Service](https://azure.microsoft.com/en-us/services/cognitive-services/language-service/)

[Speech Service](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/overview)

```
TRANSLATION_SERVICE_NAME=
TRANSLATION_SERVICE_KEY=
FORM_RECOGNIZER_KEY=
FORM_RECOGNIZER_ENDPOINT=
LANGUAGE_SERVICE_KEY=
LANGUAGE_SERVICE_ENDPOINT=
SPEECH_SERVICE_KEY=
SPEECH_SERVICE_ENDPOINT=
```

## Development

Start the development server on http://localhost:3000

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn build
```