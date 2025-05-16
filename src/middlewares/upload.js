const multer = require("multer"); //biblioteca para subir archivos
const path = require("path"); //biblioteca para trabajar con rutas
const fs = require("fs"); //biblioteca para trabajar con el sistema de archivos

const uploadDir = path.join(__dirname, "../uploads"); //directorio donde se guardaran los archivos
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); //crea el directorio si no existe
}

//configuracion de multer para guardar los archivos en el directorio uploads
const storage = multer.diskStorage({ 
  destination: function (req, file, cb) {
    cb(null, uploadDir); //guarda el archivo en el directorio uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); //genera un nombre unico para el archivo
  },
});

//configuracion de multer para guardar los archivos en el directorio uploads
const upload = multer({ storage: storage });

module.exports = upload;
