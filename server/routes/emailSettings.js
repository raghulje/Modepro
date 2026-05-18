const router = require("express").Router();
const controller = require("../controllers/emailSettingsController");

router.get("/", controller.getSettings);
router.put("/", controller.updateSettings);
router.post("/test", controller.testConnection);

module.exports = router;

