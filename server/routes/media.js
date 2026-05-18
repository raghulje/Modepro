const router = require("express").Router();
const controller = require("../controllers/mediaController");
const { authenticate } = require("../middlewares/auth");

// All routes require authentication
router.use(authenticate);

// Media routes
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.delete("/:id", controller.delete);

module.exports = router;

