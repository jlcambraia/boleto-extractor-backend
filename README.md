# Extrator de Código de Barras para PDFs - Backend

API backend em Node.js para extrair códigos de barras automaticamente de arquivos PDF, especialmente focado em boletos bancários brasileiros.

---

## Funcionalidades

- Upload de arquivos PDF via endpoint `/api/extract-barcode`
- Extração automática do código de barras a partir do texto extraído do PDF
- Suporte a diferentes formatos comuns de códigos de barras de boletos
- Limite de tamanho do arquivo: 10 MB
- Tratamento de PDFs protegidos por senha com resposta apropriada
- Endpoint `/api/health` para verificação do status da API
- Validação e tratamento de erros robustos (ex: arquivos inválidos, limites de tamanho)

---

## Tecnologias utilizadas

- Node.js
- Express.js
- Multer (upload de arquivos)
- pdf-parse (extração de texto de PDFs)
- CORS para permitir chamadas de frontend externos
- dotenv para configuração de variáveis de ambiente

---

## Como funciona a extração do código de barras

O backend usa a biblioteca `pdf-parse` para extrair o texto do PDF. Em seguida, aplica expressões regulares que identificam os padrões comuns dos códigos de barras de boletos brasileiros (linha digitável e código direto). Caso nenhum padrão seja identificado, tenta capturar sequências longas de números como fallback.

---

## Limitações

- PDFs protegidos por senha ou criptografados **não são suportados**.
- Apenas arquivos PDF são aceitos (limite de 10MB).
- O extrator é focado em códigos de barras no formato brasileiro, pode não funcionar para outros tipos.

---

## Tratamento de erros

O servidor trata erros de upload, tamanho de arquivo excedido, arquivos inválidos e falhas internas, retornando mensagens claras para o cliente.

---

## Contato

Caso tenha dúvidas ou queira contribuir, abra uma issue ou envie um pull request.

---

## Licença

MIT License — sinta-se à vontade para usar e modificar conforme sua necessidade.

---

**Desenvolvido com ❤️ por João Luiz Cambraia**
