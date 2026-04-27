# 🐉 DBZ Explorer

Enciclopédia de personagens de Dragon Ball, construída em React Native com Expo para o exercicício da aula de Mobile 22/04/2026. 
O app consome a [Dragon Ball API](https://dragonball-api.com/) e exibe todos os personagens com suas informações.

## 🔗 API utilizada

- **Dragon Ball API** — https://dragonball-api.com/api/characters

## Como rodar o projeto

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/dbz-explorer.git
cd dbz-explorer

# Instale as dependências
npm install

# Instale o suporte pra web
npx expo install react-dom react-native-web @expo/metro-runtime

# Rode o projeto na web
npx expo start --web
```

## 📱 Funcionalidades

- Listagem de todos os personagens da API com imagem, nome, raça e nível de ki
- Busca por nome em tempo real
- Filtro por raça (Saiyajin, Namekuseijin, Humano, Android, etc.)
- Modal de detalhes ao clicar em um personagem, com descrição completa, stats e transformações
- Tela de loading com spinner enquanto os dados carregam
- Tratamento de erro com botão para tentar novamente

## Componentes utilizados

 View, Text e Button, FlatList, TextInput, Image, TouchableOpacity, ActivityIndicator, Modal, SafeAreaView, ScrollView e StatusBar.
