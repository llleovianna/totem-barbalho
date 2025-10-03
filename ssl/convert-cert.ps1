# Script para converter certificado PFX para PEM (compatível com Node.js)

$pfxPath = "C:\Users\leovi\Desktop\totem\ssl\cert.pfx"
$certPath = "C:\Users\leovi\Desktop\totem\ssl\cert.pem"
$keyPath = "C:\Users\leovi\Desktop\totem\ssl\key.pem"
$password = "barbalho2025"

# Carregar o certificado PFX
$pfx = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
$pfx.Import($pfxPath, $password, [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable)

# Exportar certificado público (cert.pem)
$certBytes = $pfx.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
$certPem = "-----BEGIN CERTIFICATE-----`r`n"
$certPem += [System.Convert]::ToBase64String($certBytes, [System.Base64FormattingOptions]::InsertLineBreaks)
$certPem += "`r`n-----END CERTIFICATE-----"
[System.IO.File]::WriteAllText($certPath, $certPem)

Write-Host "✅ Certificado exportado: cert.pem" -ForegroundColor Green

# Exportar chave privada (key.pem)
$rsaPrivateKey = [System.Security.Cryptography.X509Certificates.RSACertificateExtensions]::GetRSAPrivateKey($pfx)
$keyBytes = $rsaPrivateKey.ExportRSAPrivateKey()
$keyPem = "-----BEGIN RSA PRIVATE KEY-----`r`n"
$keyPem += [System.Convert]::ToBase64String($keyBytes, [System.Base64FormattingOptions]::InsertLineBreaks)
$keyPem += "`r`n-----END RSA PRIVATE KEY-----"
[System.IO.File]::WriteAllText($keyPath, $keyPem)

Write-Host "✅ Chave privada exportada: key.pem" -ForegroundColor Green
Write-Host ""
Write-Host "🔐 Certificados SSL criados com sucesso!" -ForegroundColor Cyan
Write-Host "📁 Localização: C:\Users\leovi\Desktop\totem\ssl\" -ForegroundColor Yellow
