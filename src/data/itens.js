// Catálogo de itens básicos disponibilizados pela Fundação (Guia do Jogador).
// Vira a coleção "catalogo" no Supabase na primeira carga; depois o Mestre edita pelo painel.
// nivel: null = "-" | critico: "x2", "19/x3"... | municao: capacidade do carregador | espaco: espaços ocupados
export const TIPOS_CATALOGO = [["arma", "Arma"], ["item", "Item"], ["mochila", "Mochila"]];

// Categorias de mochila: bonusEspaco = espaços da mochila | penalidades = pontos tirados das perícias de cada atributo.
// Os efeitos só valem enquanto a mochila da ficha estiver ativa.
const mochila = (id, nome, bonusEspaco, penalidades) => ({
  id, tipo: "mochila", nome, nivel: null, dano: "", critico: "", alcance: "", municao: "", usos: "",
  espaco: 0, bonusEspaco, penalidades, descricao: "",
});
export const MOCHILAS = [
  mochila("mochila-pequena", "Mochila pequena", 4, {}),
  mochila("mochila-media", "Mochila média", 6, { des: 2 }),
  mochila("mochila-grande", "Mochila grande", 8, { des: 5 }),
  mochila("mochila-militar", "Mochila militar", 10, { des: 8, vig: 5 }),
];

