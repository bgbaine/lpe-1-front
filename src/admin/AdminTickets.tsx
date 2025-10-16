import { useEffect, useState } from "react"
import ItemTicket from './components/ItemTicket'
import type { TicketType } from "../utils/TicketType"
import { useAdminStore } from "./context/AdminContext"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminTickets() {
  const [tickets, setTickets] = useState<TicketType[]>([])
  const { admin } = useAdminStore()

  useEffect(() => {
    async function getTickets() {
      // Monta a URL com os parâmetros de query
      let url = `${apiUrl}/tickets?adminId=${admin.id}&adminEmail=${encodeURIComponent(admin.email)}`
      
      const response = await fetch(url)
      const dados = await response.json()
      setTickets(dados)
    }
    
    if (admin.id) {
      getTickets()
    }
  }, [admin.id, admin.email])

  const listaTickets = tickets.map(ticket => (
    <ItemTicket key={ticket.id} ticket={ticket} tickets={tickets} setTickets={setTickets} />
  ))

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Tickets</h1>
          <p className="text-gray-600">Visualize e gerencie todos os tickets do sistema</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Ticket ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Serviço
                </th>
                <th scope="col" className="px-6 py-3">
                  Funcionário
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Prioridade
                </th>
                <th scope="col" className="px-6 py-3">
                  Data Abertura
                </th>
                <th scope="col" className="px-6 py-3">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {listaTickets}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}