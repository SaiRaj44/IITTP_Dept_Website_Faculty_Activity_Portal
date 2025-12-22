import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { google } from 'googleapis';
import connectMongoDB from '../../../lib/mongodb';
import Publication from '@/app/models/activity-portal/publications';
import Project from '@/app/models/activity-portal/projects';
import LecturesDelivered from '@/app/models/activity-portal/lectures';
import OrganizedEvent from '@/app/models/activity-portal/organized';
import PptxGenJS from 'pptxgenjs';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

// Interface definitions
interface FacultyMember {
  name: string;
  institute?: string;
}

interface PublicationData {
  title: string;
  facultyInvolved: FacultyMember[];
  category: string;
  journal_name?: string;
  year: string;
  date: Date;
  doi?: string;
  url?: string;
}

interface ProjectData {
  title: string;
  facultyInvolved: FacultyMember[];
  category: string;
  industry: string;
  amount: string;
  year: string;
  date: Date;
}

interface LectureData {
  title: string;
  facultyInvolved: FacultyMember[];
  institution: string;
  startDate: Date;
  endDate: Date;
  year: string;
  date: Date;
}

interface WorkshopData {
  title: string;
  category: string;
  facultyInvolved: FacultyMember[];
  startDate: Date;
  endDate: Date;
  venue: string;
  date: Date;
}

