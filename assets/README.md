# 🎨 Assets e Ícones - Totem Barbalho

Esta pasta contém os recursos visuais usados pelo instalador e aplicação Electron.

## 📋 Arquivos Necessários

### icon.ico (Obrigatório)
- **Formato:** .ico (Windows Icon)
- **Tamanho:** 256x256 pixels (recomendado multi-resolução)
- **Uso:** 
  - Ícone da aplicação instalada
  - Ícone do instalador
  - Ícone na barra de tarefas
  - Atalho na área de trabalho

### Como Criar o Ícone

#### Opção 1: Converter logo existente

1. Use a logo da Barbalho (PNG com fundo transparente)
2. Redimensione para 256x256 pixels
3. Converta para .ico em: https://www.icoconverter.com/
4. Salve como `icon.ico` nesta pasta

#### Opção 2: Usar logo atual do projeto

```bash
# A logo já está em frontend/public/logo-barbalho.png
# Você pode convertê-la online ou usar ImageMagick:

magick convert ../frontend/public/logo-barbalho.png -resize 256x256 -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

## 📁 Estrutura

```
assets/
├── icon.ico          # Ícone principal (ADICIONAR)
├── icon.png          # Fonte PNG (opcional)
└── README.md         # Este arquivo
```

## ⚠️ Importante

Se o arquivo `icon.ico` não estiver presente:
- O build funcionará normalmente
- Será usado o ícone padrão do Electron
- Para um instalador profissional, adicione o ícone personalizado

## 🔗 Referências

- **Logo Barbalho atual:** `frontend/public/logo-barbalho.png`
- **Conversor online:** https://www.icoconverter.com/
- **Documentação Electron Icons:** https://www.electron.build/icons

---

**Status:** ⚠️ Ícone `icon.ico` precisa ser adicionado manualmente
