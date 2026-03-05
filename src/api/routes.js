const express = require('express');
const syncController = require('./controllers/syncController');
const userController = require('./controllers/userController');

const router = express.Router();

router.post('/sync', (req, res) => syncController.executeSync(req, res));
router.get('/sync/status', (req, res) => syncController.getStatus(req, res));

router.get('/users', (req, res) => userController.listUsers(req, res));
router.get('/users/stats/summary', (req, res) => userController.getStats(req, res));
router.get('/users/:email', (req, res) => userController.getUserByEmail(req, res));

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API está online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

module.exports = router;
