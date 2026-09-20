const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const roles = require('./data/roles.json');

function analyzeSkills(role, userSkills) {
  const requiredSkills = roles[role];
  if (!requiredSkills) return { error: "Role not found" };

  const verified = requiredSkills.filter(skill => userSkills.includes(skill));
  const missing = requiredSkills.filter(skill => !userSkills.includes(skill));
  const matchScore = Math.round((verified.length / requiredSkills.length) * 100);

  return { matchScore, verifiedSkills: verified, missingSkills: missing };
}
function isValidEvidenceUrl(url) {
  const pattern = /^(https?:\/\/)(www\.)?(github\.com|kaggle\.com|coursera\.org|udemy\.com)\/.+/i;
  return pattern.test(url);
}

app.get('/', (req, res) => {
  res.send('SkillProof-AI backend is running');
});

app.get('/api/roles', (req, res) => {
  res.json(roles);
});

app.post('/api/analyze', (req, res) => {
  const { role, userSkills, evidenceLinks } = req.body;

  if (!role || !userSkills) {
    return res.status(400).json({ error: "role and userSkills are required" });
  }

  const result = analyzeSkills(role, userSkills);

  const validatedLinks = (evidenceLinks || []).map(link => ({
    url: link,
    valid: isValidEvidenceUrl(link)
  }));

  res.json({ ...result, evidenceLinks: validatedLinks });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));