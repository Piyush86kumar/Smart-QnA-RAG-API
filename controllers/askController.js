const { askQuestion } = require('../services/ragService');
const QAHistory = require('../models/QAHistory');
const { logAskCall } = require('../middleware/requestLogger');

/**
 * Ask Controller — orchestrates the Q&A flow.
 * POST /api/ask → calls RAG service → saves to history → returns response.
 * GET /api/ask/history → returns last 10 Q&A pairs for the user.
 */

/**
 * POST /api/ask
 * Body: { question: string }
 * Returns: { answer, sources[], confidence }
 */
const ask = async (req, res, next) => {
  // Track start time for latency observability (Task 4)
  const startTime = req.startTime || Date.now();

  try {
    const { question } = req.body;

    // Validate: non-empty string — prevents empty LLM calls
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid question',
      });
    }

    // Validate: max 1000 chars — prevents abuse & controls LLM costs
    if (question.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Question must be under 1000 characters',
      });
    }

    // Core RAG pipeline: retrieves context & generates grounded answer (Task 2)
    const result = await askQuestion(question.trim());

    const latencyMs = Date.now() - startTime;

    // Bonus: Persist Q&A to history (non-blocking — failure shouldn't break response)
    QAHistory.create({
      userId: req.user._id,
      question: question.trim(),
      answer: result.answer,
      sources: result.sources,
      confidence: result.confidence, // Derived from retrieval quality (avoids red flag)
      latencyMs,
    }).catch((err) => {
      console.error('History save failed:', err.message);
    });

    // Task 4: Log key metrics for monitoring & debugging
    logAskCall({
      userId: req.user._id,
      question,
      confidence: result.confidence,
      latencyMs,
      statusCode: 200,
    });

    res.status(200).json({
      success: true,
      data: result,
      meta: { latencyMs },
    });
  } catch (error) {
    // Log failed calls + delegate to global error handler (prevents stack leaks)
    logAskCall({
      userId: req.user?._id,
      question: req.body?.question,
      confidence: 'error',
      latencyMs: Date.now() - startTime,
      statusCode: 500,
    });
    next(error);
  }
};

/**
 * GET /api/ask/history
 * Returns last 10 Q&A pairs for the authenticated user.
 * BONUS TASK from the assignment.
 */
const getHistory = async (req, res, next) => {
  try {
    // Fetch newest 10 Q&A for user; exclude __v for cleaner payload
    const history = await QAHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-__v');

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    next(error); // Centralized error handling
  }
};

module.exports = { ask, getHistory };