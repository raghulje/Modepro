const router = require("express").Router();
const controller = require("../controllers/navigationController");
const { authenticate, authorize, optionalAuthenticate } = require("../middlewares/auth");

// Public routes (optionally authenticated for CMS)
router.get("/", optionalAuthenticate, controller.getAll);
router.get("/:id", controller.getById);

// Protected routes (require authentication)
router.post("/", authenticate, authorize(['admin', 'super_admin', 'editor']), controller.create);
router.put("/:id", authenticate, authorize(['admin', 'super_admin', 'editor']), controller.update);
router.delete("/:id", authenticate, authorize(['admin', 'super_admin']), controller.delete);

module.exports = router;

