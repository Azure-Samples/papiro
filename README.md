# Papiro Document Intelligence

As part of Microsoft /BUILD 2022 the AI Platform Group showed a conference intelligence application that used a number of intelligence APIs to showcase what might be done to support conferences with AI. This is the project that was shown!

## Features

This sample provides the following features:

* Quick Check-in using ID/Vaccination Card
* FAQ Multilingual Document Translation
* TLDR Policy Document Summarization
* Audio Session Feedback to Sentiment

## Getting Started

### Prerequisites

A working operating system with node, the `az` CLI, and PowerShell.

### Quickstart

There are a few steps for setting this up:

1. Clone this repo
2. Azure Infrastructure setup:
```
./provision.ps1 -name <YOUR_APP_NAME> -location westus2
```
3. Azure Web App publish:
```
./publish.ps1 -name <YOUR_APP_NAME>
```
4. [**Optional**] Local Run (in progress):
```
ss
```

### Text Generation

The text generation API is created using another sample 
shown at Microsoft /BUILD 2022. If you're interested in
setting this up, head on over to the
[Managed AzureML Inference](https://github.com/Azure-Samples/locutus/wiki/Managed-Inference)
instructions.


## Resources

More to come...

- Link to supporting information
- Link to similar sample
- ...
