import express from 'express'
import {getClient, getClientProp, getClients, createClient, updateClient, deleteClient, getClientsByUser, searchClient} from '../controllers/clients.js'

const router = express.Router()

router.get('/getClient', getClient)
router.get('/getClientProp', getClientProp)
router.get('/', getClients)
router.get('/user', getClientsByUser);
router.post('/', createClient)
router.post('/search', searchClient)
router.patch('/:id', updateClient)
router.post('/remClient', deleteClient)

export default router