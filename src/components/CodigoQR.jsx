// "QR Code" decorativo (não é legível), gerado a partir do texto.
const LADO = 21;

const CodigoQR = ({ valor, tamanho = 70 }) => {
  let semente = 11;
  for (const letra of String(valor)) {
    semente = (semente * 33 + letra.charCodeAt(0)) >>> 0;
  }

  const emCanto = (x, y) =>
    (x < 8 && y < 8) || (x >= LADO - 8 && y < 8) || (x < 8 && y >= LADO - 8);

  const celulas = [];
  for (let y = 0; y < LADO; y++) {
    for (let x = 0; x < LADO; x++) {
      if (emCanto(x, y)) continue;
      semente = (Math.imul(semente, 1664525) + 1013904223) >>> 0;
      if ((semente >>> 28) % 2) {
        celulas.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
      }
    }
  }

  const canto = (ox, oy) => (
    <g key={`${ox}-${oy}`}>
      <rect x={ox} y={oy} width="7" height="7" />
      <rect x={ox + 1} y={oy + 1} width="5" height="5" fill="var(--surface)" />
      <rect x={ox + 2} y={oy + 2} width="3" height="3" />
    </g>
  );

  return (
    <svg
      className="codigo-qr"
      viewBox={`0 0 ${LADO} ${LADO}`}
      width={tamanho}
      height={tamanho}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {canto(0, 0)}
      {canto(LADO - 7, 0)}
      {canto(0, LADO - 7)}
      {celulas}
    </svg>
  );
};

export default CodigoQR;
