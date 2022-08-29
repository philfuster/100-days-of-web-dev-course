const multer = require("multer");
const uuid = require("uuid").v4;

const storageConfig = multer.diskStorage({
	destination: "product-data/images",
	filename: function (req, file, cb) {
		cb(null, `${uuid()}-${file.originalname}`);
	},
});

const upload = multer({ storage: storageConfig });
// 'image' is the name of the HTML input field.
const configuredMulterMiddleware = upload.single("image");

module.exports = configuredMulterMiddleware;
