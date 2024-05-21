# Amazon Seller Google Chrome Extension - Backend

This repository contains the backend for the Amazon Seller Google Chrome Extension. It is deployed on Vercel.

## Basic Information

This backend exports data from a flat text file to Google Sheets and populates the data if there is a matching SKU. This allows Amazon sellers to track sales and profits effectively.

## Google Sheets API Setup

1. **Set Up Google Sheets API**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/apis/library/sheets.googleapis.com).
   - Enable the Google Sheets API.

2. **Set Up Credentials**:
   - Create API Key
   - Set up OAuth
   - Create a Service Account

3. **Obtain OAuth JSON File**:
   - Download the OAuth JSON file and name it `credentials.json`.
   - Ensure it follows the format of `sample.credentials.json`.
   - Encode the file using:

   ```sh
   cat credentials.json | base64
   
4. **Update .env File**:
    - Copy and paste the encoded JSON content into your .env file.

5. **Get Spreadsheet ID**:
    - Navigate to your Google Sheets document: https://docs.google.com/spreadsheets/d/<spreadsheetID>/edit#gid=0.
    - Copy the <spreadsheetID>.

5. **Update .env File**:
    - Add the Spreadsheet ID to your .env file.

## Installation and Development

1. **Install the necessary dependencies**:

```sh
npm install
```

2. **Start the development server**:

```sh
npm run dev```