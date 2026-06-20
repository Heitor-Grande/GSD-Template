import { consultarBancoDados } from "@/services/database";

export type RegistrarAuditoriaParams = {
    acao: "CRIAR" | "ATUALIZAR" | "EXCLUIR" | string;
    usuarioId?: number | null;
    empresaId?: number | null;
    dadosAntes?: unknown | null;
    dadosDepois?: unknown | null;
    metodoHttp?: string | null;
    rota?: string | null;
};

/**
 * Registra uma alteração de banco na tabela de auditoria sem bloquear a operação principal.
 * Use em rotas POST, PUT e DELETE depois que a mudança for persistida com sucesso.
 */

export async function registrarAuditoria(params: RegistrarAuditoriaParams): Promise<void> {
    try {
        await consultarBancoDados(
            `
                insert into public.auditoria (
                    acao,
                    usuario_id,
                    empresa_id,
                    dados_antes,
                    dados_depois,
                    metodo_http,
                    rota
                )
                values ($1, $2, $3, $4::jsonb, $5::jsonb, $6, $7)
            `,
            [
                params.acao,
                params.usuarioId ?? null,
                params.empresaId ?? null,
                params.dadosAntes ?? null,
                params.dadosDepois ?? null,
                params.metodoHttp ?? null,
                params.rota ?? null,
            ]
        );
    } catch (erro) {
        console.error("Erro ao registrar auditoria:", erro);
    }
}
