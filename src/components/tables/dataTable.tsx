"use client";

import { ReactNode, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";

const QUANTIDADE_REGISTROS_POR_PAGINA = 15;

/**
 * Configuracao de uma coluna da tabela reutilizavel.
 * Use `renderizar` quando o valor precisar de formatacao visual customizada.
 */
export type ColunaTabelaDados<T> = {
    chave: keyof T | string;
    titulo: string;
    alinhamento?: "start" | "center" | "end";
    renderizar?: (item: T) => ReactNode;
};

/**
 * Props da tabela generica de dados.
 * Use `placeholderFiltro` para customizar o texto do campo de busca.
 * Use `usaClickLinha` e `aoClicarLinha` quando a tela precisar receber o id do registro selecionado.
 */
interface TabelaDadosProps<T> {
    colunas: ColunaTabelaDados<T>[];
    dados: T[];
    carregando: boolean;
    mensagemSemDados: string;
    placeholderFiltro: string;
    usaClickLinha?: boolean;
    aoClicarLinha?: (id: string | number | null) => void;
}

/**
 * Tabela reutilizavel para listagens de cadastros.
 * Use em telas internas sempre que precisar listar registros com colunas configuraveis.
 */
export function TabelaDados<T extends Record<string, unknown>>({
    colunas,
    dados,
    carregando,
    mensagemSemDados,
    placeholderFiltro,
    usaClickLinha = false,
    aoClicarLinha,
}: TabelaDadosProps<T>) {
    const [textoFiltro, setTextoFiltro] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);

    /**
     * Filtra os registros em memoria usando os valores brutos das colunas configuradas.
     * Use para buscas simples sem nova chamada ao back.
     */
    const dadosFiltrados = useMemo(() => {
        const filtroNormalizado = textoFiltro.trim().toLowerCase();

        if (!filtroNormalizado) {
            return dados;
        }

        return dados.filter((item) => colunas.some((coluna) => {
            const valor = item[coluna.chave as keyof T];

            return String(valor ?? "").toLowerCase().includes(filtroNormalizado);
        }));
    }, [colunas, dados, textoFiltro]);

    const totalPaginas = Math.max(1, Math.ceil(dadosFiltrados.length / QUANTIDADE_REGISTROS_POR_PAGINA));
    const paginaAtualLimitada = Math.min(paginaAtual, totalPaginas);
    const indiceInicialPagina = (paginaAtualLimitada - 1) * QUANTIDADE_REGISTROS_POR_PAGINA;

    const dadosPaginados = useMemo(() => {
        return dadosFiltrados.slice(
            indiceInicialPagina,
            indiceInicialPagina + QUANTIDADE_REGISTROS_POR_PAGINA
        );
    }, [dadosFiltrados, indiceInicialPagina]);

    /**
     * Retorna o conteudo que sera exibido na celula.
     * Prioriza renderizacao customizada quando a coluna fornece `renderizar`.
     */
    function obterValorCelula(item: T, coluna: ColunaTabelaDados<T>): ReactNode {
        if (coluna.renderizar) {
            return coluna.renderizar(item);
        }

        const valor = item[coluna.chave as keyof T];
        return valor as ReactNode;
    }

    /**
     * Retorna o id bruto do item quando existir.
     * Use para callbacks de seleção sem expor o objeto inteiro da linha.
     */
    function obterIdLinha(item: T): string | number | null {
        const id = item.id;

        return typeof id === "string" || typeof id === "number" ? parseInt(String(id)) : null;
    }

    function atualizarTextoFiltro(valor: string) {
        setTextoFiltro(valor);
        setPaginaAtual(1);
    }

    function irParaPaginaAnterior() {
        setPaginaAtual((pagina) => Math.max(1, pagina - 1));
    }

    function irParaProximaPagina() {
        setPaginaAtual((pagina) => Math.min(totalPaginas, pagina + 1));
    }

    return (
        <div className="data-table-card">
            <div className="data-table-toolbar">
                <div className="input-group data-table-filter">
                    <span className="input-group-text">
                        <FaSearch />
                    </span>
                    <input
                        type="search"
                        className="form-control"
                        placeholder={placeholderFiltro}
                        value={textoFiltro}
                        onChange={(event) => atualizarTextoFiltro(event.target.value)}
                        disabled={carregando || dados.length === 0}
                    />
                </div>
            </div>

            <div className="data-table-scroll">
                <table className="table data-table align-middle mb-0">
                    <thead>
                        <tr>
                            {colunas.map((coluna) => (
                                <th
                                    key={String(coluna.chave)}
                                    className={`text-${coluna.alinhamento || "start"}`}
                                >
                                    {coluna.titulo}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {carregando && (
                            <tr>
                                <td colSpan={colunas.length} className="text-center py-5">
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Carregando registros...
                                </td>
                            </tr>
                        )}

                        {!carregando && dados.length === 0 && (
                            <tr>
                                <td colSpan={colunas.length} className="text-center text-muted py-5">
                                    {mensagemSemDados}
                                </td>
                            </tr>
                        )}

                        {!carregando && dados.length > 0 && dadosFiltrados.length === 0 && (
                            <tr>
                                <td colSpan={colunas.length} className="text-center text-muted py-5">
                                    Nenhum registro encontrado para o filtro informado.
                                </td>
                            </tr>
                        )}

                        {!carregando && dadosPaginados.map((item, indice) => {
                            const linhaClicavel = usaClickLinha && Boolean(aoClicarLinha);
                            const indiceRegistro = indiceInicialPagina + indice;

                            return (
                                <tr
                                    key={String(item.id || indiceRegistro)}
                                    className={linhaClicavel ? "data-table-row-clickable" : undefined}
                                    onClick={linhaClicavel ? () => aoClicarLinha?.(obterIdLinha(item)) : undefined}
                                    tabIndex={linhaClicavel ? 0 : undefined}
                                    role={linhaClicavel ? "button" : undefined}
                                    onKeyDown={linhaClicavel
                                        ? (event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                aoClicarLinha?.(obterIdLinha(item));
                                            }
                                        }
                                        : undefined}
                                >
                                {colunas.map((coluna) => (
                                    <td
                                        key={`${String(item.id || indiceRegistro)}-${String(coluna.chave)}`}
                                        className={`text-${coluna.alinhamento || "start"}`}
                                    >
                                        {obterValorCelula(item, coluna)}
                                    </td>
                                ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {!carregando && dadosFiltrados.length > 0 && (
                <div className="data-table-pagination">
                    <span>
                        Página {paginaAtualLimitada} de {totalPaginas}
                    </span>

                    <div className="btn-group btn-group-sm">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={irParaPaginaAnterior}
                            disabled={paginaAtualLimitada === 1}
                        >
                            Anterior
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={irParaProximaPagina}
                            disabled={paginaAtualLimitada === totalPaginas}
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
