import { google } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config();

const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID!;

const auth = new google.auth.GoogleAuth({
    keyFile: './google-service-account.json',
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });

async function testDriveConnection() {
    try {
        console.log("Testing connection to Google Drive folder...");
        
        const response = await drive.files.list({
            q: `'${DRIVE_FOLDER_ID}' in parents and trashed = false`,
            pageSize: 10,
            fields: 'files(id, name, mimeType)',
        });

        const files = response.data.files;
        if (!files || files.length === 0) {
            console.log("Connection successful, but no files were found in this folder.");
            return;
        }

        console.log(`Successfully connected! Found ${files.length} file(s) in your shared folder:`);
        files.forEach(file => {
            console.log(`- [${file.mimeType}] ${file.name} (ID: ${file.id})`);
        });

    } catch (error: any) {
        console.error("Google Drive connection failed:", error.message);
    }
}

testDriveConnection();