// Helper function to format dates
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Helper function to format faculty names
function formatFacultyNames(faculty: FacultyMember[]): string {
  return faculty.map(f => f.name).join(', ');
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const { startDate, endDate } = await request.json();
    
    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongoDB();

    // Create date filter
    const dateFilter = {
      published: true,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    // Fetch data from all collections
    const [publications, projects, lectures, workshops] = await Promise.all([
      Publication.find(dateFilter).lean<PublicationData[]>(),
      Project.find(dateFilter).lean<ProjectData[]>(),
      LecturesDelivered.find(dateFilter).lean<LectureData[]>(),
      OrganizedEvent.find({
        ...dateFilter,
        category: 'Workshops'
      }).lean<WorkshopData[]>()
    ]);

    // Initialize Google Auth with service account
    let serviceAccountKey;
    try {
      if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      } else {
        const keyPath = path.resolve(process.cwd(), './google-credentials.json');
        serviceAccountKey = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      }
    } catch (error) {
      console.error('Error loading service account credentials:', error);
      return NextResponse.json(
        { success: false, error: 'Unable to load Google service account credentials' },
        { status: 500 }
      );
    }

    // Initialize Google Drive client for attempting upload
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccountKey,
      scopes: [
        'https://www.googleapis.com/auth/drive.file'
      ]
    });

    const drive = google.drive({ version: 'v3', auth });

    // Create PowerPoint presentation using PptxGenJS
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = `Department Activity Report - ${formatDate(new Date(startDate))} to ${formatDate(new Date(endDate))}`;
    pptx.subject = 'Publications, Projects, and Lectures';
    pptx.author = 'IIT Tirupati - CSE Department';

    // Define slide master with consistent styling matching reference template
    pptx.defineSlideMaster({
      title: 'MASTER_SLIDE',
      background: { color: 'FFFFFF' },
      objects: [
        {
          // Red header bar (matching reference design)
          rect: {
            x: 0, y: 0, w: 10, h: 0.6,
            fill: { color: 'C00000' }
          }
        },
        {
          // Department title in header
          text: {
            text: 'Department of Computer Science & Engineering',
            options: {
              x: 0.2, y: 0.1, w: 9.6, h: 0.4,
              fontSize: 18,
              fontFace: 'Garamond',
              color: 'FFFFFF',
              bold: true,
              align: 'center',
              valign: 'middle'
            }
          }
        },
        {
          // Footer with institution name
          text: {
            text: 'Indian Institute of Technology Tirupati',
            options: {
              x: 0.5, y: 6.8, w: 5, h: 0.4,
              fontSize: 10,
              fontFace: 'Century Gothic',
              color: '696969'
            }
          }
        },
        {
          // Date in footer
          text: {
            text: new Date().toLocaleDateString(),
            options: {
              x: 8, y: 6.8, w: 2, h: 0.4,
              align: 'right',
              fontSize: 10,
              fontFace: 'Century Gothic',
              color: '696969'
            }
          }
        }
      ]
    });

    // Create title slide with custom design matching reference image
    const titleSlide = pptx.addSlide();
    
    // Set slide background
    titleSlide.background = { color: 'FFFFFF' };
    
    // Add red header bar at top
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: '100%', h: 0.8,
      fill: { color: 'C00000' }, // Red header color matching reference
      line: { color: 'C00000' }
    });
    
    // Add department name in header - white text on red background
    titleSlide.addText('Department of Computer Science & Engineering', {
      x: 0, y: 0, w: '100%', h: 0.8,
      fontSize: 26,
      fontFace: 'Garamond',
      color: 'FFFFFF',
      bold: true,
      italic: true,
      align: 'center',
      valign: 'middle'
    });
    
    // Generate dynamic title based on date range
    const startMonth = new Date(startDate).toLocaleDateString('en-US', { month: 'long' });
    const endMonth = new Date(endDate).toLocaleDateString('en-US', { month: 'long' });
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();
    
    const dateSubtitle = startYear === endYear
      ? startMonth === endMonth
        ? `${startMonth} ${startYear}`
        : `${startMonth}, ${endMonth} & ${endMonth} ${startYear}`
      : `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
    
    // Add 'Updates' title - large, bold, black text
    titleSlide.addText('Updates', {
      x: 0.5, y: 1.4, w: 9, h: 1.2,
      fontSize: 62,
      fontFace: 'Century Gothic',
      color: '000000',
      bold: true,
      align: 'center',
    });
    
    // Add date subtitle
    titleSlide.addText(dateSubtitle, {
      x: 0.5, y: 2.7, w: 9, h: 1,
      fontSize: 48,
      fontFace: 'Century Gothic',
      color: '000000',
      bold: true,
      align: 'center',
      valign: 'middle'
    });
    
    // Add presenter name
    titleSlide.addText('Dr. Sridhar Chimalakonda', {
      x: 0.5, y: 4.0, w: 9, h: 0.8,
      fontSize: 28,
      fontFace: 'Century Gothic',
      color: '000000',
      bold: true,
      align: 'center',
      valign: 'middle'
    });
    
    // Add Sanskrit text
    titleSlide.addText('भारतीय प्रौद्योगिकी संस्थान तिरुपति', {
      x: 0.5, y: 4.8, w: 9, h: 0.5,
      fontSize: 18,
      fontFace: 'Arial',
      color: '000000',
      align: 'center',
      valign: 'middle'
    });
    
    // Add institute logo (if available)
    try {
      titleSlide.addImage({
        path: './public/assets/images/iittp-logo.png',
        x: 3.75, y: 5.3, w: 2.5, h: 1.5
      });
    } catch {
      console.log('Logo not found, adding text placeholder instead');
      // Add text placeholder if logo is not available
      titleSlide.addText('TIRUPATI', {
        x: 3, y: 5.5, w: 4, h: 0.8,
        fontSize: 36,
        fontFace: 'Arial',
        color: 'C00000',
        bold: true,
        align: 'center',
        valign: 'middle'
      });
    }

    // Publications slide - matching reference format "In Refereed International Journals/Conferences"
    if (publications.length > 0) {
      let currentSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
      
      // Add slide title matching reference format
      currentSlide.addText('In Refereed International Journals/ Conferences:', {
        x: 0.5, y: 0.8, w: 9, h: 0.6,
        fontSize: 20,
        fontFace: 'Century Gothic',
        color: '000000',
        bold: true,
        align: 'left'
      });

      let yPos = 1.6;
      const itemsPerSlide = 4; // Fewer items per slide for better readability
      let itemCount = 0;
      
      for (const pub of publications) {
        if (itemCount >= itemsPerSlide) {
          // Create new slide if content overflows
          currentSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
          currentSlide.addText('In Refereed International Journals/ Conferences: (continued)', {
            x: 0.5, y: 0.8, w: 9, h: 0.6,
            fontSize: 20,
            fontFace: 'Century Gothic',
            color: '000000',
            bold: true,
            align: 'left'
          });
          yPos = 1.6;
          itemCount = 0;
        }
        
        // Format publication entry to match reference style
        const facultyNames = formatFacultyNames(pub.facultyInvolved);
        const title = pub.title || 'Untitled';
        const journal = pub.journal_name || 'Unknown Journal';
        const year = pub.year || 'N/A';
        const doi = pub.doi || '';
        
        // Create citation in reference format: "Authors. Title. Journal (Year). DOI"
        let citationText = `${facultyNames}. "${title}". `;
        citationText += `${journal}`;
        if (year !== 'N/A') {
          citationText += ` (${year})`;
        }
        if (doi) {
          citationText += `. DOI: ${doi}`;
        }
        citationText += '.';
        
        currentSlide.addText(citationText, {
          x: 0.5, y: yPos, w: 9, h: 1.0,
          fontSize: 11,
          fontFace: 'Century Gothic',
          color: '000000',
          align: 'left',
          wrap: true
        });
        
        yPos += 1.2;
        itemCount++;
      }
    }

    // Projects slide - matching reference format "Sponsored Projects"
    if (projects.length > 0) {
      const projectSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
      
      // Add slide title matching reference format
      projectSlide.addText('Sponsored Projects', {
        x: 0.5, y: 0.8, w: 9, h: 0.6,
        fontSize: 20,
        fontFace: 'Century Gothic',
        color: '000000',
        bold: true,
        align: 'left'
      });

      // Create table with headers matching reference format
      const tableData = [
        [
          { text: 'Title', options: { bold: true, fontSize: 12, fontFace: 'Century Gothic', color: '000000' } },
          { text: 'Duration', options: { bold: true, fontSize: 12, fontFace: 'Century Gothic', color: '000000' } },
          { text: 'Funding Agency', options: { bold: true, fontSize: 12, fontFace: 'Century Gothic', color: '000000' } },
          { text: 'Amount', options: { bold: true, fontSize: 12, fontFace: 'Century Gothic', color: '000000' } },
          { text: 'Coordinators', options: { bold: true, fontSize: 12, fontFace: 'Century Gothic', color: '000000' } }
        ]
      ];

      // Add project data to table
      for (const proj of projects) {
        const title = proj.title || 'Untitled Project';
        const duration = proj.date ? new Date(proj.date).getFullYear().toString() : 'N/A';
        const fundingAgency = proj.industry || 'N/A';
        const amount = proj.amount ? `₹${proj.amount}` : 'N/A';
        const coordinators = formatFacultyNames(proj.facultyInvolved);
        
        tableData.push([
          { text: title, options: { fontSize: 10, fontFace: 'Century Gothic', color: '000000', bold: false } },
          { text: duration, options: { fontSize: 10, fontFace: 'Century Gothic', color: '000000', bold: false } },
          { text: fundingAgency, options: { fontSize: 10, fontFace: 'Century Gothic', color: '000000', bold: false } },
          { text: amount, options: { fontSize: 10, fontFace: 'Century Gothic', color: '000000', bold: false } },
          { text: coordinators, options: { fontSize: 10, fontFace: 'Century Gothic', color: '000000', bold: false } }
        ]);
      }

      // Add table to slide
      projectSlide.addTable(tableData, {
        x: 0.5,
        y: 1.6,
        w: 9,
        h: 4.5,
        border: { pt: 1, color: '000000' },
        fill: { color: 'FFFFFF' },
        colW: [2.5, 1.2, 1.8, 1.2, 2.3]
      });
    }

    // Lectures slide - matching reference format "Special Lectures Delivered/ Invited Talks"
    if (lectures.length > 0) {
      let currentSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
      
      // Add slide title matching reference format
      currentSlide.addText('Special Lectures Delivered/ Invited Talks:', {
        x: 0.5, y: 0.8, w: 9, h: 0.6,
        fontSize: 20,
        fontFace: 'Century Gothic',
        color: '000000',
        bold: true,
        align: 'left'
      });

      let yPos = 1.6;
      const itemsPerSlide = 4;
      let itemCount = 0;
      
      for (const lect of lectures) {
        if (itemCount >= itemsPerSlide) {
          currentSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
          currentSlide.addText('Special Lectures Delivered/ Invited Talks: (continued)', {
            x: 0.5, y: 0.8, w: 9, h: 0.6,
            fontSize: 20,
            fontFace: 'Century Gothic',
            color: '000000',
            bold: true,
            align: 'left'
          });
          yPos = 1.6;
          itemCount = 0;
        }
        
        // Format lecture entry to match reference style: "Dr. Faculty Name, Title, Institution, Date"
        const facultyNames = formatFacultyNames(lect.facultyInvolved);
        const title = lect.title || 'Untitled Lecture';
        const institution = lect.institution || 'Unknown Institution';
        const lectureDate = lect.startDate ? formatDate(lect.startDate) : 'N/A';
        
        const lectureText = `${facultyNames}, "${title}", ${institution}, ${lectureDate}`;
        
        currentSlide.addText(lectureText, {
          x: 0.5, y: yPos, w: 9, h: 1.0,
          fontSize: 11,
          fontFace: 'Century Gothic',
          color: '000000',
          align: 'left',
          wrap: true
        });
        
        yPos += 1.2;
        itemCount++;
      }
    }

    // Workshops Organized slide - matching reference format
    if (workshops.length > 0) {
      let currentSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
      
      // Add slide title matching reference format
      currentSlide.addText('Workshops Organized:', {
        x: 0.5, y: 0.8, w: 9, h: 0.6,
        fontSize: 20,
        fontFace: 'Century Gothic',
        color: '000000',
        bold: true,
        align: 'left'
      });

      let yPos = 1.6;
      const itemsPerSlide = 4;
      let itemCount = 0;
      
      for (const workshop of workshops) {
        if (itemCount >= itemsPerSlide) {
          currentSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
          currentSlide.addText('Workshops Organized: (continued)', {
            x: 0.5, y: 0.8, w: 9, h: 0.6,
            fontSize: 20,
            fontFace: 'Century Gothic',
            color: '000000',
            bold: true,
            align: 'left'
          });
          yPos = 1.6;
          itemCount = 0;
        }
        
        // Format workshop entry: "Title, Faculty Names, Venue, Date Range"
        const facultyNames = formatFacultyNames(workshop.facultyInvolved);
        const title = workshop.title || 'Untitled Workshop';
        const venue = workshop.venue || 'Unknown Venue';
        const startDate = workshop.startDate ? formatDate(workshop.startDate) : 'N/A';
        const endDate = workshop.endDate ? formatDate(workshop.endDate) : 'N/A';
        const dateRange = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
        
        const workshopText = `"${title}", organized by ${facultyNames}, ${venue}, ${dateRange}`;
        
        currentSlide.addText(workshopText, {
          x: 0.5, y: yPos, w: 9, h: 1.0,
          fontSize: 11,
          fontFace: 'Century Gothic',
          color: '000000',
          align: 'left',
          wrap: true
        });
        
        yPos += 1.2;
        itemCount++;
      }
    }

    // Thank You slide - matching reference image format
    const thankYouSlide = pptx.addSlide();
    
    // Set slide background
    thankYouSlide.background = { color: 'FFFFFF' };
    
    // Add 'Ongoing Activities' section title
    thankYouSlide.addText('Ongoing Activities', {
      x: 0.5, y: 0.5, w: 9, h: 0.8,
      fontSize: 36,
      fontFace: 'Century Gothic',
      color: '000000',
      bold: true,
      align: 'left',
      valign: 'middle'
    });
    
    // Add numbered list of ongoing activities
    thankYouSlide.addText([
      { text: '1. ', options: { bold: true, fontSize: 24 } },
      { text: 'Outreach for faculty recruitment', options: { fontSize: 24 } }
    ], {
      x: 0.5, y: 1.5, w: 9, h: 0.6,
      fontFace: 'Century Gothic',
      color: '000000',
      bullet: false
    });
    
    thankYouSlide.addText([
      { text: '2. ', options: { bold: true, fontSize: 24 } },
      { text: 'Collaborative project proposals', options: { fontSize: 24 } }
    ], {
      x: 0.5, y: 2.1, w: 9, h: 0.6,
      fontFace: 'Century Gothic',
      color: '000000',
      bullet: false
    });
    
    thankYouSlide.addText([
      { text: '3. ', options: { bold: true, fontSize: 24 } },
      { text: '...', options: { fontSize: 24 } }
    ], {
      x: 0.5, y: 2.7, w: 9, h: 0.6,
      fontFace: 'Century Gothic',
      color: '000000',
      bullet: false
    });
    
    // Add red box with Thank You text
    thankYouSlide.addShape(pptx.ShapeType.rect, {
      x: 5.7, y: 1.5, w: 4, h: 1.5,
      fill: { color: 'C00000' }, // Red color matching reference
      line: { color: 'C00000' }
    });
    
    // Add Thank You text in white inside red box
    thankYouSlide.addText('Thank You...!!', {
      x: 5.7, y: 1.5, w: 4, h: 1.5,
      fontSize: 36,
      fontFace: 'Garamond',
      color: 'FFFFFF',
      bold: true,
      italic: true,
      align: 'center',
      valign: 'middle'
    });
    
    // Add page number
    thankYouSlide.addText('12', {
      x: 9.3, y: 6.8, w: 0.4, h: 0.3,
      fontSize: 12,
      fontFace: 'Century Gothic',
      color: '000000',
      align: 'right',
      valign: 'bottom'
    });

    // Generate the PowerPoint file
    const buffer = await pptx.write({ outputType: 'nodebuffer' }) as Buffer;
    
    // Create filename with date range
    const fileName = `CSE_Department_Report_${new Date(startDate).toISOString().split('T')[0]}_to_${new Date(endDate).toISOString().split('T')[0]}.pptx`;
    
    console.log('PowerPoint file generated successfully');

    // Create a summary
    const summary = {
      publications: publications.length,
      projects: projects.length,
      lectures: lectures.length,
      workshops: workshops.length,
      totalItems: publications.length + projects.length + lectures.length + workshops.length
    };

    // Attempt to upload to Google Drive
    let driveUploadResult: {
      fileId: string | null | undefined;
      webViewLink: string | null | undefined;
      webContentLink: string | null | undefined;
      fileName: string | null | undefined;
    } | null = null;
    let driveError: string | null = null;
    
    // Check if Google Drive upload is disabled for testing
    const disableDriveUpload = process.env.DISABLE_DRIVE_UPLOAD === 'true';
    
    if (disableDriveUpload) {
      console.log('Google Drive upload disabled for testing');
      driveError = 'Google Drive upload temporarily disabled';
    } else {
      try {
        console.log('Attempting to upload to Google Drive...');
      
        // Convert buffer to stream for Google Drive API
        const stream = Readable.from(buffer);
        
        // Check if we have a shared drive ID configured
        const sharedDriveId = process.env.GOOGLE_SHARED_DRIVE_ID;
        
        const fileMetadata = {
          name: fileName,
          parents: sharedDriveId ? [sharedDriveId] : ['root']
        };
        
        if (sharedDriveId) {
          console.log('Uploading to Shared Drive:', sharedDriveId);
        } else {
          console.log('Uploading to root folder (may fail due to service account limitations)');
        }
        
        const media = {
          mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          body: stream
        };
        
        const createParams = {
          requestBody: fileMetadata,
          media: media,
          fields: 'id,webViewLink,webContentLink,name',
          supportsAllDrives: !!sharedDriveId
        };
        
        const file = await drive.files.create(createParams);
        
        // Make the file publicly viewable (optional)
        try {
          await drive.permissions.create({
            fileId: file.data.id!,
            requestBody: {
              role: 'reader',
              type: 'anyone'
            },
            supportsAllDrives: !!sharedDriveId
          });
          console.log('File made publicly viewable');
        } catch (permError) {
          console.log('Could not make file public, but upload succeeded:', permError);
        }
        
        driveUploadResult = {
          fileId: file.data.id,
          webViewLink: file.data.webViewLink,
          webContentLink: file.data.webContentLink,
          fileName: file.data.name
        };
        
        console.log('Successfully uploaded to Google Drive:', file.data.id);
        
      } catch (error: unknown) {
        const err = error as Error;
        console.error('Google Drive upload failed:', err.message);
        driveError = err.message;
        
        // Check if it's a storage quota issue
        if (err.message?.includes('storage quota') || err.message?.includes('Service Accounts do not have storage quota')) {
          driveError = 'Service account storage limitations. File will be downloaded directly.';
        }
      }
    }

    // Always return the file as download, with optional Drive info in headers
    const responseHeaders: Record<string, string> = {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': buffer.length.toString(),
      'X-Report-Summary': JSON.stringify(summary),
      'X-Date-Range': JSON.stringify({ startDate, endDate })
    };
    
    // Add Google Drive info to headers if upload succeeded
    if (driveUploadResult) {
      responseHeaders['X-Drive-Upload'] = 'success';
      responseHeaders['X-Drive-File-Id'] = driveUploadResult.fileId || '';
      responseHeaders['X-Drive-View-Link'] = driveUploadResult.webViewLink || '';
      responseHeaders['X-Drive-Download-Link'] = driveUploadResult.webContentLink || '';
    } else {
      responseHeaders['X-Drive-Upload'] = 'failed';
      responseHeaders['X-Drive-Error'] = driveError || 'Unknown error';
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: responseHeaders
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error generating Google Slides report:', err);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate report',
        details: err.message
      },
      { status: 500 }
    );
  }
}