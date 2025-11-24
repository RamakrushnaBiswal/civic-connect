const express = require('express')
const router = express.Router()
const feedbackController = require('../controllers/feedbackController')

// GET /api/feedback - list all feedbacks
router.get('/', feedbackController.listFeedbacks)

// POST /api/feedback - create a new feedback (public endpoint)
router.post('/', feedbackController.createFeedback)

// PUT /api/feedback/:id/resolve - mark resolved
router.put('/:id/resolve', feedbackController.resolveFeedback)

// POST /api/feedback/:id/comment - add a comment and optionally mark resolved
router.post('/:id/comment', feedbackController.addComment)

// DELETE /api/feedback/:id - delete feedback
router.delete('/:id', feedbackController.deleteFeedback)

module.exports = router
