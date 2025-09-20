import React, { useState, useMemo } from 'react';
import { BarChart, Filter, TrendingUp, AlertTriangle, CheckCircle, Users } from 'lucide-react';

const AdminDashboard = ({ scanHistory }) => {
  const [filter, setFilter] = useState('all');
  
  const filteredScans = useMemo(() => {
    if (filter === 'all') return scanHistory;
    return scanHistory.filter(scan => 
      filter === 'phishing' ? scan.isPhishing : !scan.isPhishing
    );
  }, [scanHistory, filter]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayScans = scanHistory.filter(scan => 
      new Date(scan.date).toDateString() === today
    );
    
    const totalPhishing = scanHistory.filter(scan => scan.isPhishing).length;
    const phishingRate = scanHistory.length > 0 ? 
      ((totalPhishing / scanHistory.length) * 100).toFixed(1) : '0';
    
    return {
      totalScans: scanHistory.length,
      todayScans: todayScans.length,
      phishingDetected: totalPhishing,
      phishingRate: phishingRate,
      uniqueUsers: new Set(scanHistory.map(scan => scan.user)).size
    };
  }, [scanHistory]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor system activity and scan results</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Scans</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalScans}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayScans}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Phishing Detected</p>
              <p className="text-2xl font-bold text-gray-900">{stats.phishingDetected}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-full">
              <BarChart className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Phishing Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.phishingRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.uniqueUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-xl font-bold text-gray-900">Scan History</h2>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Results</option>
              <option value="phishing">Phishing Only</option>
              <option value="legitimate">Legitimate Only</option>
            </select>
          </div>
        </div>

        {filteredScans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Content</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Result</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Confidence</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredScans.map((scan, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                          {scan.user.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{scan.user}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize">
                        {scan.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <p className="truncate text-gray-900" title={scan.content}>
                        {scan.content}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {scan.isPhishing ? (
                          <>
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="text-red-700 font-medium">Phishing</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-700 font-medium">Legitimate</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        scan.confidence >= 80 
                          ? 'bg-green-100 text-green-700'
                          : scan.confidence >= 60
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {scan.confidence}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      <div>
                        <p>{new Date(scan.date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(scan.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scan data</h3>
            <p className="text-gray-600">Start scanning to see results here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;