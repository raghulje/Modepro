const router = require("express").Router();
const controller = require("../controllers/globalSettingsController");

router.get("/", controller.getAll);
router.get("/key/:key", controller.getByKey);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;

