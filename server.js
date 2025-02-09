const jsonServer = require('json-server')
const express = require('express')
const multer = require('multer')
const path = require('path')
const cors = require('cors')

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Konfigurasi CORS
server.use(cors())

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

// Gunakan middlewares default json-server
server.use(middlewares)

// Serve folder uploads secara statis
server.use('/uploads', express.static('uploads'))

// Handle file upload untuk POST dan PUT
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        upload.single('image')(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message })
            }
            if (req.file) {
                req.body.image = `/uploads/${req.file.filename}`
            }
            next()
        })
    } else {
        next()
    }
})

// Gunakan router json-server
server.use(router)

// Jalankan server
const PORT = 3000
server.listen(PORT, () => {
    console.log(`JSON Server is running on port ${PORT}`)
})