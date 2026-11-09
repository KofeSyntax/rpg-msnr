# M.S.N.R. — Monitoramento de Seres Não-Registrados

Site fictício (React + JavaScript + react-router-dom) de uma agência secreta que cuida de eventos paranormais, inspirado na Fundação SCP.

## Onde colocar cada arquivo

```
src/
├─ main.jsx               (exemplo de ponto de entrada — use o seu, se já tiver)
├─ App.jsx                rotas
├─ index.css              estilos + temas claro/escuro (paleta 60-30-10)
│
├─ pages/                 ← PÁGINAS (uma por rota)
│  ├─ Home.jsx            "/"
│  ├─ Agentes.jsx         "/agentes"  (login ou painel do agente)
│  ├─ MissaoDetalhe.jsx   "/agentes/missoes/:id"
│  └─ NotFound.jsx        qualquer outra rota (erro 404)
│
├─ components/            ← COMPONENTES reutilizáveis
│  Layout, Navbar, ThemeToggle, Footer, Banner, AlertaBox,
│  SecaoSobre, SecaoContratos, ContratoCard, LoginForm, RotaProtegida,
│  CartaoAgente, FotoAgente, CodigoBarras, CodigoQR,
│  TarefasLista, TarefaForm, TarefaItem,
│  ArquivoMissoes, StatusBadge,
│  Corporacao, BancoDados, Dossies, Classificados, TextoRedigido, Icon
│
├─ context/               AuthContext.jsx (login) e ThemeContext.jsx (tema)
├─ data/                  ← PLACEHOLDERS (edite aqui)
├─ hooks/                 useLocalStorage.js
└─ utils/                 formatar.js
public/
├─ imagens/banner.jpg     banner enviado
└─ fonts/OldNewspaperTypes.ttf   (opcional — veja "Fonte")
```

## Instalação (num projeto Vite + React)

```bash
npm create vite@latest msnr -- --template react
cd msnr
npm install react-router-dom
# copie as pastas src/ e public/ deste projeto por cima das do Vite
npm run dev
```

O `main.jsx` precisa envolver o `App` com `BrowserRouter`, `ThemeProvider` e `AuthProvider` (veja o exemplo incluído).

## Resumo da versão

- **Acesso**: visitante vê só o aviso e os Contratos. Logado vê também vídeo de boas-vindas, Sobre e Unidades.
- **Navbar (logado)**: Sobre, Contratos, Agentes, Corporação, Entidades (nível 1+), Mensagens e, só para o MESTRE, Mestre.
- **Agentes → abas**: Ficha (só jogadores), Anotações, Missões, Arquivos (imagens abrem ampliadas), Banco de Dados (nível 1+), Pesquisar agente (nível 2+).
- **Jogador x NPC**: NPC não tem ficha; o MESTRE edita os dados do cartão dele no painel.
- **Banco de Dados**: funciona como Missões (lista + página do arquivo). Cada arquivo tem nível de acesso (1 a 5; nível 0 não vê nada). Busca por código, nome e local; filtros de ameaça, status e período. Só o MESTRE edita.
- **Entidades**: nível mínimo por entidade, busca por nome/ID, filtro de contenção.
- **Mensagens**: pedido de amizade aceito; diretoria/mestre/mentor falam sem pedido. O MESTRE edita a data e hora das mensagens (Mestre → Mensagens).
- **Ficha**: o verso tem informações pessoais, backstory e relacionamentos (sem energia). O cartão do agente exporta imagem.
- **Mestre**: agentes, equipes, missões, documentos, entidades, banco de dados, mensagens e site (vídeo e unidades da aba Sobre).
- **Visual**: degradê no fundo, logo em transparência (`public/imagens/logo.png`), mais sombras e layout responsivo.

## Logins de teste (dados iniciais em `src/data/agentes.js`)

| ID         | Senha           | Nível | Perfil                       |
|------------|-----------------|-------|------------------------------|
| EXP-0417   | lanterna17      | 1     | Agente de exploração         |
| EXP-0832   | corvo832        | 3     | Agente de exploração sênior (mentor da DELT4) |
| DIR-0001   | omega-protocolo | 5     | Diretoria                    |
| MESTRE     | mestrando       | 5     | Mestre de RPG (acesso total) |
| NPC-0001   | npc0001         | 2     | NPC de exemplo (sem ficha)   |

## Onde ficam os dados

Tudo (agentes, equipes, missões, mensagens, anotações, documentos) fica no `localStorage` do navegador (`msnr:db:v2`) e a ficha em `msnr:ficha:<ID>`. Abas do mesmo navegador sincronizam entre si, mas **outros computadores não veem esses dados**: para jogar à distância é preciso um servidor (basta trocar `ler()`/gravação em `context/DataContext.jsx`).

## Dependências extras (exportar ficha)

```bash
npm install jspdf html2canvas
```

## Níveis de acesso (edite em `src/data/abas.js`)

| Aba            | Nível mínimo |
|----------------|--------------|
| Ficha, Anotações, Missões, Arquivos | 0 |
| Banco de Dados | 1 (e o nível do arquivo) |
| Pesquisar agente | 2          |
