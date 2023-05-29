import express from 'express'
import {addItem, getItem, remItem, getItems, updateItem, addRequest, updateRequest, getRequests} from '../controllers/items.js'

const router = express.Router()

router.post('/', getItems)
router.get('/get', getItem)
router.get('/rem', remItem)
router.post('/add', addItem)
router.post('/update', updateItem)
router.post('/getRequests', getRequests)
router.post('/addRequest', addRequest)
router.post('/updateRequest', updateRequest)

export default router