export const CATALOGO = [
  {"id": "arma-faca", "tipo": "arma", "nome": "Faca", "nivel": 0, "dano": "1d4", "critico": "x2", "alcance": "curto", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-faca-tatica", "tipo": "arma", "nome": "Faca tática", "nivel": 0, "dano": "1d6", "critico": "x2", "alcance": "curto", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-espada-curta", "tipo": "arma", "nome": "Espada curta", "nivel": 0, "dano": "1d6", "critico": "x2", "alcance": "curto", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-adaga", "tipo": "arma", "nome": "Adaga", "nivel": 0, "dano": "1d4", "critico": "x2", "alcance": "curto", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-soco-ingles", "tipo": "arma", "nome": "Soco inglês", "nivel": 0, "dano": "1d4", "critico": "x2", "alcance": "curto", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-porrete", "tipo": "arma", "nome": "Porrete", "nivel": 0, "dano": "1d4", "critico": "x2", "alcance": "curto", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-machado", "tipo": "arma", "nome": "Machado", "nivel": 1, "dano": "1d8", "critico": "x2", "alcance": "curto", "municao": "", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-machete", "tipo": "arma", "nome": "Machete", "nivel": 1, "dano": "1d8", "critico": "x2", "alcance": "curto", "municao": "", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-katana", "tipo": "arma", "nome": "Katana", "nivel": 1, "dano": "1d10", "critico": "x3", "alcance": "curto", "municao": "", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-marreta", "tipo": "arma", "nome": "Marreta", "nivel": 2, "dano": "2d10", "critico": "x3", "alcance": "curto", "municao": "", "usos": "", "espaco": 3, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-estilingue", "tipo": "arma", "nome": "Estilingue", "nivel": 0, "dano": "1d4", "critico": "", "alcance": "médio", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-besta-compacta", "tipo": "arma", "nome": "Besta compacta", "nivel": 1, "dano": "1d8", "critico": "x2", "alcance": "médio", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-besta-profissional", "tipo": "arma", "nome": "Besta profissional", "nivel": 2, "dano": "1d10", "critico": "x2", "alcance": "médio", "municao": "", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-arco", "tipo": "arma", "nome": "Arco", "nivel": 1, "dano": "1d10", "critico": "x2", "alcance": "médio", "municao": "", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-revolver", "tipo": "arma", "nome": "Revólver", "nivel": 1, "dano": "2d6", "critico": "x2", "alcance": "curto", "municao": "6", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-pistola", "tipo": "arma", "nome": "Pistola", "nivel": 1, "dano": "1d12", "critico": "x2", "alcance": "curto", "municao": "12", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-submetralhadora", "tipo": "arma", "nome": "Submetralhadora", "nivel": 1, "dano": "2d6", "critico": "19/x3", "alcance": "curto", "municao": "20", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-fuzil-de-caca", "tipo": "arma", "nome": "Fuzil de caça", "nivel": 1, "dano": "1d8", "critico": "19/x3", "alcance": "médio", "municao": "4", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-espingarda", "tipo": "arma", "nome": "Espingarda", "nivel": 1, "dano": "4d6", "critico": "x3", "alcance": "curto", "municao": "6", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-fuzil-de-assalto", "tipo": "arma", "nome": "Fuzil de assalto", "nivel": 2, "dano": "2d10", "critico": "19/x3", "alcance": "médio", "municao": "30", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-espingarda-de-cano-duplo", "tipo": "arma", "nome": "Espingarda de cano duplo", "nivel": null, "dano": "4d6", "critico": "x3", "alcance": "curto", "municao": "2", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-fuzil-de-precisao", "tipo": "arma", "nome": "Fuzil de precisão", "nivel": 3, "dano": "2d10", "critico": "19/x3", "alcance": "longo", "municao": "1", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-bazuca", "tipo": "arma", "nome": "Bazuca", "nivel": 3, "dano": "8d10", "critico": "x2", "alcance": "médio", "municao": "", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-lanca-chamas", "tipo": "arma", "nome": "Lança-chamas", "nivel": 3, "dano": "6d6", "critico": "x3", "alcance": "curto", "municao": "", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-metralhadora", "tipo": "arma", "nome": "Metralhadora", "nivel": 3, "dano": "2d12", "critico": "19/x3", "alcance": "médio", "municao": "50", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-corrente", "tipo": "arma", "nome": "Corrente", "nivel": 0, "dano": "1d8", "critico": "x2", "alcance": "", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-espada", "tipo": "arma", "nome": "Espada", "nivel": 1, "dano": "1d10", "critico": "19/x2", "alcance": "", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-florete", "tipo": "arma", "nome": "Florete", "nivel": 1, "dano": "1d6", "critico": "18/x2", "alcance": "", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-foice", "tipo": "arma", "nome": "Foice", "nivel": 1, "dano": "1d10", "critico": "19/x2", "alcance": "", "municao": "", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-motoserra", "tipo": "arma", "nome": "Motoserra", "nivel": 1, "dano": "3d6", "critico": "x2", "alcance": "", "municao": "", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-bomba-de-fumaca", "tipo": "arma", "nome": "Bomba de fumaça", "nivel": 1, "dano": "", "critico": "", "alcance": "", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-granada-de-luz", "tipo": "arma", "nome": "Granada de luz", "nivel": 1, "dano": "", "critico": "", "alcance": "", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-granada-explosiva", "tipo": "arma", "nome": "Granada explosiva", "nivel": 1, "dano": "4d6", "critico": "x2", "alcance": "", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "arma-mina-explosiva", "tipo": "arma", "nome": "Mina explosiva", "nivel": 1, "dano": "4d8", "critico": "x2", "alcance": "", "municao": "", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "item-lanterna", "tipo": "item", "nome": "Lanterna", "nivel": 0, "dano": "", "critico": "", "alcance": "", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "item-canivete-suico", "tipo": "item", "nome": "Canivete suíço", "nivel": 0, "dano": "1", "critico": "", "alcance": "", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "item-kit-de-primeiros-socorros", "tipo": "item", "nome": "Kit de primeiros socorros", "nivel": 1, "dano": "", "critico": "", "alcance": "", "municao": "", "usos": "3", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "item-pe-de-cabra", "tipo": "item", "nome": "Pé de cabra", "nivel": 1, "dano": "1d6", "critico": "", "alcance": "", "municao": "", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "item-algemas", "tipo": "item", "nome": "Algemas", "nivel": 1, "dano": "", "critico": "", "alcance": "", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "item-kit-de-arrombamento", "tipo": "item", "nome": "Kit de arrombamento", "nivel": 1, "dano": "", "critico": "", "alcance": "", "municao": "", "usos": "3", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "item-binoculos", "tipo": "item", "nome": "Binóculos", "nivel": 0, "dano": "", "critico": "", "alcance": "", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "item-camera-termica", "tipo": "item", "nome": "Câmera térmica", "nivel": 1, "dano": "", "critico": "", "alcance": "", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "item-gps-portatil", "tipo": "item", "nome": "GPS portátil", "nivel": 0, "dano": "", "critico": "", "alcance": "", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "item-notebook", "tipo": "item", "nome": "Notebook", "nivel": 0, "dano": "", "critico": "", "alcance": "", "municao": "", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "item-mascara-de-gas", "tipo": "item", "nome": "Máscara de gás", "nivel": 1, "dano": "", "critico": "", "alcance": "", "municao": "", "usos": "", "espaco": 2, "bonusEspaco": 0, "descricao": ""},
  {"id": "item-radio-comunicador", "tipo": "item", "nome": "Rádio comunicador", "nivel": 1, "dano": "", "critico": "", "alcance": "", "municao": "", "usos": "", "espaco": 1, "bonusEspaco": 0, "descricao": ""},
  {"id": "item-cinto-tatico", "tipo": "item", "nome": "Cinto tático", "nivel": 1, "dano": "", "critico": "", "alcance": "", "municao": "", "usos": "", "espaco": 0, "bonusEspaco": 2, "descricao": ""}
];
CATALOGO.push(...MOCHILAS);

// Espaço ocupado por uma lista de itens (item sem espaço definido ocupa 1)
export const espacoUsado = (itens) => itens.reduce((t, i) => t + (Number.isFinite(+i.espaco) && i.espaco !== "" && i.espaco != null ? +i.espaco : 1), 0);
// Itens equipados que ampliam a capacidade (ex.: Cinto tático +2)
export const bonusEspaco = (itens) => itens.reduce((t, i) => t + (i.equipado ? +i.bonusEspaco || 0 : 0), 0);

// Penalidade que a mochila ativa aplica às perícias de um atributo (0 se desativada ou sem categoria)
export const penalidadeMochila = (f, atributo) => (f.mochilaAtiva && f.mochilaCat?.penalidades?.[atributo]) || 0;
