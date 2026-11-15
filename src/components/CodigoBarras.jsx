// Código de barras decorativo, gerado a partir do texto (sempre o mesmo para o mesmo ID).
const gerarBarras = (valor) => {
  let semente = 17;
  for (const letra of String(valor)) {
    semente = (semente * 31 + letra.charCodeAt(0)) >>> 0;
  }
  const barras = [];
  let x = 0;
  for (let i = 0; i < 38; i++) {
    semente = (Math.imul(semente, 1664525) + 1013904223) >>> 0;
    const largura = 1 + ((semente >>> 24) % 3);
    const espaco = 1 + ((semente >>> 16) % 2);
    barras.push({ x, largura });
    x += largura + espaco;
  }
  return { barras, total: x };
};

const CodigoBarras = ({ valor }) => {
  const { barras, total } = gerarBarras(valor);
  return (
    <svg
      className="codigo-barras"
      viewBox={`0 0 ${total} 10`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {barras.map((b) => (
        <rect key={b.x} x={b.x} y="0" width={b.largura} height="10" fill="currentColor" />
      ))}
    </svg>
  );
};

export default CodigoBarras;
