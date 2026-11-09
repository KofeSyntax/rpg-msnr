// Requer: npm i jspdf html2canvas
import { calcularIdade } from "./formatar";

const PREFIXO = "MSNR1.";

export const gerarCodigo = (f) => PREFIXO + btoa(unescape(encodeURIComponent(JSON.stringify(f))));

export const lerCodigo = (txt) => {
  const t = (txt || "").trim();
  if (!t.startsWith(PREFIXO)) throw new Error("código inválido");
  return JSON.parse(decodeURIComponent(escape(atob(t.slice(PREFIXO.length)))));
};

const baixar = (href, nome) => {
  const a = document.createElement("a");
  a.href = href; a.download = nome;
  document.body.appendChild(a); a.click(); a.remove();
};

export const exportarImagens = async (nos, nome) => {
  const { default: html2canvas } = await import("html2canvas");
  const fundo = getComputedStyle(document.body).backgroundColor;
  for (let i = 0; i < nos.length; i++) {
    const c = await html2canvas(nos[i], { backgroundColor: fundo, scale: 2 });
    baixar(c.toDataURL("image/png"), `${nome}-${i ? "verso" : "frente"}.png`);
  }
};

// Exporta um único elemento (ex.: cartão do agente) como PNG
export const exportarImagem = async (no, nome) => {
  const { default: html2canvas } = await import("html2canvas");
  const fundo = getComputedStyle(document.body).backgroundColor;
  const c = await html2canvas(no, { backgroundColor: fundo, scale: 2, useCORS: true });
  baixar(c.toDataURL("image/png"), `${nome}.png`);
};

// PDF com campos de formulário (AcroForm) editáveis
export const exportarPdf = async (f, nome) => {
  const { jsPDF } = await import("jspdf");
  const { TextField, CheckBox } = jsPDF.AcroForm;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let n = 0;
  const rot = (t, x, y, s = 8, b = false) => { doc.setFont("courier", b ? "bold" : "normal"); doc.setFontSize(s); doc.text(String(t), x, y); };
  const campo = (x, y, w, v = "", h = 6) => {
    const c = new TextField(); c.fieldName = "c" + n++; c.value = String(v ?? ""); c.fontSize = 9;
    c.x = x; c.y = y; c.width = w; c.height = h; doc.addField(c);
  };
  const caixa = (x, y, on) => {
    const c = new CheckBox(); c.fieldName = "k" + n++; c.x = x; c.y = y; c.width = 5; c.height = 5;
    c.appearanceState = on ? "On" : "Off"; doc.addField(c);
  };
  const par = (r, v, x, y, w) => { rot(r, x, y); campo(x, y + 1.5, w, v); };
  const status = f.status === "Customizado" ? f.statusCustom : f.status;

  rot("M.S.N.R. - FICHA DE AGENTE", 10, 14, 14, true);
  par("Personagem", f.personagem, 10, 22, 100); par("Lv.", f.nivel, 115, 22, 15); par("Jogador", f.jogador, 135, 22, 65);
  par("Classe", f.classe, 10, 36, 60); par("Sangue", f.sangue, 75, 36, 25); par("Status", status, 105, 36, 95);
  par("HP atual", f.hpAtual, 10, 50, 22); par("HP total", f.hpTotal, 37, 50, 22);
  par("Energia atual", f.energiaAtual, 70, 50, 22); par("Energia total", f.energiaTotal, 97, 50, 22);
  rot("ATRIBUTOS", 10, 66, 9, true);
  ["for", "agi", "vig", "int", "pre"].forEach((k, i) => par(k.toUpperCase(), f.atributos[k], 10 + i * 22, 72, 18));
  rot("ESTRESSE", 10, 92, 9, true);
  f.estresse.forEach((on, i) => caixa(10 + i * 8, 94, on));
  rot("PERICIAS (bonus)", 10, 108, 9, true);
  const per = [["Crime", "INT"], ["Atletismo", "FOR"], ["Adestramento", "PRE"], ["Ciências", "INT"], ["Medicina", "INT"], ["Cultura", "PRE"], ["Diplomacia", "PRE"], ["Resistência", "VIG"], ["Furtividade", "AGI"], ["Intimidação", "PRE"], ["Intuição", "PRE"], ["Investigação", "INT"], ["Luta", "FOR"], ["Percepção", "PRE"], ["Pilotagem", "INT"], ["Mira", "AGI"], ["Reflexos", "AGI"], ["Doutrina", "PRE"], ["Tecnologia", "INT"], ["Determinação", "PRE"], ["Engenharia", "INT"], ["Artes", "PRE"], ["Prestidigitação", "AGI"]];
  per.forEach(([p, a], i) => {
    const x = i < 12 ? 10 : 108, y = 114 + (i % 12) * 7;
    campo(x, y, 12, f.bonus[p] ?? "", 5.5); rot(`(${a}) ${p}`, x + 14, y + 4);
  });
  rot("ATAQUES (nome / teste / dano)", 10, 205, 9, true);
  for (let i = 0; i < 5; i++) {
    const a = f.ataques[i] || {}, y = 209 + i * 9;
    campo(10, y, 70, a.nome); campo(85, y, 55, a.teste); campo(145, y, 55, a.dano);
  }

  doc.addPage();
  rot("VERSO", 10, 14, 14, true);
  par("Personagem", f.personagem, 10, 22, 100); par("Origem", f.origem, 115, 22, 85);
  rot("Reabilitado", 10, 40); caixa(35, 36.5, f.reabilitado);
  rot("HABILIDADES (nome / descricao)", 10, 52, 9, true);
  for (let i = 0; i < 6; i++) {
    const h = f.habilidades[i] || {}, y = 56 + i * 9;
    campo(10, y, 50, h.nome); campo(63, y, 137, h.descricao);
  }
  const marca = (it) => (it ? (it.equipado ? "[E] " : "") + it.nome : "");
  rot(`INVENTARIO (max ${f.inventarioMax})`, 10, 120, 9, true);
  for (let i = 0; i < 8; i++) campo(10, 124 + i * 8, 190, marca(f.inventario[i]));
  rot(`MOCHILA (${f.mochilaAtiva ? "ativa" : "desativada"})`, 10, 194, 9, true);
  for (let i = 0; i < 8; i++) campo(10, 198 + i * 8, 190, marca(f.mochila[i]));
  rot("INFORMACOES PESSOAIS", 10, 268, 9, true);
  const idade = calcularIdade(f.nascimento);
  par("Altura (cm)", f.altura, 10, 272, 25); par("Nascimento", f.nascimento, 40, 272, 35);
  par("Idade", idade ?? "", 80, 272, 18); par("Local", f.localNascimento, 103, 272, 97);
  par("Aparencia", f.aparencia, 10, 284, 190);
  doc.addPage();
  rot("VERSO (2)", 10, 14, 14, true);
  rot("BACKSTORY", 10, 24, 9, true);
  const bs = new TextField(); bs.fieldName = "bs"; bs.multiline = true; bs.value = String(f.backstory ?? ""); bs.fontSize = 9;
  bs.x = 10; bs.y = 28; bs.width = 190; bs.height = 110; doc.addField(bs);
  rot("RELACIONAMENTOS (nome / relacao)", 10, 148, 9, true);
  for (let i = 0; i < 10; i++) {
    const r = f.relacionamentos[i] || {}, y = 152 + i * 9;
    campo(10, y, 80, r.nome); campo(95, y, 105, r.relacao);
  }
  doc.save(`${nome}.pdf`);
};
