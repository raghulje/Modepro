const router = require("express").Router();
const controller = require("../controllers/userController");
const { authenticate } = require("../middlewares/auth");

// All routes require authentication
router.use(authenticate);

// User CRUD operations
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;

