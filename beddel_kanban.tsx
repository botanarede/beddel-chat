import React, { useState } from 'react';
import { ChevronRight, CheckCircle, Circle, AlertCircle } from 'lucide-react';

const KanbanBoard = () => {
  const [items, setItems] = useState([
    // DONE - Epic 1: Core Engine
    { id: 1, title: 'Secure YAML Parser (Story 1.1)', description: 'FAILSAFE_SCHEMA, depth/size limits, UTF-8 validation', status: 'done', epic: 'Epic 1: Core Engine', priority: 'high', details: ['✅ SecureYamlParser implementado', '✅ Security Scanner com grades A-F', '✅ Benchmarks < 100ms', '✅ Testes completos'] },
    { id: 2, title: 'Isolated Runtime (Story 1.2)', description: 'isolated-vm v5, security profiles, multi-tenant', status: 'done', epic: 'Epic 1: Core Engine', priority: 'high', details: ['✅ IsolatedRuntimeManager', '✅ Memory pooling', '✅ Audit SHA-256', '✅ Performance < 50ms'] },
    { id: 3, title: 'Firebase Multi-Tenant (Story 1.3)', description: 'Firebase Admin v12.7, LGPD/GDPR compliance', status: 'done', epic: 'Epic 1: Core Engine', priority: 'high', details: ['✅ MultiTenantFirebaseManager', '✅ LGPD/GDPR engines', '✅ Security 9.5/10', '✅ Tenant isolation'] },
    
    // DONE - Epic 2: Agents
    { id: 4, title: 'Joker Agent (Story 2.1)', description: 'Agente de piadas com Gemini Flash', status: 'done', epic: 'Epic 2: Declarative Agents', priority: 'medium', details: ['✅ joker-agent.yaml', '✅ DeclarativeAgentInterpreter', '✅ AgentRegistry', '✅ GraphQL integration'] },
    { id: 5, title: 'Translator Agent', description: 'Tradução via Gemini Flash', status: 'done', epic: 'Epic 2: Declarative Agents', priority: 'medium', details: ['✅ translator-agent.yaml', '✅ Validação de idiomas', '✅ Metadados completos'] },
    { id: 6, title: 'Image Generator Agent', description: 'Geração de imagens com estilos', status: 'done', epic: 'Epic 2: Declarative Agents', priority: 'medium', details: ['✅ image-agent.yaml', '✅ 3 estilos (watercolor, neon, sketch)', '✅ Resolução configurável'] },
    
    // DOING - Implementações parciais
    { id: 7, title: 'Schema Validation Auto', description: 'Compilação de schemas YAML → Zod', status: 'doing', epic: 'Epic 1: Core Engine', priority: 'high', details: ['✅ DeclarativeSchemaCompiler', '⏳ Validação de arrays complexos', '⏳ additionalProperties handling'] },
    { id: 8, title: 'Server API (GraphQL)', description: 'API GraphQL para execução de agentes', status: 'doing', epic: 'Epic 3: API & Server', priority: 'high', details: ['✅ /api/graphql endpoint', '✅ executeMethod mutation', '⏳ Autenticação completa', '⏳ Rate limiting por tenant'] },
    
    // TODO - Funcionalidades da documentação não implementadas
    { id: 9, title: 'Advanced Declarative Language', description: 'map-filter-reduce, state machines, rule engines', status: 'todo', epic: 'Epic 1: Core Engine', priority: 'medium', details: ['❌ Pipelines funcionais', '❌ State machines', '❌ Temporal conditions', '❌ Loop declarativo'] },
    { id: 10, title: 'Behavior Marketplace', description: 'Registry extensível de behaviors', status: 'todo', epic: 'Epic 4: Marketplace', priority: 'low', details: ['❌ Versioning de behaviors', '❌ Capabilities/restrictions', '❌ Monetização', '❌ Discovery API'] },
    { id: 11, title: 'External API Integrations', description: 'Integrações declarativas via YAML', status: 'todo', epic: 'Epic 1: Core Engine', priority: 'medium', details: ['❌ behaviors block', '❌ integrations pipelines', '❌ decisions automáticas'] },
    { id: 12, title: 'Streaming & Performance', description: 'Execução paralela e streaming', status: 'todo', epic: 'Epic 5: Performance', priority: 'low', details: ['❌ Parallel execution', '❌ Resource policies', '❌ Retry semantics', '❌ Auto-generated docs'] },
    { id: 13, title: 'Compliance Automation', description: 'Flows automáticos de compliance', status: 'todo', epic: 'Epic 2: Data Protection', priority: 'medium', details: ['❌ Pre-built business behaviors', '❌ Firebase deployment recipes', '❌ Global consent orchestration'] },
    { id: 14, title: 'Admin Dashboard', description: 'Interface web de administração', status: 'todo', epic: 'Epic 3: API & Server', priority: 'high', details: ['⏳ /admin/endpoints (parcial)', '❌ Security dashboard UI', '❌ Tenant management', '❌ Analytics'] },
    { id: 15, title: 'Protocol Extensions', description: 'Extensibilidade do protocolo v2.0', status: 'todo', epic: 'Epic 4: Marketplace', priority: 'low', details: ['❌ Custom extensions', '❌ Backward compatibility', '❌ Version migration'] },
  ]);

  const [expandedCard, setExpandedCard] = useState(null);

  const getStatusColor = (status) => {
    switch(status) {
      case 'done': return 'bg-green-50 border-green-300';
      case 'doing': return 'bg-blue-50 border-blue-300';
      case 'todo': return 'bg-gray-50 border-gray-300';
      default: return 'bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'done': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'doing': return <AlertCircle className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'todo': return <Circle className="w-5 h-5 text-gray-400" />;
      default: return <Circle className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const moveCard = (id, newStatus) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-gray-400' },
    { id: 'doing', title: 'Doing', color: 'border-blue-500' },
    { id: 'done', title: 'Done', color: 'border-green-500' }
  ];

  const getItemsByStatus = (status) => items.filter(item => item.status === status);

  const stats = {
    todo: items.filter(i => i.status === 'todo').length,
    doing: items.filter(i => i.status === 'doing').length,
    done: items.filter(i => i.status === 'done').length,
    total: items.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Beddel - Roadmap de Implementação
          </h1>
          <p className="text-gray-600">Protocolo declarativo de agentes com runtime seguro</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-400">{stats.todo}</div>
            <div className="text-sm text-gray-600">To Do</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stats.doing}</div>
            <div className="text-sm text-gray-600">Doing</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-600">{stats.done}</div>
            <div className="text-sm text-gray-600">Done</div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-3 gap-6">
          {columns.map(column => (
            <div key={column.id} className="bg-white rounded-lg shadow-lg p-4 border-t-4" style={{ borderTopColor: column.color.split('-')[1] }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">{column.title}</h2>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  {getItemsByStatus(column.id).length}
                </span>
              </div>
              
              <div className="space-y-3">
                {getItemsByStatus(column.id).map(item => (
                  <div
                    key={item.id}
                    className={`rounded-lg border-2 p-4 transition-all cursor-pointer hover:shadow-md ${getStatusColor(item.status)}`}
                    onClick={() => setExpandedCard(expandedCard === item.id ? null : item.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.status)}
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="text-xs text-gray-500 mb-3">{item.epic}</div>
                    
                    {expandedCard === item.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-xs space-y-1">
                          {item.details.map((detail, idx) => (
                            <div key={idx} className="text-gray-700">{detail}</div>
                          ))}
                        </div>
                        
                        <div className="mt-3 flex space-x-2">
                          {column.id !== 'todo' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); moveCard(item.id, 'todo'); }}
                              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition"
                            >
                              ← To Do
                            </button>
                          )}
                          {column.id !== 'doing' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); moveCard(item.id, 'doing'); }}
                              className="text-xs bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded transition"
                            >
                              Doing
                            </button>
                          )}
                          {column.id !== 'done' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); moveCard(item.id, 'done'); }}
                              className="text-xs bg-green-100 hover:bg-green-200 px-3 py-1 rounded transition"
                            >
                              Done ✓
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Legenda de Épicos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><span className="font-medium">Epic 1:</span> Core Engine Implementation</div>
            <div><span className="font-medium">Epic 2:</span> Declarative Agents & Data Protection</div>
            <div><span className="font-medium">Epic 3:</span> API & Server Infrastructure</div>
            <div><span className="font-medium">Epic 4:</span> Marketplace Foundation</div>
            <div><span className="font-medium">Epic 5:</span> Performance & Scaling</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;