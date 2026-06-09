<div align="center">

# 🌱 AgroVision Mobile

### Aplicativo de Gestão Inteligente de Fazendas

*Monitoramento de Plantações, Colheitas e Insumos na palma da mão*

![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-SDK-000020?style=for-the-badge&logo=expo&logoColor=white)
![AsyncStorage](https://img.shields.io/badge/AsyncStorage-Persistência-FF6B6B?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-Autenticação-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

<br/>

> **FIAP — Global Solution 2026/1**
> **Tema: 🚀 O Espaço é a Nova Fronteira — Economia Espacial**

</div>

---

## 👥 Equipe

| Nome | RM |
| João Victor Caetano Alves da Silva | RM 562074 |
| João Victor Bueno Castelini da Silva | RM 564115 |
| Ryan Vetoriano | RM 565667 |
| Felipe Furlanetto | RM 562766 |
| Raul Rezende Iemini Aguiar | RM 564002 |

---

## 📌 Links do Projeto

| Recurso | Link |
|:---|:---|
| 🚀 **API Backend** | [https://agrovision-gs-fewn.onrender.com](https://agrovision-gs-fewn.onrender.com) |
| 📄 **Swagger da API** | [https://agrovision-gs-fewn.onrender.com/swagger-ui.html](https://agrovision-gs-fewn.onrender.com/swagger-ui.html) |
| 🎬 **Vídeo de Apresentação** (até 10 min) | `https://youtu.be/_95IJLY-NvE` |
| 💻 **Repositório GitHub** | `https://github.com/Felipe-Furlanetto0504/GS-Mobile` |

---

## 🌍 Sobre o Projeto

O **AgroVision Mobile** é um aplicativo desenvolvido em **React Native com Expo** que conecta produtores rurais à API AgroVision. Com ele, o agricultor pode cadastrar e monitorar plantações, registrar colheitas, controlar insumos e visualizar o perfil da fazenda — tudo com autenticação segura via JWT.

### 🔁 Fluxo do Usuário

```
📝 Cadastro (CPF + Nome + Fazenda + Senha)
         │
         ▼
🔐 Login com CPF e Senha → recebe Token JWT
         │
         ▼
🏠 Home — visão geral da fazenda e talhões
         │
    ┌────┴────┐────────────┐
    ▼         ▼            ▼
🌱 Plantações  🧪 Insumos  👤 Perfil
    │
    ▼
🌾 Registrar Colheita (apenas status PLANTADO)
    │
    ▼
✅ Plantação removida automaticamente após colheita
```

---

## 📱 Telas do Aplicativo

| Tela | Descrição |
|:---|:---|
| **Cadastro** | Registro de novo usuário com CPF (com máscara), nome, fazenda e senha |
| **Login** | Autenticação via CPF + senha, armazena token JWT no AsyncStorage |
| **Home** | Visão geral da fazenda com lista de talhões e status de cada plantação |
| **Plantação** | CRUD completo de plantações com seleção de status e registro de colheita |
| **Insumos** | Cadastro e listagem de insumos vinculados às plantações |
| **Perfil** | Dados do usuário, total de talhões e alternância de tema claro/escuro |
| **EstadoPlan** | Visualização de status das plantações |
| **Sobre** | Informações sobre o projeto |

---

## 🗂️ Estrutura do Projeto

```
src/
├── routes/
│   ├── index.js           ← Stack Navigator (Login, Cadastro, App)
│   └── tab.routes.jsx     ← Bottom Tab Navigator (Home, Plantação, Insumos, Estado, Sobre, Perfil)
├── screens/
│   ├── Logar.jsx          ← Tela de Login
│   ├── Cadastrar.jsx      ← Tela de Cadastro
│   ├── Home.jsx           ← Tela principal com fazenda e talhões
│   ├── Plantacao.jsx      ← Gestão de plantações e colheitas
│   ├── Insumo.jsx         ← Gestão de insumos
│   ├── Perfil.jsx         ← Perfil do usuário
│   ├── EstadoPlan.jsx     ← Estado das plantações
│   └── Sobre.jsx          ← Sobre o app
└── theme/
    └── index.js           ← Temas claro e escuro
```

---

## ⚙️ Tecnologias Utilizadas

| Tecnologia | Finalidade |
|:---|:---|
| **React Native** | Framework principal do app |
| **Expo** | Plataforma de desenvolvimento e build |
| **React Navigation** | Navegação entre telas (Stack + Bottom Tabs) |
| **AsyncStorage** | Persistência local de token JWT e dados do usuário |
| **react-native-mask-text** | Máscara de CPF no formato `000.000.000-00` |
| **expo-vector-icons (Feather / MaterialIcons / MaterialCommunityIcons)** | Ícones das telas e da tab bar |
| **react-native-safe-area-context** | Suporte a áreas seguras (notch, barra de status) |
| **useFocusEffect** | Recarregamento automático ao navegar entre telas |

---

## 🔒 Autenticação

O app usa **JWT Bearer Token** para autenticar todas as requisições à API.

**Fluxo:**
1. Usuário faz login → API retorna `token`, `cpf`, `nome`, `nomeFazenda`
2. App busca o `id` do banco via `GET /api/usuarios` e filtra pelo CPF
3. Token e dados do usuário (incluindo `id`) são salvos no AsyncStorage
4. Todas as requisições protegidas enviam `Authorization: Bearer <token>`
5. Token expirado → usuário redirecionado automaticamente para o Login

```js
// Exemplo do helper usado em todas as telas
async function fetchComToken(path, options = {}) {
  const token = await AsyncStorage.getItem("token");
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}
```

---

## 🌱 Regras de Negócio

| Regra | Descrição |
|:---|:---|
| **Colheita restrita** | Só é possível registrar colheita em plantações com status `PLANTADO` |
| **Exclusão automática** | Após registrar uma colheita, a plantação é excluída automaticamente |
| **Insumo vinculado** | Todo insumo deve ser vinculado a uma plantação existente |
| **CPF como identificador** | O CPF é usado como username na autenticação (campo `Long` na API) |
| **Sessão persistente** | Token salvo no AsyncStorage mantém o usuário logado entre sessões |
| **Logout limpo** | Sair remove `token` e `usuarioLogado` do AsyncStorage |

---

## 🎨 Temas

O app suporta **modo claro e escuro**, alternável na tela de Perfil.

| Tema | Fundo | Acento |
|:---:|:---:|:---:|
| 🌑 Escuro | `#1A1A1A` | `#C8A96E` (dourado) |
| ☀️ Claro | `#F5F5F0` | `#C8A96E` (dourado) |

---

## ▶️ Como Executar Localmente

### Pré-requisitos

- Node.js 18+
- Expo CLI
- Expo Go (no celular) ou emulador Android/iOS

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/agrovision-mobile.git
cd agrovision-mobile

# 2. Instale as dependências
npm install

# 3. Inicie o projeto
npx expo start

# 4. Escaneie o QR Code com o Expo Go ou pressione:
#    'a' para Android emulator
#    'i' para iOS simulator
```

---

## 🔗 Integração com a API

O app consome a API REST AgroVision hospedada no Render.

| Endpoint | Tela | Método |
|:---|:---:|:---:|
| `POST /api/usuarios` | Cadastro | Criar conta |
| `POST /api/auth/login` | Login | Autenticar |
| `GET /api/usuarios` | Login | Buscar ID do usuário |
| `GET /api/plantacoes/usuario/{id}` | Home / Plantação / Perfil | Listar plantações |
| `POST /api/plantacoes` | Plantação | Cadastrar plantação |
| `DELETE /api/plantacoes/{id}` | Plantação | Excluir plantação |
| `POST /api/safras` | Plantação | Registrar colheita |
| `GET /api/insumos/plantacao/{id}` | Insumos | Listar insumos |
| `POST /api/insumos` | Insumos | Cadastrar insumo |
| `DELETE /api/insumos/{id}` | Insumos | Excluir insumo |

> ⚠️ A API está no plano gratuito do Render e pode hibernar após 15 minutos sem uso. A primeira requisição pode demorar até **50 segundos**.

---

<div align="center">

Desenvolvido com 💚 pela equipe AgroVision

**FIAP — Java Advanced | Global Solution 2026/1**

</div>
