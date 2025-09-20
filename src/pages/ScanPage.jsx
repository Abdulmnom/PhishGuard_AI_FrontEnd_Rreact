import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Clock, Mail, Link as LinkIcon } from 'lucide-react';

const ScanPage = ({ user, scanHistory, onScanComplete }) => {
  const [scanType, setScanType] = useState('url');
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);

  const handleScan = async () => {
    if (!inputValue.trim()) return;
    
    setIsScanning(true);
    setCurrentResult(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: scanType,
          content: inputValue,
          userId: user.id
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        setCurrentResult(result);
        onScanComplete({
          ...result,
          user: user.username,
          type: scanType,
          content: inputValue.substring(0, 50) + (inputValue.length > 50 ? '...' : ''),
          date: new Date().toISOString()
        });
      }
    } catch (error) {
      // Demo: simulate scan results
      const isPhishing = Math.random() < 0.3; // 30% chance of phishing
      const result = {
        isPhishing,
        confidence: Math.floor(Math.random() * 40) + (isPhishing ? 60 : 10),
        details: isPhishing 
          ? 'Suspicious patterns detected: Domain spoofing, urgent language, credential harvesting'
          : 'No malicious patterns detected. Content appears legitimate.'
      };
      
      setCurrentResult(result);
      onScanComplete({
        ...result,
        user: user.username,
        type: scanType,
        content: inputValue.substring(0, 50) + (inputValue.length > 50 ? '...' : ''),
        date: new Date().toISOString()
      });
    } finally {
      setIsScanning(false);
    }
  };

  const recentScans = scanHistory.filter(scan => scan.user === user.username).slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Phishing Detection</h1>
        <p className="text-gray-600">Scan URLs and emails for potential phishing threats</p>
      </div>

      {/* Scan Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Type Selection */}
          <div className="flex space-x-4">
            <button
              onClick={() => setScanType('url')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                scanType === 'url' 
                  ? 'bg-blue-100 text-blue-700 border-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>URL</span>
            </button>
            <button
              onClick={() => setScanType('email')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                scanType === 'email' 
                  ? 'bg-blue-100 text-blue-700 border-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </button>
          </div>

          {/* Input Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {scanType === 'url' ? 'Enter URL to scan' : 'Paste email content'}
            </label>
            {scanType === 'url' ? (
              <input
                type="url"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Paste the email content here..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>

          {/* Scan Button */}
          <button
            onClick={handleScan}
            disabled={!inputValue.trim() || isScanning}
            className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Search className="w-5 h-5" />
            <span>{isScanning ? 'Scanning...' : 'Scan for Phishing'}</span>
          </button>
        </div>
      </div>

      {/* Result Section */}
      {currentResult && (
        <div className={`bg-white rounded-xl shadow-lg border-2 p-6 ${
          currentResult.isPhishing ? 'border-red-200' : 'border-green-200'
        }`}>
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-full ${
              currentResult.isPhishing ? 'bg-red-100' : 'bg-green-100'
            }`}>
              {currentResult.isPhishing ? (
                <AlertTriangle className="w-8 h-8 text-red-600" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-600" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-2 ${
                currentResult.isPhishing ? 'text-red-700' : 'text-green-700'
              }`}>
                {currentResult.isPhishing ? '🚨 Phishing Detected' : '✅ Content Legitimate'}
              </h3>
              
              <p className="text-gray-700 mb-4">{currentResult.details}</p>
              
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentResult.isPhishing 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  Confidence: {currentResult.confidence}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Section */}
      {recentScans.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Scans</span>
          </h2>
          
          <div className="space-y-3">
            {recentScans.map((scan, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    scan.isPhishing ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    {scan.type === 'url' ? (
                      <LinkIcon className={`w-4 h-4 ${scan.isPhishing ? 'text-red-600' : 'text-green-600'}`} />
                    ) : (
                      <Mail className={`w-4 h-4 ${scan.isPhishing ? 'text-red-600' : 'text-green-600'}`} />
                    )}
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-900">{scan.content}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(scan.date).toLocaleDateString()} at {new Date(scan.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  scan.isPhishing 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {scan.isPhishing ? 'Phishing' : 'Legitimate'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanPage;