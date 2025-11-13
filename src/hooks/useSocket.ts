import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const apiUrl = import.meta.env.WEB_SOCKET_API_URL || 'http://localhost:3002'

interface ChatMessage {
  id: string
  ticketId: string
  senderId: string
  senderName: string
  senderType: 'funcionario' | 'admin'
  message: string
  timestamp: Date
  createdAt?: Date
}

export function useSocket(ticketId: string, userId: string, userType: 'funcionario' | 'admin', userName: string) {
  const socketRef = useRef<Socket | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!ticketId || !userId) return

    // Conectar ao socket
    socketRef.current = io(apiUrl)
    
    socketRef.current.on('connect', () => {
      setIsConnected(true)
      // Entrar na sala do ticket
      socketRef.current?.emit('join-ticket', ticketId)
      // Carregar histórico de mensagens
      socketRef.current?.emit('load-messages', ticketId)
    })

    socketRef.current.on('disconnect', () => {
      setIsConnected(false)
    })

    // Carregar mensagens históricas
    socketRef.current.on('messages-loaded', (loadedMessages: any[]) => {
      const formattedMessages = loadedMessages.map(msg => ({
        id: msg.id,
        ticketId: msg.ticketId.toString(),
        senderId: msg.senderId,
        senderName: msg.senderType === userType && msg.senderId === userId ? userName : 
                   msg.senderType === 'admin' ? 'Administrador' : 'Funcionário',
        senderType: msg.senderType,
        message: msg.message,
        timestamp: new Date(msg.createdAt)
      }))
      setMessages(formattedMessages)
      setIsLoading(false)
    })

    // Receber novas mensagens
    socketRef.current.on('new-message', (message: any) => {
      const formattedMessage = {
        id: message.id,
        ticketId: message.ticketId.toString(),
        senderId: message.senderId,
        senderName: message.senderType === userType && message.senderId === userId ? userName : 
                   message.senderType === 'admin' ? 'Administrador' : 'Funcionário',
        senderType: message.senderType,
        message: message.message,
        timestamp: new Date(message.createdAt || message.timestamp)
      }
      setMessages(prev => [...prev, formattedMessage])
    })

    socketRef.current.on('message-error', (error: string) => {
      console.error('Erro ao enviar mensagem:', error)
    })

    return () => {
      socketRef.current?.emit('leave-ticket', ticketId)
      socketRef.current?.disconnect()
    }
  }, [ticketId, userId, userType, userName])

  const sendMessage = (message: string) => {
    if (socketRef.current && message.trim() && isConnected) {
      const chatMessage = {
        id: Date.now().toString(),
        ticketId,
        senderId: userId,
        senderName: userName,
        senderType: userType,
        message: message.trim(),
        timestamp: new Date()
      }
      
      socketRef.current.emit('send-message', chatMessage)
    }
  }

  return { 
    messages, 
    sendMessage, 
    isConnected, 
    isLoading,
    setMessages 
  }
}