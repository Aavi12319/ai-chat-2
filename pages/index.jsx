import { useState } from 'react';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 5);
    setFiles(selectedFiles);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('prompt', prompt);

    const res = await fetch('/api/continue', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setResponse(data.completion || 'No response from AI.');
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>AI Conversation Continuation</h1>
      <input type="file" accept=".txt" multiple onChange={handleFileChange} />
      <textarea
        style={{ width: '100%', height: '100px', marginTop: '10px' }}
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: '10px' }}
      >
        {loading ? 'Loading...' : 'Continue Conversation'}
      </button>
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>{response}</pre>
    </div>
  );
}
