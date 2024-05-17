// https://developers.google.com/sheets/api/guides/values#node.js_4
import express, { Request, Response } from "express";
import { google, sheets_v4 } from "googleapis";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleAuth, OAuth2Client, JWT } from "google-auth-library";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const SPREADSHEET_ID = process.env.SPREADSHEET_ID as string;

const auth = new GoogleAuth({
  keyFile: path.join(__dirname, "..", "credentials.json"),
  scopes: SCOPES,
});

async function getGoogleSheetsClient(): Promise<sheets_v4.Sheets> {
  const authClient = (await auth.getClient()) as JWT | OAuth2Client;
  google.options({ auth: authClient }); // Set the global auth
  return google.sheets({ version: "v4", auth: authClient });
}

// Get Data
async function getSheetData(range: string): Promise<any[][]> {
  const sheets = await getGoogleSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: range,
  });
  return response.data.values || [];
}

// Update Data
async function updateSheetData(range: string, values: any[][]) {
  console.log(`Updating sheet data with range: ${range}`);
  // console.log('Values to update:', values);

  const sheets = await getGoogleSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: range,
    valueInputOption: "RAW",
    requestBody: {
      values: values,
    },
  });
}

app.get("/", (req: Request, res: Response) => {
  res.send("Google Sheets as Database");
});

// ======================= CANADA ENDPOINTS =======================
app.get("/ca-data", async (req: Request, res: Response) => {
  try {
    const sheetData = await getSheetData("Canada!A2:W");
    const rows = sheetData;

    if (rows && rows.length) {
      res.status(200).json(rows);
    } else {
      res.status(404).send("No data found.");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.post("/ca-data", async (req: Request, res: Response) => {
  const data = req.body.data; // Assume data is an array of objects

  try {
    data.sort((a: any, b: any) => b.rowIndex - a.rowIndex);

    const sheetData = await getSheetData("Canada!A:W"); // Adjust the range as needed

    for (let item of data) {
      const {
        rowIndex,
        quantityPurchased,
        dateSold,
        salePrice,
        fees,
        orderID,
        orderItemID,
      } = item;

      // Ensure rowIndex is within bounds
      while (rowIndex - 1 >= sheetData.length) {
        sheetData.push(new Array(23).fill("")); // Ensure the array has enough rows
      }

      const row = sheetData[rowIndex - 1]; // Adjust for 1-based index

      if (
        !row[12] &&
        !row[13] &&
        !row[15] &&
        !row[16] &&
        !row[21] &&
        !row[22]
      ) {
        // Row is empty, insert data directly
        // row index
        console.log("empty", rowIndex);
        row[12] = quantityPurchased;
        row[13] = dateSold;
        row[15] = salePrice;
        row[16] = fees;
        row[21] = orderID;
        row[22] = orderItemID;
      } else {
        console.log("not empty", rowIndex);

        if (orderItemID !== row[22]) {
          console.log(rowIndex, "Shift down the data");
          // Row is not empty, shift data down from rowIndex + 1
          sheetData.splice(rowIndex, 0, new Array(23).fill("")); // Insert an empty row at rowIndex
          // Insert the new data into the newly created empty row
          sheetData[rowIndex][12] = quantityPurchased;
          sheetData[rowIndex][13] = dateSold;
          sheetData[rowIndex][15] = salePrice;
          sheetData[rowIndex][16] = fees;
          sheetData[rowIndex][21] = orderID;
          sheetData[rowIndex][22] = orderItemID;
        } else {
          // when orderItemID is not matched clean the fields (index 12, 13, 15 16, 21, 22)
          // and insert the data
          console.log(rowIndex, "Same order Item ID matches found / overwriting data");
          row[12] = quantityPurchased;
          row[13] = dateSold;
          row[15] = salePrice;
          row[16] = fees;
          row[21] = orderID;
          row[22] = orderItemID;
        }
      }
    }

    await updateSheetData("Canada!A:W", sheetData); // Adjust the range as needed
    res.status(201).send("Data updated successfully.");
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// ======================= USA ENDPOINTS =======================

app.get("/us-data", async (req: Request, res: Response) => {
  try {
    const sheetData = await getSheetData("US!A2:W");
    const rows = sheetData;

    if (rows && rows.length) {
      res.status(200).json(rows);
    } else {
      res.status(404).send("No data found.");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.post("/us-data", async (req: Request, res: Response) => {
  const data = req.body.data; // Assume data is an array of objects

  try {
    data.sort((a: any, b: any) => b.rowIndex - a.rowIndex);

    const sheetData = await getSheetData("US!A:W"); // Adjust the range as needed

    for (let item of data) {
      const {
        rowIndex,
        quantityPurchased,
        dateSold,
        salePrice,
        fees,
        orderID,
        orderItemID,
      } = item;

      // Ensure rowIndex is within bounds
      while (rowIndex - 1 >= sheetData.length) {
        sheetData.push(new Array(23).fill("")); // Ensure the array has enough rows
      }

      const row = sheetData[rowIndex - 1]; // Adjust for 1-based index

      if (
        !row[12] &&
        !row[13] &&
        !row[15] &&
        !row[16] &&
        !row[21] &&
        !row[22]
      ) {
        // Row is empty, insert data directly
        // row index
        console.log("empty", rowIndex);
        row[12] = quantityPurchased;
        row[13] = dateSold;
        row[15] = salePrice;
        row[16] = fees;
        row[21] = orderID;
        row[22] = orderItemID;
      } else {
        console.log("not empty", rowIndex);

        if (orderItemID !== row[22]) {
          console.log(rowIndex, "Shift down the data");
          // Row is not empty, shift data down from rowIndex + 1
          sheetData.splice(rowIndex, 0, new Array(23).fill("")); // Insert an empty row at rowIndex
          // Insert the new data into the newly created empty row
          sheetData[rowIndex][12] = quantityPurchased;
          sheetData[rowIndex][13] = dateSold;
          sheetData[rowIndex][15] = salePrice;
          sheetData[rowIndex][16] = fees;
          sheetData[rowIndex][21] = orderID;
          sheetData[rowIndex][22] = orderItemID;
        } else {
          // when orderItemID is not matched clean the fields (index 12, 13, 15 16, 21, 22)
          // and insert the data
          console.log(rowIndex, "Same order Item ID matches found / overwriting data");
          row[12] = quantityPurchased;
          row[13] = dateSold;
          row[15] = salePrice;
          row[16] = fees;
          row[21] = orderID;
          row[22] = orderItemID;
        }
      }
    }

    await updateSheetData("Canada!A:W", sheetData); // Adjust the range as needed
    res.status(201).send("Data updated successfully.");
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
