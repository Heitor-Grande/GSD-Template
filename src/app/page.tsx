"use client";

import { Botao } from "@/components/inputs/button";
import { CampoTexto } from "@/components/inputs/input";
import { ModalCarregamento } from "@/components/modals/loading";
import ModalResposta from "@/components/modals/responseModal";
import { requisitarAPI } from "@/utils/api";
import ModalRecSenha from "./components/modalRecSenha";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowRight,
  FaChartLine,
  FaCheckCircle,
  FaRocket,
  FaShieldAlt,
} from "react-icons/fa";

/**
 * Pagina inicial do template com landing page e login.
 * Use como ponto de partida para apresentar a aplicação e autenticar o usuário.
 */
export default function PaginaInicial() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [modalRecSenhaAberto, setModalRecSenhaAberto] = useState(false);

  /**
   * Envia as credenciais para a API de login e exibe a resposta sem manipular tokens no front.
   */
  async function enviarFormularioLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setLoginMessage("");

    try {
      await requisitarAPI("/api/auth/login", {
        method: "POST",
        body: {
          email,
          password,
        },
      });

      setPassword("");
      router.push("/menuPrincipal");
    } catch (erro) {
      const mensagemErro = erro instanceof Error
        ? erro.message
        : "Não foi possível conectar ao servidor.";

      setLoginMessage(mensagemErro);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <section className="flex min-h-[calc(100vh-3rem)] items-center bg-[radial-gradient(circle_at_85%_20%,rgba(34,211,238,0.24),transparent_28%),linear-gradient(135deg,rgba(13,33,64,0.97),rgba(50,38,112,0.92))] px-4 py-8 lg:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <nav className="mb-12 flex items-center justify-between lg:mb-16">
            <div className="inline-flex items-center gap-3 text-lg font-bold text-white">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <FaRocket />
              </span>
              <span>Template App</span>
            </div>

            <a href="#login" className="rounded-lg border border-white/70 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
              Acessar
            </a>
          </nav>

          <div className="grid items-center gap-10 lg:min-h-[34rem] lg:grid-cols-[1.35fr_0.9fr]">
            <div>
              <span className="mb-4 inline-flex rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-800 shadow-sm">
                Base pronta para novos projetos
              </span>

              <h1 className="mb-4 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
                Comece sua próxima aplicação com uma estrutura pronta para evoluir.
              </h1>

              <p className="mb-6 max-w-2xl text-lg leading-relaxed text-white/70">
                Um template com componentes, modais, hooks e padrões essenciais para acelerar o desenvolvimento de sistemas web.
              </p>

              <div className="flex flex-wrap gap-3">
                <a href="#login" className="inline-flex min-h-12 items-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-700">
                  Entrar agora <FaArrowRight className="ml-2" />
                </a>
                <a href="#recursos" className="inline-flex min-h-12 items-center rounded-lg border border-white/70 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
                  Ver recursos
                </a>
              </div>
            </div>

            <div id="login">
              <div className="rounded-xl border border-white/20 bg-white p-6 shadow-2xl shadow-slate-950/30 sm:p-8">
                <div className="mb-6">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Área segura
                  </p>
                  <h2 className="mb-1 text-2xl font-extrabold text-slate-900">Acesse sua conta</h2>
                  <p className="mb-0 text-slate-500">
                    Entre para continuar usando a plataforma.
                  </p>
                </div>

                <form onSubmit={enviarFormularioLogin}>
                  <CampoTexto
                    id="email"
                    label="E-mail"
                    type="email"
                    value={email}
                    placeholder="email@empresa.com"
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setLoginMessage("");
                    }}
                    disabled={loading}
                    required
                    className="mb-4"
                  />

                  <CampoTexto
                    id="password"
                    label="Senha"
                    type="password"
                    value={password}
                    placeholder="Digite sua senha"
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setLoginMessage("");
                    }}
                    disabled={loading}
                    required
                    className="mb-2"
                  />

                  <div className="mb-4 flex justify-end">
                    <button
                      type="button"
                      className="border-0 bg-transparent p-0 text-sm font-semibold text-blue-700 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => setModalRecSenhaAberto(true)}
                      disabled={loading}
                    >
                      Esqueci minha senha
                    </button>
                  </div>

                  <Botao
                    size="lg"
                    label="Entrar"
                    onClick={() => undefined}
                    disabled={loading}
                    loading={false}
                    variant="primary"
                    type="submit"
                    className="w-full"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16" id="recursos">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-stretch gap-4 md:grid-cols-3">
            <div>
              <div className="h-full rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
                <FaCheckCircle className="h-8 w-8 text-blue-600" />
                <h3 className="mt-4 text-lg font-bold text-slate-900">Componentes reutilizáveis</h3>
                <p className="mb-0 mt-2 text-slate-500">
                  Inputs, botões e modais prontos para padronizar novas telas.
                </p>
              </div>
            </div>

            <div>
              <div className="h-full rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
                <FaShieldAlt className="h-8 w-8 text-emerald-600" />
                <h3 className="mt-4 text-lg font-bold text-slate-900">Base consistente</h3>
                <p className="mb-0 mt-2 text-slate-500">
                  Organização pensada para services, hooks e utils compartilhados.
                </p>
              </div>
            </div>

            <div>
              <div className="h-full rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
                <FaChartLine className="h-8 w-8 text-purple-600" />
                <h3 className="mt-4 text-lg font-bold text-slate-900">Pronto para crescer</h3>
                <p className="mb-0 mt-2 text-slate-500">
                  Estrutura simples para evoluir de protótipo para produto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ModalResposta
        isOpen={Boolean(loginMessage)}
        message={loginMessage}
        onClose={() => setLoginMessage("")}
      />

      <ModalCarregamento
        show={loading}
        text="Validando suas credenciais..."
      />

      <ModalRecSenha
        isOpen={modalRecSenhaAberto}
        onClose={() => setModalRecSenhaAberto(false)}
      />
    </div>
  );
}
