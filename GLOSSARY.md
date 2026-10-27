# Nexus

Espaço em que conhecimento, mundos e processos existem como nós e relações tipadas. O grafo é o conteúdo; a geometria visual é só uma forma de vê-lo.

## Language

**Workspace**:
Contêiner de um projeto, com membros, papéis e um vocabulário próprio de tipos.
_Avoid_: projeto, conta, área, tenant

**Graph**:
Conjunto de nós e relações de um workspace. É a estrutura canônica do conhecimento, não o desenho na tela.
_Avoid_: mapa, canvas, diagrama, documento

**Node**:
Entidade identificável e tipada dentro de um graph, com título, conteúdo e atributos.
_Avoid_: card, item, vértice, conceito (conceito é um tipo de Node, não o Node em si)

**Relation**:
Conexão semântica entre dois nodes, com tipo, direção e propriedades. Não executa efeitos.
_Avoid_: edge, link, seta, conexão, linha

**Node type**:
Categoria de node no vocabulário do workspace (por exemplo concept, person, place).
_Avoid_: label, tag, classe, kind

**Relation type**:
Categoria de relation no vocabulário do workspace (por exemplo prerequisite, governs). Alguns tipos exigem aciclicidade; a maioria não.
_Avoid_: predicado, verbo, label

**View**:
Configuração de apresentação de um graph: recorte visual, filtros e posições. Não altera o significado dos nodes e relations.
_Avoid_: layout, cena, board, mapa (quando a intenção é a apresentação, não o Graph)

**Flow**:
Definição executável, versionada, que referencia nodes e relations. Só existe quando alguém a declara; uma Relation nunca é um Flow.
_Avoid_: automação, workflow, trilha (trilha é consulta sobre Relations, não execução)

**Run**:
Execução imutável de uma versão de Flow, com entrada, resultado e proveniência.
_Avoid_: job, task, execução avulsa

**Membership**:
Vínculo de uma pessoa a um workspace com um papel (owner, editor, viewer).
_Avoid_: permissão, share, convite (convite é o meio de criar uma Membership)

**Audit event**:
Registro imutável de uma mudança já confirmada no workspace. Não é comando e não dispara efeito externo.
_Avoid_: log, histórico de versão, event sourcing
