import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Play, TestTube, FileText, BarChart, CheckCircle, XCircle, Loader } from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-hot-toast';

const ModelsPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState(null);
  const [trainResponse, setTrainResponse] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [testText, setTestText] = useState('');
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictResponse, setPredictResponse] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.post('/upload-dataset', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadResponse(response.data);
      toast.success('Dataset uploaded successfully');
      setSelectedFile(null);
    } catch (error) {
      toast.error('Failed to upload dataset. The file format must be CSV and have two columns: text, label');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTrain = async () => {
    setIsTraining(true);
    setTrainingStatus('training');
    setMetrics(null);

    try {
      const response = await api.post('/train');
      setTrainResponse(response.data);
      setResponseData(response.data);
      setMetrics(response.data.metrics);
      setTrainingStatus('completed');
      toast.success('Model trained successfully');
    } catch (error) {
      setTrainingStatus('failed');
      toast.error('Training failed');
    } finally {
      setIsTraining(false);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!testText.trim()) return;

    setIsPredicting(true);
    setPrediction(null);

    try {
      const response = await api.post('/predict', { text: testText });
      setPredictResponse(response.data);
      setPrediction(response.data);
      toast.success('Prediction completed');
    } catch (error) {
      toast.error('Prediction failed');
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Machine Learning Models</h1>
        <h2 className="text-xl font-semibold text-gray-700">Random Forest Classifier Model</h2>
        <p className="text-gray-600">Upload dataset, train model, and test predictions</p>
      </div>

      <div className="grid md:grid-cols-1 gap-8">
        {/* Dataset Upload */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <Upload className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Upload Dataset</h3>
          </div>

          <form onSubmit={handleFileUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select CSV File (text, label columns Only)
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isUploading ? <Loader className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
              <span>{isUploading ? 'Uploading...' : 'Upload Dataset'}</span>
            </button>
          </form>

          {uploadResponse && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">Upload Response:</h4>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(uploadResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Train Model */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <Play className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">Train Model</h3>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleTrain}
              disabled={isTraining}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isTraining ? <Loader className="w-5 h-5 animate-spin" /> : <BarChart className="w-5 h-5" />}
              <span>{isTraining ? 'Training...' : 'Train Model'}</span>
            </button>

            {trainingStatus && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {trainingStatus === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : trainingStatus === 'failed' ? (
                    <XCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <Loader className="w-5 h-5 animate-spin text-blue-600" />
                  )}
                  <span className="font-medium capitalize">{trainingStatus}</span>
                </div>
                {metrics && (
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Dataset</p>
                        <p className="text-lg font-bold">{responseData?.dataset}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Training Samples</p>
                        <p className="text-lg font-bold">{responseData?.training_samples}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Test Samples</p>
                        <p className="text-lg font-bold">{responseData?.test_samples}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Message</p>
                        <p className="text-lg font-bold">{responseData?.message}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Precision</p>
                        <p className="text-lg font-bold">{metrics.precision?.toFixed(3)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Recall</p>
                        <p className="text-lg font-bold">{metrics.recall?.toFixed(3)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">F1-Score</p>
                        <p className="text-lg font-bold">{metrics.f1_score?.toFixed(3)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {trainResponse && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Train Response:</h4>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(trainResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Test Model */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <TestTube className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">Test Model</h3>
          </div>

          <form onSubmit={handlePredict} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter text to analyze
              </label>
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Enter suspicious text here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                rows={4}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isPredicting}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isPredicting ? <Loader className="w-5 h-5 animate-spin" /> : <TestTube className="w-5 h-5" />}
              <span>{isPredicting ? 'Analyzing...' : 'Analyze Text'}</span>
            </button>
          </form>

          {prediction && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Prediction Result:</h4>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Text:</p>
                  <p className="font-medium">{prediction.text}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {prediction.prediction === 'phishing' ? (
                    <XCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  <span className={`font-medium capitalize ${
                    prediction.prediction === 'phishing' ? 'text-red-700' : 'text-green-700'
                  }`}>
                    Prediction: {prediction.prediction}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confidence:</p>
                  <p className="font-medium">{(prediction.confidence * 100).toFixed(1)}%</p>
                </div>
                {prediction.probabilities && (
                  <div>
                    <p className="text-sm text-gray-600">Probabilities:</p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <span className="text-green-700">Legitimate: {(prediction.probabilities.legitimate * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-red-700">Phishing: {(prediction.probabilities.phishing * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {predictResponse && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">Predict Response:</h4>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(predictResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ModelsPage;