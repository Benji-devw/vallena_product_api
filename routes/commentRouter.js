let express = require('express'),
   router = express.Router(),
   commentCtrl = require('../controllers/commentController');

router.get("/", commentCtrl.getComments);
router.get("/:idProduct", commentCtrl.getCommentsByProduct);
router.get("/rating/:idProduct", commentCtrl.getCommentsRating);
router.post("/comment", commentCtrl.postComment);
router.put("/comment/:id", commentCtrl.updateComment);
router.delete('/comment/:id', commentCtrl.deleteComment)

router.post("/commentsfilter", commentCtrl.commentsFilter);

module.exports = router
