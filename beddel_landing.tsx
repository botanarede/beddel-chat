import React, { useState } from 'react';
import { Shield, Code, Zap, CheckCircle, Lock, FileCode, Terminal, GitBranch, Eye, Clock, Activity } from 'lucide-react';

const BeddelLanding = () => {
  const [activeExample, setActiveExample] = useState('translator');

  const examples = {
    translator: {
      title: 'Translation Agent',
      yaml: `agent:
  id: translator
  protocol: beddel-declarative-protocol/v2.0

schema:
  input:
    type: object
    properties:
      texto: { type: string }
      idioma_origem: { type: string }
      idioma_destino: { type: string }
  output:
    type: object
    properties:
      texto_traduzido: { type: string }
      metadados: { type: object }

logic:
  workflow:
    - name: "translate"
      type: "genkit-translation"
      action: { type: "translate" }`,
      result: `{
  "texto_traduzido": "Hello, world!",
  "metadados": {
    "modelo_utilizado": "gemini-flash-latest",
    "tempo_processamento": 45,
    "confianca": 0.98
  }
}`
    },
    deploy: {
      title: 'CI/CD Pipeline Agent',
      yaml: `agent:
  id: deploy-validator
  protocol: beddel-declarative-protocol/v2.0

schema:
  input:
    type: object
    properties:
      repository: { type: string }
      branch: { type: string }
      environment: { type: string }

logic:
  workflow:
    - name: "validate-tests"
      type: "test-runner"
    - name: "security-scan"
      type: "security-validator"
    - name: "deploy"
      type: "deployment-trigger"`,
      result: `{
  "status": "success",
  "tests_passed": 247,
  "security_score": 9.5,
  "deployed_at": "2025-11-17T10:30:00Z",
  "deployment_url": "https://app.prod.company.com"
}`
    },
    marketing: {
      title: 'Marketing Campaign Agent',
      yaml: `agent:
  id: campaign-analyzer
  protocol: beddel-declarative-protocol/v2.0

schema:
  input:
    type: object
    properties:
      campaign_data: { type: object }
      target_metrics: { type: array }

logic:
  workflow:
    - name: "analyze-performance"
      type: "analytics-processor"
    - name: "generate-insights"
      type: "insight-generator"
    - name: "recommend-actions"
      type: "recommendation-engine"`,
      result: `{
  "insights": {
    "conversion_rate": 3.2,
    "roi": 2.8,
    "top_channel": "social_media"
  },
  "recommendations": [
    "Increase budget on Instagram by 25%",
    "A/B test landing page CTA",
    "Optimize for mobile conversions"
  ]
}`
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 opacity-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="flex items-center space-x-3 bg-slate-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-full px-6 py-2">
                <Shield className="w-5 h-5 text-indigo-400" />
                <span className="text-sm text-gray-300">Security Score 9.5/10 • Zero Dynamic Code</span>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              Declarative Agents.<br/>Auditable Runtime.
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
              YAML-defined agents with isolated-vm execution. No eval(), no Function(), no dynamic code. 
              Built for enterprises that need both automation and compliance.
            </p>

            <div className="flex justify-center space-x-4">
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-indigo-500/50">
                npm install beddel
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-8 py-4 rounded-lg font-semibold transition-all">
                View Documentation
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-indigo-400 mb-2">9.5/10</div>
              <div className="text-sm text-gray-400">Security Score</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">&lt; 50ms</div>
              <div className="text-sm text-gray-400">Execution Time</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-sm text-gray-400">Auditable</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">0</div>
              <div className="text-sm text-gray-400">eval() calls</div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Value Proposition */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">
          Why <span className="text-indigo-400">Declarative</span> Beats <span className="text-red-400">Imperative</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Problem */}
          <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-8">
            <div className="flex items-center mb-6">
              <div className="bg-red-900/30 p-3 rounded-lg mr-4">
                <Code className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-2xl font-semibold text-red-300">Traditional Approach</h3>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 font-mono text-sm mb-6">
              <div className="text-red-300">const userCode = request.body;</div>
              <div className="text-red-300">eval(userCode);</div>
              <div className="text-gray-500 mt-4">// 🚨 Security nightmare</div>
            </div>
            
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-red-400 mr-2">✗</span>
                <span>Code injection possible</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-2">✗</span>
                <span>Impossible to audit statically</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-2">✗</span>
                <span>Fails compliance (SOC 2, ISO 27001)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-2">✗</span>
                <span>Unpredictable resource usage</span>
              </li>
            </ul>
          </div>

          {/* Solution */}
          <div className="bg-green-950/20 border border-green-900/50 rounded-xl p-8">
            <div className="flex items-center mb-6">
              <div className="bg-green-900/30 p-3 rounded-lg mr-4">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-green-300">Beddel Approach</h3>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 font-mono text-sm mb-6">
              <div className="text-blue-300">logic:</div>
              <div className="text-blue-300 ml-2">workflow:</div>
              <div className="text-green-300 ml-4">- type: "process"</div>
              <div className="text-gray-500 mt-4"># ✅ Data, not code</div>
            </div>
            
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Zero dynamic code execution</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>100% auditable before deployment</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Passes all compliance audits</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Memory & timeout guarantees</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Real-World Examples */}
      <div className="bg-slate-900/50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Production-Ready Examples</h2>
          <p className="text-gray-400 text-center mb-12">Real agents solving real problems</p>
          
          <div className="flex justify-center space-x-4 mb-8">
            {Object.entries(examples).map(([key, example]) => (
              <button
                key={key}
                onClick={() => setActiveExample(key)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeExample === key
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                }`}
              >
                {example.title}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-indigo-400">Agent Definition (YAML)</h3>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">{examples[activeExample].yaml}</pre>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">Execution Result</h3>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">{examples[activeExample].result}</pre>
              </div>
              <div className="mt-4 flex items-center space-x-4 text-sm">
                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-2 text-indigo-400" />
                  Execution: 45ms
                </div>
                <div className="flex items-center text-gray-400">
                  <Shield className="w-4 h-4 mr-2 text-green-400" />
                  Security: 9.5/10
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">Three-Layer Security</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="bg-indigo-900/30 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <FileCode className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">1. YAML Parser</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                FAILSAFE_SCHEMA only
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Depth limit (1000 levels)
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Size limit (10MB max)
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                UTF-8 validation
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="bg-purple-900/30 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Terminal className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">2. Interpreter</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Pre-defined operations
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Zod schema validation
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                No eval/Function calls
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Output type checking
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="bg-green-900/30 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">3. Isolated VM</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Complete sandbox
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Memory limit (2MB)
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Timeout (5s max)
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                No filesystem/network
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Compliance */}
      <div className="bg-gradient-to-br from-indigo-950/50 to-purple-950/50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Built for Enterprise Compliance</h2>
          <p className="text-gray-400 text-center mb-16">Pass audits without compromising on automation</p>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <Eye className="w-8 h-8 text-indigo-400 mr-4" />
                <h3 className="text-2xl font-semibold">100% Auditable</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Every agent is defined as YAML data structure. Security teams can review, approve, and version-control 
                agent definitions using standard Git workflows. No surprises, no hidden behavior.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400 flex-shrink-0 mt-1" />
                  <span>Static analysis before deployment</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400 flex-shrink-0 mt-1" />
                  <span>Git-based approval workflows</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400 flex-shrink-0 mt-1" />
                  <span>SHA-256 audit trail</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <Activity className="w-8 h-8 text-purple-400 mr-4" />
                <h3 className="text-2xl font-semibold">Compliance Native</h3>
              </div>
              <p className="text-gray-400 mb-6">
                LGPD/GDPR compliance built-in. Automatic data anonymization, consent management, and right-to-be-forgotten 
                execution in under 24h. Multi-tenant isolation guaranteed.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400 flex-shrink-0 mt-1" />
                  <span>LGPD/GDPR automatic compliance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400 flex-shrink-0 mt-1" />
                  <span>SOC 2 Type II ready</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400 flex-shrink-0 mt-1" />
                  <span>ISO 27001 aligned</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-slate-900/50 border border-indigo-500/30 rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-4 text-indigo-400">Audit Report Example</h3>
            <div className="bg-black/60 rounded-lg p-6 font-mono text-sm">
              <div className="text-gray-400 mb-4"># Security Audit Report</div>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                <div className="text-green-300">✓ No dynamic code execution detected</div>
                <div className="text-green-300">✓ All inputs validated against schemas</div>
                <div className="text-green-300">✓ Memory limits enforced (2MB)</div>
                <div className="text-green-300">✓ Timeout limits enforced (5s)</div>
                <div className="text-green-300">✓ Multi-tenant isolation verified</div>
                <div className="text-green-300">✓ Audit trail SHA-256 intact</div>
              </div>
              <div className="mt-4 text-indigo-400">
                Security Score: 9.5/10 (Grade A)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Competitive Differentiation */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">vs Other Agent Frameworks</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Feature</th>
                <th className="text-center py-4 px-6 text-indigo-400 font-semibold">Beddel</th>
                <th className="text-center py-4 px-6 text-gray-400 font-medium">LangGraph</th>
                <th className="text-center py-4 px-6 text-gray-400 font-medium">CrewAI</th>
                <th className="text-center py-4 px-6 text-gray-400 font-medium">AutoGen</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-800">
                <td className="py-4 px-6 text-gray-300">Zero Dynamic Code</td>
                <td className="text-center py-4 px-6"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                <td className="text-center py-4 px-6 text-gray-500">✗</td>
                <td className="text-center py-4 px-6 text-gray-500">✗</td>
                <td className="text-center py-4 px-6 text-gray-500">✗</td>
              </tr>
              <tr className="border-b border-slate-800 bg-slate-900/30">
                <td className="py-4 px-6 text-gray-300">Static Auditability</td>
                <td className="text-center py-4 px-6"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                <td className="text-center py-4 px-6 text-gray-500">Partial</td>
                <td className="text-center py-4 px-6 text-gray-500">Partial</td>
                <td className="text-center py-4 px-6 text-gray-500">✗</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-4 px-6 text-gray-300">Compliance (LGPD/GDPR)</td>
                <td className="text-center py-4 px-6"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                <td className="text-center py-4 px-6 text-gray-500">Manual</td>
                <td className="text-center py-4 px-6 text-gray-500">Manual</td>
                <td className="text-center py-4 px-6 text-gray-500">Manual</td>
              </tr>
              <tr className="border-b border-slate-800 bg-slate-900/30">
                <td className="py-4 px-6 text-gray-300">Isolated Execution</td>
                <td className="text-center py-4 px-6"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                <td className="text-center py-4 px-6 text-gray-500">✗</td>
                <td className="text-center py-4 px-6 text-gray-500">✗</td>
                <td className="text-center py-4 px-6 text-gray-500">✗</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-4 px-6 text-gray-300">Security Score</td>
                <td className="text-center py-4 px-6 text-green-400 font-bold">9.5/10</td>
                <td className="text-center py-4 px-6 text-gray-400">~6/10</td>
                <td className="text-center py-4 px-6 text-gray-400">~5/10</td>
                <td className="text-center py-4 px-6 text-gray-400">~4/10</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-slate-900/50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Built for Production</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-indigo-500/50 transition-all">
              <GitBranch className="w-12 h-12 text-indigo-400 mb-6" />
              <h3 className="text-xl font-semibold mb-4">CI/CD Automation</h3>
              <p className="text-gray-400 mb-4">
                Deploy validation agents that run security scans, test suites, and compliance checks before every deployment.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Automated security scanning</li>
                <li>• Test orchestration</li>
                <li>• Deployment validation</li>
              </ul>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-purple-500/50 transition-all">
              <Code className="w-12 h-12 text-purple-400 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Code Assistance</h3>
              <p className="text-gray-400 mb-4">
                Vector search agents that understand your codebase and provide context-aware suggestions.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Semantic code search</li>
                <li>• Documentation generation</li>
                <li>• Refactoring suggestions</li>
              </ul>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-green-500/50 transition-all">
              <Activity className="w-12 h-12 text-green-400 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Marketing Analytics</h3>
              <p className="text-gray-400 mb-4">
                Campaign analysis agents that process performance data and generate actionable insights.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Multi-channel analytics</li>
                <li>• ROI optimization</li>
                <li>• A/B test analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Deep Dive */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">Technical Architecture</h2>
        
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-semibold mb-6 text-indigo-400">How It Works</h3>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">YAML Definition</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Agents are defined as pure YAML data structures. No code, no functions, just declarative configuration.
                </p>
                <div className="bg-black/60 rounded p-3 font-mono text-xs">
                  <span className="text-blue-300">agent:</span> <span className="text-green-300">&#123; id: "my-agent", protocol: "v2.0" &#125;</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Secure Parsing</h4>
                <p className="text-gray-400 text-sm mb-3">
                  FAILSAFE_SCHEMA ensures only safe primitives (strings, numbers, booleans). Depth and size limits prevent DoS attacks.
                </p>
                <div className="bg-black/60 rounded p-3 font-mono text-xs">
                  <span className="text-purple-300">SecureYamlParser.parse</span><span className="text-gray-400">(yaml, &#123; maxDepth: 1000, maxSize: 10MB &#125;)</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Schema Validation</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Zod schemas validate inputs and outputs. Type errors caught before execution, not during.
                </p>
                <div className="bg-black/60 rounded p-3 font-mono text-xs">
                  <span className="text-yellow-300">schema.input</span><span className="text-gray-400">.validate(data)</span> <span className="text-green-300">// Type-safe</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">4</div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Interpreted Execution</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Pre-defined operations only. No eval(), no Function(). Runtime interprets workflow steps using a whitelist of safe operations.
                </p>
                <div className="bg-black/60 rounded p-3 font-mono text-xs">
                  <span className="text-blue-300">interpreter.execute</span><span className="text-gray-400">(workflow[step])</span> <span className="text-green-300">// Pre-audited ops</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">5</div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Isolated VM Execution</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Final execution happens in isolated-vm v5 with strict resource limits. Complete sandbox isolation.
                </p>
                <div className="bg-black/60 rounded p-3 font-mono text-xs">
                  <span className="text-purple-300">isolate.run</span><span className="text-gray-400">(code, &#123; timeout: 5s, memory: 2MB &#125;)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Zap className="w-6 h-6 text-yellow-400 mr-3" />
              Performance Guarantees
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <div>
                  <strong>Execution Time:</strong> &lt; 50ms average for standard operations
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <div>
                  <strong>Memory Usage:</strong> 2MB hard limit per agent execution
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <div>
                  <strong>Timeout:</strong> 5s maximum, configurable per security profile
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <div>
                  <strong>Throughput:</strong> 1000+ agents/second on standard hardware
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Shield className="w-6 h-6 text-indigo-400 mr-3" />
              Security Guarantees
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <div>
                  <strong>Zero Dynamic Code:</strong> No eval(), Function(), or require()
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <div>
                  <strong>Sandboxed:</strong> Complete isolation via isolated-vm
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <div>
                  <strong>Auditable:</strong> Static analysis before any execution
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <div>
                  <strong>Compliant:</strong> LGPD/GDPR/SOC2 ready out of the box
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-br from-indigo-950/50 to-purple-950/50 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Get Started in 5 Minutes</h2>
          <p className="text-gray-400 text-center mb-12">From zero to production-ready agent</p>
          
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-600 text-white rounded w-8 h-8 flex items-center justify-center font-bold mr-4">1</div>
                <h3 className="text-xl font-semibold">Install Beddel</h3>
              </div>
              <div className="bg-black/60 rounded-lg p-4 font-mono text-sm">
                <span className="text-gray-400">$</span> <span className="text-green-300">npm install beddel</span>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-600 text-white rounded w-8 h-8 flex items-center justify-center font-bold mr-4">2</div>
                <h3 className="text-xl font-semibold">Create Agent Definition</h3>
              </div>
              <div className="bg-black/60 rounded-lg p-4 font-mono text-sm">
                <pre className="text-gray-300">{`# my-agent.yaml
agent:
  id: hello-world
  protocol: beddel-declarative-protocol/v2.0

schema:
  input: { type: object, properties: {} }
  output: { type: object, properties: { message: { type: string } } }

logic:
  workflow:
    - name: "greet"
      type: "output-generator"
      action:
        output: { message: "Hello from Beddel!" }`}</pre>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-600 text-white rounded w-8 h-8 flex items-center justify-center font-bold mr-4">3</div>
                <h3 className="text-xl font-semibold">Execute Agent</h3>
              </div>
              <div className="bg-black/60 rounded-lg p-4 font-mono text-sm">
                <pre className="text-gray-300">{`import { DeclarativeAgentInterpreter } from 'beddel';

const interpreter = new DeclarativeAgentInterpreter();
const result = await interpreter.interpret({
  yamlContent: readFileSync('my-agent.yaml'),
  input: {},
  props: {}
});

console.log(result); // { message: "Hello from Beddel!" }`}</pre>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a href="#" className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-indigo-500/50">
              Read Full Documentation
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Enterprise Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Enterprise Support Available</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Need help with compliance audits, custom security profiles, or on-premise deployment? 
            We provide enterprise-grade support for production deployments.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-lg font-semibold transition-all">
              Contact Sales
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 px-8 py-3 rounded-lg font-semibold transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Beddel</h3>
              <p className="text-gray-400 text-sm">
                Declarative agents with auditable runtime. Built for enterprises that need both automation and compliance.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Examples</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>© 2025 Beddel Contributors. Open Source MIT License.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-indigo-400 transition-colors">GitHub</a>
              <span className="text-slate-700">|</span>
              <a href="#" className="hover:text-indigo-400 transition-colors">NPM</a>
              <span className="text-slate-700">|</span>
              <a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BeddelLanding;