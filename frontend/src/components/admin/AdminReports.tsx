'use client';

import { useState, useEffect } from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import adminService from '@/services/admin.service';
import toast from 'react-hot-toast';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await adminService.getReports();
      setReports(response.data);
    } catch (error) {
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (reportId: string, resolution: string) => {
    try {
      await adminService.resolveReport(reportId, resolution);
      toast.success('Report resolved successfully');
      fetchReports();
    } catch (error) {
      toast.error('Failed to resolve report');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="space-y-4">
        {reports.map((report: any) => (
          <div
            key={report.id}
            className="flex items-start space-x-4 border-b border-gray-700 pb-4"
          >
            <div className="bg-gray-700 p-2 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="flex-1">
              <p className="text-white">
                <span className="font-semibold">{report.reporterName}</span> reported{' '}
                {report.contentType.toLowerCase()}{' '}
                <span className="text-yellow-400">{report.contentId}</span>
              </p>
              <p className="text-gray-400 text-sm">{report.reason}</p>
              <p className="text-gray-500 text-xs">
                {new Date(report.createdAt).toLocaleString()}
              </p>
              {!report.resolved && (
                <button
                  onClick={() => {
                    const resolution = prompt('Enter resolution details:');
                    if (resolution) handleResolveReport(report.id, resolution);
                  }}
                  className="mt-2 flex items-center text-green-500 hover:text-green-400"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Resolve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}