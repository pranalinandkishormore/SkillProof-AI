import React, { useState, useEffect } from 'react';

export default function StudentDashboard() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('Frontend Developer');
  const [userSkills, setUserSkills] = useState([]);
  const [projectUrl, setProjectUrl] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const availableSkills = [
    "HTML/CSS", "JavaScript", "React.js", "Git/GitHub", "REST APIs", 
    "Node.js", "Express.js", "SQL", "Python", "Data Visualization", "Excel", "Statistics"
  ];

  useEffect(() => {
    fetch('https://skillproof-ai-1.onrender.com/api/roles')
      .then(res => res.json())
      .then(data => setRoles(data))
      .catch(() => {
        setRoles([
          { roleTitle: "Frontend Developer" },
          { roleTitle: "Data Analyst" },
          { roleTitle: "Backend Developer" }
        ]);
      });
  }, []);

  const toggleSkill = (skill) => {
    setUserSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleReset = () => {
    setSelectedRole('Frontend Developer');
    setUserSkills([]);
    setProjectUrl('');
    setCertificateUrl('');
    setResult(null);
    setErrorMsg('');
  };

  const handleAnalyze = async () => {
    setErrorMsg('');
    
    // Validation check
    if (userSkills.length === 0) {
      setErrorMsg('Please select at least one skill before running the analysis.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://skillproof-ai-1.onrender.com/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: selectedRole,
          userSkills: userSkills,
          projects: [
            { type: 'GitHub', url: projectUrl },
            { type: 'Certificate', url: certificateUrl }
          ].filter(p => p.url.trim() !== '')
        })
      });

      if (!response.ok) {
        throw new Error('Backend returned an error');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Could not connect to Backend server. Ensure Member 3's backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', width: '90%', margin: '40px auto', padding: '30px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontFamily: 'Arial, sans-serif', color: '#1f2937' }}>
      
      <div style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#2563eb', margin: 0 }}>Student Readiness & Skill Gap Portal</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 0 0' }}>Select your target role, highlight your skills, and submit work proof to measure readiness.</p>
        </div>
        <button 
          onClick={handleReset}
          style={{ padding: '8px 16px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Reset Form
        </button>
      </div>

      {errorMsg && (
        <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>1. Select Target Job Role:</label>
        <select 
          value={selectedRole} 
          onChange={(e) => setSelectedRole(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        >
          {roles.map((r, idx) => (
            <option key={idx} value={r.roleTitle}>{r.roleTitle}</option>
          ))}
        </select>
      </div>

      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>2. Select Your Known Skills:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {availableSkills.map((skill) => {
            const isSelected = userSkills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '16px',
                  border: isSelected ? '1px solid #2563eb' : '1px solid #d1d5db',
                  background: isSelected ? '#2563eb' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#374151',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                {isSelected ? `✓ ${skill}` : `+ ${skill}`}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>3. Submit Evidence Links (GitHub / Certificates):</label>
        
        <input 
          type="url" 
          placeholder="GitHub Project Link (e.g., https://github.com/user/project)"
          value={projectUrl}
          onChange={(e) => setProjectUrl(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '10px' }}
        />

        <input 
          type="url" 
          placeholder="Certificate Link (e.g., https://coursera.org/verify/123)"
          value={certificateUrl}
          onChange={(e) => setCertificateUrl(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          background: loading ? '#9ca3af' : '#16a34a',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Analyzing Readiness...' : 'Analyze Readiness & Identify Gaps'}
      </button>

      {result && (
        <div style={{ border: '2px solid #2563eb', borderRadius: '8px', padding: '20px', background: '#eff6ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h2 style={{ margin: 0, color: '#1e3a8a' }}>{result.targetRole}</h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>Verified Projects Submitted: {result.verifiedProjectsCount}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: result.matchScore >= 70 ? '#16a34a' : '#d97706' }}>
                {result.matchScore}%
              </span>
              <p style={{ margin: 0, fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold' }}>Match Score</p>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '6px', padding: '12px', marginBottom: '12px', border: '1px solid #bfdbfe' }}>
            <h3 style={{ margin: '0 0 6px 0', color: '#dc2626', fontSize: '15px' }}>⚠️ Missing Skills (Skill Gaps):</h3>
            {result.missingSkills.length === 0 ? (
              <p style={{ color: '#16a34a', margin: 0, fontSize: '14px', fontWeight: 'bold' }}>You meet all skill requirements for this role!</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#991b1b', fontSize: '14px' }}>
                {result.missingSkills.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            )}
          </div>

          <div style={{ background: '#ffffff', borderRadius: '6px', padding: '12px', border: '1px solid #bfdbfe' }}>
            <h3 style={{ margin: '0 0 6px 0', color: '#1d4ed8', fontSize: '15px' }}>📚 Recommended Learning Paths:</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
              {result.recommendations.map((rec, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>
                  Learn <strong>{rec.skill}</strong>: {' '}
                  <a href={rec.resource} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: 'bold' }}>
                    View Free Resource ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}
