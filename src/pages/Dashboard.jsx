import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Heart, Mail, Globe, Send, Loader, History, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [healthStatus, setHealthStatus] = useState(null);
  const [emailScan, setEmailScan] = useState({ email: '', result: null, loading: false });
  const [urlScan, setUrlScan] = useState({ url: '', result: null, loading: false });
  const [scanLogs, setScanLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    fetchHealthStatus();
    fetchScanLogs();
  }, []);

  const fetchHealthStatus = async () => {
    try {
      const response = await api.get('/health');
      setHealthStatus(response.data);
    } catch (error) {
      setHealthStatus({ status: 'unhealthy', message: 'Unable to connect to server' });
    }
  };

  const fetchScanLogs = async () => {
    try {
      const response = await api.get('/api/scan/logs');
      // Extract items array from the response
      const data = response.data;
      const logs = Array.isArray(data.items) ? data.items : [];
      setScanLogs(logs);
    } catch (error) {
      setScanLogs([]); // Set to empty array on error
      toast.error('Failed to load scan logs');
    } finally {
      setLogsLoading(false);
    }
  };

  const handleEmailScan = async (e) => {
    e.preventDefault();
    if (!emailScan.email.trim()) return;

    setEmailScan(prev => ({ ...prev, loading: true, result: null }));

    try {
      const response = await api.post('/api/scan/email', { email: emailScan.email });
      setEmailScan(prev => ({ ...prev, result: response.data, loading: false }));
      toast.success('Email scan completed');
      fetchScanLogs(); // Refresh logs
    } catch (error) {
      setEmailScan(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUrlScan = async (e) => {
    e.preventDefault();
    if (!urlScan.url.trim()) return;

    setUrlScan(prev => ({ ...prev, loading: true, result: null }));

    try {
      const response = await api.post('/api/scan/url', { url: urlScan.url });
      setUrlScan(prev => ({ ...prev, result: response.data, loading: false }));
      toast.success('URL scan completed');
      fetchScanLogs(); // Refresh logs
    } catch (error) {
      setUrlScan(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8"
    >

      {/* Health Check */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${healthStatus?.status === 'healthy' ? 'bg-green-100' : 'bg-red-100'}`}>
            <Heart className={`w-8 h-8 ${healthStatus?.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">System Health</h3>
            <p className="text-gray-600">
              Status: {healthStatus?.status || 'Checking...'}
              {healthStatus?.message && ` - ${healthStatus.message}`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Email Scan */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <Mail className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Email Scanner</h3>
          </div>

          <form onSubmit={handleEmailScan} className="space-y-4">
            <input
              type="email"
              value={emailScan.email}
              onChange={(e) => setEmailScan(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              disabled={emailScan.loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {emailScan.loading ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span>{emailScan.loading ? 'Scanning...' : 'Scan Email'}</span>
            </button>
          </form>

          {emailScan.result && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">Scan Result:</h4>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(emailScan.result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* URL Scan */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">URL Scanner</h3>
          </div>

          <form onSubmit={handleUrlScan} className="space-y-4">
            <input
              type="url"
              value={urlScan.url}
              onChange={(e) => setUrlScan(prev => ({ ...prev, url: e.target.value }))}
              placeholder="Enter URL"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              disabled={urlScan.loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {urlScan.loading ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span>{urlScan.loading ? 'Scanning...' : 'Scan URL'}</span>
            </button>
          </form>

          {urlScan.result && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">Scan Result:</h4>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(urlScan.result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Scan Logs */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <History className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Scan History</h3>
        </div>

        {logsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : scanLogs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No scan logs found</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {scanLogs.map((log, index) => (
              <motion.div
                key={log.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {log.scan_type === 'email' ? (
                      <Mail className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Globe className="w-4 h-4 text-green-600" />
                    )}
                    <span className="font-medium text-gray-900 capitalize">{log.scan_type} Scan</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Target:</span> {log.input_value}
                </p>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Reachable:</span> {log.reachable ? 'Yes' : 'No'}
                </div>
                {log.result && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
                      View Full Result
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                      {JSON.stringify(log, null, 2)}
                    </pre>
                  </details>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;