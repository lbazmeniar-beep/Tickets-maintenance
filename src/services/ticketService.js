// Service d'accès à l'API REST (JSON Server) avec Axios
import axios from 'axios'

// Instance Axios configurée avec l'URL de base de l'API
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000 // 5 secondes maximum d'attente
})

// GET /tickets : retourne le tableau des tickets
export async function getTickets() {
  const reponse = await api.get('/tickets')
  return reponse.data
}
