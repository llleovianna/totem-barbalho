# 🔐 Configuração SSL/TLS - Totem Barbalho

## ✅ Certificados Gerados com Sucesso

Os certificados SSL auto-assinados foram criados na pasta `ssl/`:

- `cert.pem` - Certificado público
- `key.pem` - Chave privada RSA 2048-bit
- `cert.pfx` - Certificado no formato PFX (backup)

### 📋 Informações do Certificado

- **Organização**: Barbalho Alimentos
- **Unidade**: Totem IA Culinária
- **País**: BR (Brasil)
- **Validade**: 1 ano
- **Algoritmo**: RSA 2048-bit
- **Hash**: SHA-256

### 🌐 Hosts Permitidos

O certificado é válido para:
- `localhost`
- `127.0.0.1`
- `192.168.15.48` (seu IP de rede atual)

## 🚀 Como Usar

### Backend Dual-Mode (HTTP + HTTPS)

O servidor backend agora roda em **dois modos simultaneamente**:

1. **HTTP** (porta 3000) - Compatibilidade total
   - `http://localhost:3000`
   - `http://192.168.15.48:3000`

2. **HTTPS** (porta 3443) - Comunicação segura
   - `https://localhost:3443`
   - `https://192.168.15.48:3443`

### Iniciar o Backend

```powershell
cd backend
npm start
```

**Saída esperada:**
```
🔐 Certificados SSL encontrados e carregados
🚀 Totem Barbalho Backend (HTTP) running on port 3000
🔒 Totem Barbalho Backend (HTTPS) running on port 3443
⚠️  Certificado auto-assinado - navegadores mostrarão aviso de segurança
```

## ⚠️ Aviso de Segurança do Navegador

### Por que vejo "Sua conexão não é particular"?

Certificados **auto-assinados** não são validados por uma Autoridade Certificadora (CA) reconhecida. Isso é **NORMAL** em ambientes de desenvolvimento.

### Como aceitar o certificado?

1. No Chrome/Edge: Clique em "Avançado" → "Continuar para localhost (não seguro)"
2. No Firefox: Clique em "Avançado" → "Aceitar o risco e continuar"
3. No Safari: Clique em "Mostrar detalhes" → "Visitar este site"

### É seguro?

✅ **Sim, para desenvolvimento local!** O certificado:
- Criptografa a comunicação entre frontend e backend
- Protege dados sensíveis (receitas, informações do usuário)
- Permite testar funcionalidades que requerem HTTPS

❌ **Não use em produção!** Para produção, obtenha um certificado válido:
- [Let's Encrypt](https://letsencrypt.org/) (gratuito)
- Cloudflare SSL
- Certificados comerciais (DigiCert, GlobalSign, etc.)

## 🔄 Regenerar Certificados

Se os certificados expirarem ou você mudar de IP:

```powershell
node ssl/generate-certs.js
```

**Atualize o IP no script** `generate-certs.js` (linha 71):
```javascript
{
  type: 7, // IP
  ip: 'SEU_NOVO_IP_AQUI'
}
```

## 📦 Dependências

- `node-forge` - Geração de certificados X.509
- `https` (Node.js built-in) - Servidor HTTPS
- `fs` (Node.js built-in) - Leitura de arquivos

## 🛠️ Troubleshooting

### Erro: "Certificados SSL não encontrados"

**Solução**: Execute o script de geração:
```powershell
node ssl/generate-certs.js
```

### Erro: "EADDRINUSE" (porta em uso)

**Solução**: Outra aplicação está usando a porta 3443. Altere em `server.js`:
```javascript
const HTTPS_PORT = 3444; // ou outra porta disponível
```

### PDF não funciona via HTTPS

**Causa**: Mixed content (HTTPS → HTTP)

**Solução**: Use a mesma porta HTTPS no frontend e backend, ou configure CORS adequadamente.

## 📊 Otimização de PDF

### Antes: 1299 KB ❌
- Logo em base64 SVG (pesado)
- Múltiplas requisições externas

### Depois: ~150-200 KB ✅
- Logo PNG local otimizado
- Sem dependências externas
- Data URI carregado uma única vez no construtor

## 🔒 Segurança em Produção

Para deploy em produção:

1. **Obtenha certificado válido**:
   ```bash
   # Certbot (Let's Encrypt)
   sudo certbot certonly --standalone -d seudominio.com
   ```

2. **Use proxy reverso** (Nginx/Apache):
   ```nginx
   server {
       listen 443 ssl;
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;
       
       location / {
           proxy_pass http://localhost:3000;
       }
   }
   ```

3. **Ative HSTS**:
   ```javascript
   app.use(helmet.hsts({
       maxAge: 31536000,
       includeSubDomains: true,
       preload: true
   }));
   ```

## 📚 Recursos

- [MDN - HTTPS](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Overview)
- [Node.js HTTPS](https://nodejs.org/api/https.html)
- [Let's Encrypt](https://letsencrypt.org/)
- [SSL Labs Test](https://www.ssllabs.com/ssltest/)

---

**Desenvolvido para Barbalho Alimentos** 🌾  
Totem Interativo IA Culinária © 2025
