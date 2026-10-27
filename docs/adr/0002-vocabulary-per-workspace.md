# Vocabulário de tipos por workspace

Tipos de node e de relation não são strings soltas nem um enum global. Cada workspace copia um template (conhecimento ou worldbuilding) para tabelas próprias, e cada node/relation aponta para um tipo desse vocabulário. Assim um workspace pode evoluir o modelo sem afetar os outros, a exportação usa `key` estável, e a validação de atributos/propriedades tem um schema versionado no tipo.
