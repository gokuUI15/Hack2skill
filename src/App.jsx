import React, { useState } from 'react'
import './App.css'

// AI Career Advisor - Single-file React prototype
// Tailwind CSS utility classes assumed available.
// Uses simple mock functions to simulate backend/LLM responses.

export default function AICareerAdvisor() {
  const [step, setStep] = useState('onboard')
  const [name, setName] = useState('')
  const [skills, setSkills] = useState(['Python', 'Data Structures'])
  const [interests, setInterests] = useState(['AI', 'Web Dev'])
  const [experience, setExperience] = useState('Student')
  const [suggestions, setSuggestions] = useState([])
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [loading, setLoading] = useState(false)

  // Mock LLM-backend: returns career suggestions based on skills & interests
  async function generateSuggestions() {
    setLoading(true)
    // Simulate API call latency
    await new Promise((r) => setTimeout(r, 800))

    // Simple rule-based mock suggestions (replace with real LLM call)
    const all = [
      {
        id: 'ml-eng',
        title: 'Machine Learning Engineer',
        summary:
          'Build and productionize ML models. Requires Python, ML frameworks, data pipelines.',
        skillsNeeded: ['Python', 'Pandas', 'TensorFlow / PyTorch', 'SQL'],
        timeline: '6-12 months',
        roadmap: [
          'Complete ML fundamentals course',
          'Build 3 mini projects (classification, regression, NLP)',
          'Deploy one model as an API',
        ],
      },
      {
        id: 'data-eng',
        title: 'Data Engineer',
        summary:
          'Design data pipelines, ETL, and scalable storage. Strong engineering and SQL skills.',
        skillsNeeded: ['SQL', 'Python / Scala', 'ETL', 'Cloud (GCP/AWS)'],
        timeline: '4-8 months',
        roadmap: [
          'Learn SQL deeply',
          'Work with Airflow or dbt',
          'Build a data pipeline on a cloud provider',
        ],
      },
      {
        id: 'frontend-dev',
        title: 'Frontend Developer',
        summary:
          'Create user-facing web apps. Requires JS, frameworks, UX thinking.',
        skillsNeeded: ['JavaScript', 'React', 'HTML/CSS', 'Testing'],
        timeline: '3-6 months',
        roadmap: [
          'Master JS fundamentals',
          'Build 5 interactive React projects',
          'Learn testing and performance optimization',
        ],
      },
      {
        id: 'product-manager',
        title: 'Product Manager (AI products)',
        summary:
          'Define product vision and work with engineers. Needs domain knowledge, communication.',
        skillsNeeded: ['Communication', 'Data literacy', 'Prioritization', 'Roadmapping'],
        timeline: '6-9 months',
        roadmap: [
          'Learn basics of product management',
          'Take a course on AI product design',
          'Manage a small team project',
        ],
      },
    ]

    // Very simple matching score based on overlapping skills / interests
    const scored = all
      .map((c) => {
        const skillOverlap = c.skillsNeeded.filter((s) =>
          skills.map((x) => x.toLowerCase()).includes(s.split(' ')[0].toLowerCase())
        ).length
        const interestBoost = interests.length
        const score = skillOverlap * 2 + interestBoost
        return { ...c, score }
      })
      .sort((a, b) => b.score - a.score)

    setSuggestions(scored)
    setLoading(false)
    setStep('results')
  }

  function addSkill(skill) {
    if (!skill) return
    if (skills.includes(skill)) return
    setSkills((s) => [...s, skill])
  }

  function removeSkill(skill) {
    setSkills((s) => s.filter((x) => x !== skill))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-start justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">AI Career Advisor — Prototype</h1>
          <div className="text-sm text-gray-600">Hello, Learner</div>
        </header>

        {/* Onboarding / Input */}
        {step === 'onboard' && (
          <section className="mt-6">
            <h2 className="text-lg font-medium">Tell us about yourself</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Experience Level</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                >
                  <option>Student</option>
                  <option>Intern</option>
                  <option>1-2 yrs</option>
                  <option>3+ yrs</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Key Skills (add + enter)</label>
                <SkillInput skills={skills} setSkills={setSkills} addSkill={addSkill} removeSkill={removeSkill} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Interests (comma separated)</label>
                <input
                  value={interests.join(', ')}
                  onChange={(e) => setInterests(e.target.value.split(',').map((s) => s.trim()))}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="e.g. AI, Web Dev, Product"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => generateSuggestions()}
                className="px-4 py-2 bg-indigo-600 text-white rounded shadow"
              >
                {loading ? 'Generating...' : 'Get Career Matches'}
              </button>

              <button
                onClick={() => {
                  // quick example preset
                  setName('Gourav');
                  setSkills(['Python', 'Data Structures', 'SQL']);
                  setInterests(['AI', 'Data']);
                }}
                className="px-4 py-2 border rounded"
              >
                Use Example Profile
              </button>
            </div>
          </section>
        )}

        {/* Results */}
        {step === 'results' && (
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Career suggestions for {name || 'you'}</h2>
              <div className="text-sm text-gray-500">Based on skills: {skills.join(', ')}</div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((s) => (
                <CareerCard
                  key={s.id}
                  career={s}
                  onSelect={() => setSelectedCareer(s)}
                />
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setStep('onboard')} className="px-4 py-2 border rounded">
                Edit profile
              </button>

              <button
                onClick={() => {
                  if (!selectedCareer && suggestions.length) setSelectedCareer(suggestions[0])
                }}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                View Roadmap
              </button>
            </div>
          </section>
        )}

        {/* Career Detail / Roadmap */}
        {selectedCareer && (
          <section className="mt-6 border-t pt-6">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{selectedCareer.title}</h3>
                <p className="mt-2 text-gray-700">{selectedCareer.summary}</p>

                <div className="mt-4">
                  <h4 className="font-medium">Skills needed</h4>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {selectedCareer.skillsNeeded.map((s) => (
                      <li key={s} className="px-2 py-1 border rounded text-sm">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium">Suggested roadmap ({selectedCareer.timeline})</h4>
                  <ol className="mt-2 list-decimal ml-5">
                    {selectedCareer.roadmap.map((r) => (
                      <li key={r} className="mt-1">{r}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="w-64">
                <div className="p-4 bg-gray-50 rounded">
                  <h5 className="font-medium">Actionable next steps</h5>
                  <ol className="mt-2 list-decimal ml-5 text-sm">
                    <li>Enroll in 1 relevant course</li>
                    <li>Build 2 portfolio projects</li>
                    <li>Publish a GitHub README + demo</li>
                  </ol>

                  <div className="mt-4">
                    <button
                      onClick={() => alert('Resume helper is a mock in this prototype')}
                      className="w-full px-3 py-2 bg-indigo-600 text-white rounded"
                    >
                      Open Resume Helper
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <footer className="mt-6 text-xs text-gray-500">We hope this is halpfull for you.</footer>
      </div>
    </div>
  )
}

// Small helper components
function SkillInput({ skills, setSkills, addSkill, removeSkill }) {
  const [input, setInput] = useState('')
  return (
    <div>
      <div className="flex gap-2 flex-wrap">
        {skills.map((s) => (
          <span key={s} className="px-2 py-1 bg-gray-100 rounded flex items-center gap-2">
            <span className="text-sm">{s}</span>
            <button
              onClick={() => removeSkill(s)}
              className="text-xs text-red-500 px-1"
              aria-label={`remove ${s}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const v = input.trim()
            if (v) addSkill(v)
            setInput('')
          }
        }}
        className="mt-2 w-full border rounded px-3 py-2"
        placeholder="Type a skill and press Enter (e.g. React)"
      />
    </div>
  )
}

function CareerCard({ career, onSelect }) {
  return (
    <div className="p-4 border rounded hover:shadow cursor-pointer" onClick={onSelect}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{career.title}</h4>
        <div className="text-sm text-gray-500">Score: {career.score}</div>
      </div>
      <p className="mt-2 text-sm text-gray-600">{career.summary}</p>
      <div className="mt-3 text-xs text-gray-500">Timeline: {career.timeline}</div>
    </div>
  )
}
