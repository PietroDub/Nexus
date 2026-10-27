# Grafo canônico normalizado no PostgreSQL

O produto parece um grafo visual, mas a verdade do domínio precisa de integridade referencial, busca, auditoria e escrita concorrente. Cada node, relation e view é uma linha; posições ficam na view, não no node. Rejeitamos um blob único do grafo e um banco de grafos no início: o primeiro complica concorrência e consulta, o segundo só se justifica com caminhos complexos que ainda não medimos.
