import { useEffect, useState } from "react"
import ItemFuncionario from "./components/ItemFuncionario"
import { Link } from "react-router-dom"
import type { FuncionarioType } from "../utils/FuncionarioType"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminCadFuncionario() {
  const [funcionarios, setFuncionarios] = useState<FuncionarioType[]>([])

  useEffect(() => {
    async function getFuncionarios() {
      const response = await fetch(`${apiUrl}/funcionarios`)
      const dados = await response.json()
      setFuncionarios(dados)
    }
    getFuncionarios()
  }, [])

  const listaFuncionarios = funcionarios.map(funcionario => (
    <ItemFuncionario key={funcionario.id} funcionarioLinha={funcionario} funcionarios={funcionarios} setFuncionarios={setFuncionarios} />
  ))

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Funcionários do Sistema</h1>
          <p className="text-gray-600">Gerencie os funcionários do HelpDesk</p>
        </div>
        <Link to="/admin/novo-funcionario" 
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors">
          Novo Funcionário
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Nome do Funcionário
                </th>
                <th scope="col" className="px-6 py-3">
                  E-mail
                </th>
                <th scope="col" className="px-6 py-3">
                  Cargo
                </th>
                <th scope="col" className="px-6 py-3">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {listaFuncionarios}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
