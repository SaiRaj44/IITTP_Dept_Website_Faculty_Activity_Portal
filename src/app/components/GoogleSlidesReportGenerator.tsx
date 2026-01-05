'use client';

import React, { useState } from 'react';
import { 

  CalendarIcon,
  ArrowDownTrayIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';



interface DriveUpload {
  success: boolean;
  fileId?: string;
  viewLink?: string;
  downloadLink?: string;
  error?: string;
}

interface ReportData {
  summary: {
    publications: number;
    projects: number;
    lectures: number;
    totalItems: number;
  };
  dateRange: {
    startDate: string;
    endDate: string;
  };
  driveUpload?: DriveUpload;
}

export default function GoogleSlidesReportGenerator() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string>('');

  const handleGenerateReport = async () => {
    // Validation
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before end date');
      return;
    }

    setLoading(true);
    setError('');
    setReportData(null);

    try {
      const response = await fetch('/api/reports/generate-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
        }),
      });

      if (response.ok) {
        // Get the filename from Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
        const filenameMatch = contentDisposition?.match(/filename="(.+)"/); 
        const fileName = filenameMatch ? filenameMatch[1] : `CSE_Department_Report_${startDate}_to_${endDate}.pptx`;
        
        // Handle the file download
        const blob = new Blob([await response.arrayBuffer()], {
          type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        });
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Extract report data from headers
        const summaryHeader = response.headers.get('x-report-summary');
        const dateRangeHeader = response.headers.get('x-date-range');
        
        const summary = summaryHeader ? JSON.parse(summaryHeader) : {
          publications: 0,
          projects: 0,
          lectures: 0,
          totalItems: 0
        };
        
        const dateRange = dateRangeHeader ? JSON.parse(dateRangeHeader) : {
          startDate: '',
          endDate: ''
        };

        // Extract Google Drive upload info
        const driveUpload: DriveUpload = {
          success: response.headers.get('x-drive-upload') === 'success',
          fileId: response.headers.get('x-drive-file-id') || undefined,
          viewLink: response.headers.get('x-drive-view-link') || undefined,
          downloadLink: response.headers.get('x-drive-download-link') || undefined,
          error: response.headers.get('x-drive-error') || undefined
        };

        setReportData({ summary, dateRange, driveUpload });
      } else {
        // Try to parse error response
        try {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to generate report');
        } catch {
          setError(`Server error: ${response.status} ${response.statusText}`);
        }
      }
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Network error occurred while generating report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Input Form */}

      {/* Date Range Selector */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
          Select Date Range for Report
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              disabled={loading}
            />
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={loading || !startDate || !endDate}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating Report...
            </>
          ) : (
            <>
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Generate PowerPoint Report
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700 font-medium">Report Generation Error</p>
          </div>
          <p className="text-red-600 mt-1.5 text-sm">{error}</p>
        </div>
      )}

      {/* Success Result */}
      {reportData && (
        <div className="mt-6 space-y-5">
          {/* Success Message */}
          <div className="p-5 bg-green-50 border border-green-200 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  Report Generated Successfully!
                </h3>
                <p className="text-sm text-green-600">
                  Your PowerPoint presentation has been downloaded to your device.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="text-2xl font-bold text-blue-600">{reportData.summary.publications}</div>
                <div className="text-sm text-gray-600">Publications</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="text-2xl font-bold text-green-600">{reportData.summary.projects}</div>
                <div className="text-sm text-gray-600">Projects</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="text-2xl font-bold text-purple-600">{reportData.summary.lectures}</div>
                <div className="text-sm text-gray-600">Lectures</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="text-2xl font-bold text-gray-800">{reportData.summary.totalItems}</div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <strong>Date Range:</strong> {reportData.dateRange.startDate} to {reportData.dateRange.endDate}
            </div>
          </div>

          {/* Google Drive Upload Status */}
          {reportData.driveUpload && (
            <div className={`p-5 border rounded-lg shadow-sm ${
              reportData.driveUpload.success 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  reportData.driveUpload.success 
                    ? 'bg-blue-500' 
                    : 'bg-yellow-500'
                }`}>
                  {reportData.driveUpload.success ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className={`font-semibold ${
                    reportData.driveUpload.success 
                      ? 'text-blue-800' 
                      : 'text-yellow-800'
                  }`}>
                    Google Drive Upload {reportData.driveUpload.success ? 'Successful' : 'Failed'}
                  </h4>
                  <p className={`text-sm ${
                    reportData.driveUpload.success 
                      ? 'text-blue-600' 
                      : 'text-yellow-600'
                  }`}>
                    {reportData.driveUpload.success 
                      ? 'File has been saved to Google Drive and is accessible via the links below.' 
                      : `Upload failed: ${reportData.driveUpload.error || 'Unknown error'}`
                    }
                  </p>
                </div>
              </div>
              
              {reportData.driveUpload.success && reportData.driveUpload.viewLink && (
                <div className="flex flex-wrap gap-3">
                  <a 
                    href={reportData.driveUpload.viewLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-sm transition-all duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View in Google Drive
                  </a>
                  {reportData.driveUpload.downloadLink && (
                    <a 
                      href={reportData.driveUpload.downloadLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-sm font-medium rounded-lg hover:from-gray-700 hover:to-gray-800 shadow-sm transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download from Drive
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

  
    </div>
  );
}