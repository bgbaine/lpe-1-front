import { useEffect, useState } from "react"
import ItemAdmin from "./components/ItemAdmin"
import { Link, useNavigate } from "react-router-dom"
import type { AdminType } from "../utils/AdminType"
import { useAdminStore } from "./context/AdminContext"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminCadAdmin() {
  const [admins, setAdmins] = useState<AdminType[]>([])
  const { admin } = useAdminStore()
  const navigate = useNavigate()

  useEffect(() => {
    // Verifica se o admin tem permissão para acessar esta página
    if (admin.email !== "caio@email.com") {
      navigate("/admin")
      return
    }

    async function getAdmins() {
      const response = await fetch(`${apiUrl}/admins`)
      const dados = await response.json()
      setAdmins(dados)
    }
    getAdmins()
  }, [admin.email, navigate])

  const listaAdmins = admins.map(admin => (
    <ItemAdmin key={admin.id} adminLinha={admin} admins={admins} setAdmins={setAdmins} />
  ))

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administradores do Sistema</h1>
          <p className="text-gray-600">Gerencie os administradores do HelpDesk</p>
        </div>
        {admin.email === "caio@email.com" && (
          <Link to="/admin/novo-admin" 
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors">
            Novo Admin
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Nome do Admin
                </th>
                <th scope="col" className="px-6 py-3">
                  E-mail
                </th>
                <th scope="col" className="px-6 py-3">
                  Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {listaAdmins}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}