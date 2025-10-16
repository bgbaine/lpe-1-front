import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminNovoFuncionario() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        cargo: ""
    })

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        
        // Validações
        if (!formData.nome.trim()) {
            toast.error("Nome é obrigatório")
            return
        }
        
        if (!formData.email.trim()) {
            toast.error("Email é obrigatório")
            return
        }
        
        if (!formData.senha.trim()) {
            toast.error("Senha é obrigatória")
            return
        }
        
        if (formData.senha !== formData.confirmarSenha) {
            toast.error("Senhas não coincidem")
            return
        }
        
        if (formData.senha.length < 6) {
            toast.error("Senha deve ter pelo menos 6 caracteres")
            return
        }

        setLoading(true)

        try {
            const response = await fetch(`${apiUrl}/funcionarios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: formData.nome.trim(),
                    email: formData.email.trim(),
                    senha: formData.senha,
                    cargo: formData.cargo.trim() || undefined
                })
            })

            if (response.ok) {
                toast.success("Funcionário criado com sucesso!")
                navigate("/admin/funcionarios")
            } else {
                const error = await response.json()
                toast.error(error.erro || error.message || "Erro ao criar funcionário")
            }
        } catch (error) {
            console.error("Erro ao criar funcionário:", error)
            toast.error("Erro ao criar funcionário")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                    <Link 
                        to="/admin/funcionarios"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Novo Funcionário</h1>
                </div>
                <p className="text-gray-600">Adicione um novo funcionário ao sistema</p>
            </div>

            <div className="max-w-2xl">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nome */}
                            <div className="md:col-span-2">
                                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Digite o nome completo"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    E-mail *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="funcionario@email.com"
                                    required
                                />
                            </div>

                            {/* Cargo */}
                            <div className="md:col-span-2">
                                <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-2">
                                    Cargo
                                </label>
                                <input
                                    type="text"
                                    id="cargo"
                                    name="cargo"
                                    value={formData.cargo}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: Analista, Técnico, etc."
                                />
                            </div>

                            {/* Senha */}
                            <div>
                                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                                    Senha *
                                </label>
                                <input
                                    type="password"
                                    id="senha"
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                />
                            </div>

                            {/* Confirmar Senha */}
                            <div>
                                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmar Senha *
                                </label>
                                <input
                                    type="password"
                                    id="confirmarSenha"
                                    name="confirmarSenha"
                                    value={formData.confirmarSenha}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Repita a senha"
                                    required
                                />
                            </div>
                        </div>

                        {/* Botões */}
                        <div className="flex items-center justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                            <Link
                                to="/admin/funcionarios"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Criando...
                                    </span>
                                ) : (
                                    "Criar Funcionário"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
