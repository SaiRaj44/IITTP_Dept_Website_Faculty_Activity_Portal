# Google Drive & Slides Integration for Reports

This guide explains how to set up Google Drive integration for the CSE Department Reports module to automatically save PowerPoint presentations to Google Drive and convert them to Google Slides.

## Prerequisites

1. A Google Cloud Platform account
2. Google Drive API and Google Slides API enabled
3. A service account with appropriate permissions

## Setup Instructions

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

### 2. Enable Required APIs

1. Go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - Google Drive API
   - Google Slides API

### 3. Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" and select "Service Account"
3. Fill in the service account details and grant it appropriate roles:
   - Required role: "Editor" for Drive and Slides
4. Click "Done"

### 4. Create and Download Service Account Key

1. From the credentials page, click on your newly created service account
2. Go to the "Keys" tab
3. Click "Add Key" and select "Create new key"
4. Select JSON format and click "Create"
5. The key file will be downloaded to your computer

### 5. Configure the Application

1. Open the downloaded JSON key file
2. Copy the entire content of the file
3. Create or edit your `.env.local` file in the root of your project
4. Add the following environment variables:

```
GOOGLE_CREDENTIALS='{paste the entire JSON content here as a string}'
GOOGLE_DRIVE_FOLDER_ID='optional_folder_id_to_save_files_in'
```

Note: Make sure to escape any quotes in the JSON when adding it to your environment variable.

### 6. (Optional) Create a Specific Folder for Reports

1. Create a folder in your Google Drive where you want to store the reports
2. Get the folder ID from the URL (it's the long string after /folders/ in the URL)
3. Add this folder ID to the `GOOGLE_DRIVE_FOLDER_ID` environment variable

## Testing the Integration

1. Start your application
2. Go to the Reports page
3. Check the "Save to Google Drive" option
4. Fill in any date range if needed
5. Click "Generate & Save to Google Drive"
6. You should see a success message with a link to the created Google Slides presentation

## Troubleshooting

- **Error: "Google Drive credentials not configured"**: Check that your GOOGLE_CREDENTIALS environment variable is correctly set.
- **Permission issues**: Make sure your service account has the correct permissions.
- **Conversion problems**: Ensure both Drive API and Slides API are enabled in your Google Cloud project.

## Security Notes

- Keep your service account credentials secure and never commit them to version control
- Consider using a dedicated service account with limited permissions for this feature
- Regularly rotate your service account keys following security best practices
