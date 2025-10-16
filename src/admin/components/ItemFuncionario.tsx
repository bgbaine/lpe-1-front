import type { FuncionarioType } from "../../utils/FuncionarioType"
import { toast } from "sonner"

type ItemFuncionarioProps = {
    funcionarioLinha: FuncionarioType
    funcionarios: FuncionarioType[]
    setFuncionarios: React.Dispatch<React.SetStateAction<FuncionarioType[]>>
}

const apiUrl = import.meta.env.VITE_API_URL

export default function ItemFuncionario({ funcionarioLinha, funcionarios, setFuncionarios }: ItemFuncionarioProps) {
    
    async function excluirFuncionario() {
        if (!confirm(`Tem certeza que deseja excluir o funcionário "${funcionarioLinha.nome}"?`)) {
            return
        }

        try {
            const response = await fetch(`${apiUrl}/funcionarios/${funcionarioLinha.id}`, {
                method: "DELETE"
            })

            if (response.ok) {
                const funcionariosAtualizados = funcionarios.filter(f => f.id !== funcionarioLinha.id)
                setFuncionarios(funcionariosAtualizados)
                toast.success("Funcionário excluído com sucesso!")
            } else {
                const error = await response.json()
                toast.error(error.erro || "Erro ao excluir funcionário")
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Erro ao excluir funcionário")
        }
    }

    return (
        <tr className="bg-white border-b hover:bg-gray-50 transition-colors duration-200">
            <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {funcionarioLinha.nome.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">{funcionarioLinha.nome}</span>
                </div>
            </td>
            <td className="px-6 py-4 text-gray-900">
                {funcionarioLinha.email}
            </td>
            <td className="px-6 py-4">
                {funcionarioLinha.cargo ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {funcionarioLinha.cargo}
                    </span>
                ) : (
                    <span className="text-gray-400 text-sm">Sem cargo</span>
                )}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={excluirFuncionario}
                        className="text-red-600 hover:text-red-900 text-sm font-medium transition-colors duration-200"
                        title="Excluir funcionário"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    )
}
