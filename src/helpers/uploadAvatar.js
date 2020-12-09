const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { LIMIT_FILE } = process.env

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'assets/uploads/'

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    cb(null, 'avatar-user' + req.user.id + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: LIMIT_FILE,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files with extension jpeg/jpg/png are allowed!'), false)
    }
    return cb(null, true)
  }
})

module.exports = upload.single('avatar')
