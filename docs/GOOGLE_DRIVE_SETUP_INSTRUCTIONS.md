# Google Drive Upload Setup Instructions

## Problem
Service accounts don't have their own storage quota, so they cannot upload files to their own Google Drive. The error you're seeing is:
```
Service Accounts do not have storage quota. Leverage shared drives or use OAuth delegation instead.
```

## Solution 1: Shared Drive (Recommended)

### Step 1: Create a Shared Drive
1. Go to [Google Drive](https://drive.google.com)
2. Click "New" → "More" → "Shared drive"
3. Name it something like "IIT Tirupati Reports" or "Department Reports"
4. Click "Create"

### Step 2: Add Service Account to Shared Drive
1. In your new Shared Drive, click the settings icon (⚙️)
2. Click "Manage members"
3. Click "Add members"
4. Add your service account email (found in your `google-credentials.json` file under `client_email`)
5. Set the role to "Manager" or "Content manager"
6. Click "Send"

### Step 3: Get Shared Drive ID
1. In Google Drive, navigate to your Shared Drive
2. The URL will look like: `https://drive.google.com/drive/folders/SHARED_DRIVE_ID_HERE`
3. Copy the ID from the URL (the long string after `/folders/`)

### Step 4: Add Environment Variable
Add this to your `.env.local` file:
```env
GOOGLE_SHARED_DRIVE_ID=your_shared_drive_id_here
```

### Step 5: Restart Your Application
```bash
# Stop your development server and restart it
npm run dev
```

## Solution 2: OAuth Delegation (Alternative)

If you prefer to upload to a user's personal Google Drive instead of a Shared Drive:

### Step 1: Enable Domain-Wide Delegation
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to "IAM & Admin" → "Service Accounts"
3. Find your service account and click on it
4. Go to "Advanced settings"
5. Check "Enable Google Workspace Domain-wide Delegation"
6. Note the "Client ID"

### Step 2: Configure in Google Workspace Admin
1. Go to [Google Admin Console](https://admin.google.com)
2. Navigate to "Security" → "API Controls" → "Domain-wide Delegation"
3. Click "Add new"
4. Enter the Client ID from Step 1
5. Add these OAuth scopes:
   ```
   https://www.googleapis.com/auth/drive.file
   ```
6. Click "Authorize"

### Step 3: Update Code for Delegation
This requires modifying the code to impersonate a user. Let me know if you want to implement this approach.

## Testing

After setting up either solution:

1. Navigate to `/reports` in your application
2. Generate a report with any date range
3. Check the console logs for:
   - "Uploading to Shared Drive: [ID]" (Solution 1)
   - "Successfully uploaded to Google Drive: [file_id]"

## Troubleshooting

### Common Issues:
1. **"Insufficient permissions"**: Make sure the service account has "Manager" role in the Shared Drive
2. **"Shared drive not found"**: Double-check the Shared Drive ID in your environment variable
3. **"supportsAllDrives parameter required"**: This is handled automatically in the updated code

### Environment Variables Summary:
```env
# Required for service account authentication
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
# OR
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Required for Shared Drive upload (Solution 1)
GOOGLE_SHARED_DRIVE_ID=your_shared_drive_id_here

# Optional: For OAuth delegation (Solution 2)
GOOGLE_WORKSPACE_DOMAIN=yourdomain.com
GOOGLE_IMPERSONATION_EMAIL=admin@yourdomain.com
```

## Current Implementation Status

✅ **Code Updated**: The API now supports both Shared Drive and regular Drive upload
✅ **Environment Variable Support**: Uses `GOOGLE_SHARED_DRIVE_ID` when available
✅ **Fallback Handling**: Still works with direct download if Drive upload fails
✅ **Error Logging**: Provides clear feedback about upload status

## Next Steps

1. **Choose Solution 1 (Recommended)**: Set up Shared Drive as described above
2. **Test the implementation**: Generate a report and verify both download and Drive upload work
3. **Optional**: If you need Solution 2 (OAuth delegation), let me know and I'll implement that approach

The system will now automatically detect if you have a Shared Drive configured and use it for uploads, while maintaining the direct download functionality as a backup.
