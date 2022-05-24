# Papiro Document Intelligence

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Papiro Document Intelligence](#papiro-document-intelligence)
  - [Overview](#overview)
  - [Features](#features)
  - [Tools & Services Used](#tools-services-used)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Quickstart](#quickstart)
    - [Text Generation](#text-generation)

<!-- /code_chunk_output -->

## Overview

As part of Microsoft /BUILD 2022 the AI Platform Group showed a conference intelligence application that used a number of intelligence APIs to showcase what might be done to support conferences with AI. This is the project that was shown!

[Microsoft Build free registration](https://mybuild.microsoft.com/home?WT.mc_id=javascript-63868-ayyonet) is now open and the sessions are listed.

Sign up for the AI session on showcasing this demo: [https://aka.ms/MSBuild2022](https://aka.ms/MSBuild2022)

[![demo app teaser](http://img.youtube.com/vi/L10-LnbXxEo/0.jpg)](https://youtu.be/L10-LnbXxEo)

## Features

This sample conference app provides the following features:

- Quick user check-in using ID/Vaccination Card
- FAQ Multilingual Document Translation
- TLDR Policy Document Summarization
- Audio Session Feedback to Sentiment

## Tools & Services Used

- [Next.js CLI](https://nextjs.org/docs/api-reference/cli)
- [Azure Form Recognizer](https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/whats-new?tabs=csharp&WT.mc_id=javascript-63868-ayyonet)
  - New ID & Vaccination card pretrained models
  - Beta [JavaScript SDK](https://docs.microsoft.com/azure/applied-ai-services/form-recognizer/quickstarts/try-v3-javascript-sdk?WT.mc_id=javascript-63868-ayyonet)
- [Azure Speech](https://docs.microsoft.com/azure/cognitive-services/speech-service/?WT.mc_id=javascript-63868-ayyonet)
  - [Speech to Text](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-to-text?WT.mc_id=javascript-63868-ayyonet)
  - [JavaScript SDK](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/?view=azure-node-latest&WT.mc_id=javascript-63868-ayyonet)
- [Azure Translator](https://docs.microsoft.com/azure/cognitive-services/translator/translator-overview?WT.mc_id=javascript-63868-ayyonet)
  - [Document Translation](https://docs.microsoft.com/azure/cognitive-services/translator/document-translation/overview?WT.mc_id=javascript-63868-ayyonet)
  - [REST API SDK](https://docs.microsoft.com/azure/cognitive-services/translator/document-translation/reference/rest-api-guide?WT.mc_id=javascript-57623-ayyonet)
- [Azure Language](https://docs.microsoft.com/azure/cognitive-services/language-service/?WT.mc_id=javascript-63868-ayyonet)
  - [Sentiment Analysis](https://docs.microsoft.com/azure/cognitive-services/language-service/sentiment-opinion-mining/overview?WT.mc_id=javascript-63868-ayyonet)
  - [Text Analytics JavaScript Client Library](https://docs.microsoft.com/javascript/api/overview/azure/ai-text-analytics-readme?view=azure-node-latest&WT.mc_id=javascript-63868-ayyonet)
-  [Text Summarization Preview](https://docs.microsoft.com/azure/cognitive-services/language-service/text-summarization/overview?WT.mc_id=javascript-63868-ayyonet)
- [Azure ML CLI](https://github.com/Azure-Samples/locutus/wiki/Managed-Inference)
- [Bicep](https://docs.microsoft.com/azure/azure-resource-manager/bicep/overview?tabs=bicep&WT.mc_id=javascript-63868-ayyonet)
 is a language for declaratively deploying Azure resources. You can use Bicep instead of JSON for developing your Azure Resource Manager templates (ARM templates).

## Getting Started

### Prerequisites

A working operating system with [Node](https://nodejs.org/en/), the [Azure Command-Line Interface(`az` CLI)](https://docs.microsoft.com/cli/azure/?WT.mc_id=javascript-63868-ayyonet), and [PowerShell](https://docs.microsoft.com/powershell/?WT.mc_id=javascript-63868-ayyonet) or [Visual Studio Code](https://code.visualstudio.com/) and it's [Powershell extention](https://code.visualstudio.com/docs/languages/powershell?WT.mc_id=javascript-63868-ayyonet)

### Quickstart

There are a few steps for setting this up:

1. Clone this repo
2. Install yarn globally
```bash
npm i -g yarn
```
3. Azure Infrastructure setup:

```
./provision.ps1 -name <YOUR_APP_NAME> -location westus
```

4. Azure Web App publish:

```
./publish.ps1 -name <YOUR_APP_NAME>
```

5. For Web App setup, please refer to [/src/README](/src/README.md)

### Text Generation

The text generation API is created using another sample
shown at Microsoft /BUILD 2022. If you're interested in
setting this up, head on over to the
[Managed AzureML Inference](https://github.com/Azure-Samples/locutus/wiki/Managed-Inference)
instructions.

