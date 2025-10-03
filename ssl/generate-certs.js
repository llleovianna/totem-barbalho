// Script para gerar certificados SSL auto-assinados para desenvolvimento
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔐 Gerando certificados SSL auto-assinados...\n');

// Criar a pasta ssl se não existir
const sslDir = path.join(__dirname);
if (!fs.existsSync(sslDir)) {
  fs.mkdirSync(sslDir, { recursive: true });
}

try {
  // Gerar chave privada e certificado usando Node.js built-in crypto
  const forge = require('node-forge');
  const pki = forge.pki;

  console.log('📝 Gerando par de chaves RSA 2048...');
  const keys = pki.rsa.generateKeyPair(2048);

  console.log('📄 Criando certificado X.509...');
  const cert = pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  const attrs = [{
    name: 'commonName',
    value: 'localhost'
  }, {
    name: 'countryName',
    value: 'BR'
  }, {
    shortName: 'ST',
    value: 'SP'
  }, {
    name: 'localityName',
    value: 'São Paulo'
  }, {
    name: 'organizationName',
    value: 'Barbalho Alimentos'
  }, {
    shortName: 'OU',
    value: 'Totem IA Culinária'
  }];

  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.setExtensions([{
    name: 'basicConstraints',
    cA: true
  }, {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true
  }, {
    name: 'extKeyUsage',
    serverAuth: true,
    clientAuth: true,
    codeSigning: true,
    emailProtection: true,
    timeStamping: true
  }, {
    name: 'nsCertType',
    server: true,
    email: true,
    objsign: true,
    sslCA: true,
    emailCA: true,
    objCA: true
  }, {
    name: 'subjectAltName',
    altNames: [{
      type: 2, // DNS
      value: 'localhost'
    }, {
      type: 7, // IP
      ip: '127.0.0.1'
    }, {
      type: 7, // IP
      ip: '192.168.15.48'
    }]
  }]);

  // Assinar o certificado
  cert.sign(keys.privateKey, forge.md.sha256.create());

  console.log('💾 Salvando arquivos...');
  
  // Salvar chave privada
  const keyPem = pki.privateKeyToPem(keys.privateKey);
  fs.writeFileSync(path.join(sslDir, 'key.pem'), keyPem);
  console.log('   ✅ key.pem criado');

  // Salvar certificado
  const certPem = pki.certificateToPem(cert);
  fs.writeFileSync(path.join(sslDir, 'cert.pem'), certPem);
  console.log('   ✅ cert.pem criado');

  console.log('\n🎉 Certificados SSL criados com sucesso!');
  console.log('📁 Localização:', sslDir);
  console.log('🔐 Válido por: 1 ano');
  console.log('🌐 Hosts permitidos: localhost, 127.0.0.1, 192.168.15.48\n');
  console.log('⚠️  AVISO: Este é um certificado auto-assinado para DESENVOLVIMENTO.');
  console.log('   Navegadores mostrarão avisos de segurança. Para produção, use um certificado válido.\n');

} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.error('\n❌ Erro: Módulo "node-forge" não encontrado.');
    console.log('📦 Instalando dependência...\n');
    
    try {
      execSync('npm install node-forge', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
      console.log('\n✅ Dependência instalada! Execute o script novamente:\n');
      console.log('   node ssl/generate-certs.js\n');
    } catch (installError) {
      console.error('❌ Erro ao instalar node-forge:', installError.message);
    }
  } else {
    console.error('❌ Erro ao gerar certificados:', error.message);
  }
}
