import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// aoLogar (opcional): função chamada depois de um login bem-sucedido.
const LoginForm = ({ aoLogar }) => {
  const { login, logado, agente, logout } = useAuth();
  const uid = useId();
  const [id, setId] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const enviar = (evento) => {
    evento.preventDefault();
    const resultado = login(id, senha);
    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }
    setErro("");
    setId("");
    setSenha("");
    if (aoLogar) aoLogar();
  };

  // Já logado: mostra um resumo no lugar do formulário
  if (logado) {
    return (
      <div className="bx-larger login-ativo">
        <h1>LOGIN</h1>
        <p className="login-agente">{agente.nome}</p>
        <p className="login-agente codigo">{agente.id}</p>
        <Link to="/agentes" className="btn">
          acessar
        </Link>
        <button type="button" className="btn btn-fantasma" onClick={logout}>
          sair
        </button>
      </div>
    );
  }

  return (
    <div className="bx-larger">
      <form id="form-login" onSubmit={enviar}>
        <h1>LOGIN</h1>
        <label className="rotulo" htmlFor={`${uid}-id`}>
          id
        </label>
        <input
          type="text"
          name="identificacao"
          id={`${uid}-id`}
          value={id}
          onChange={(e) => setId(e.target.value)}
          autoComplete="username"
          required
        />
        <label className="rotulo" htmlFor={`${uid}-senha`}>
          senha
        </label>
        <input
          type="password"
          name="senha"
          id={`${uid}-senha`}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autoComplete="current-password"
          required
        />
        {erro && (
          <p className="erro-login" role="alert">
            {erro}
          </p>
        )}
        <button id="btn-login" className="btn" type="submit">
          entrar
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
