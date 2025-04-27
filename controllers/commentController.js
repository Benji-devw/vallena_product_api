let Comment = require("../models/commentModel");

exports.postComment = (req, res, next) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "You must provide a comment",
        });
    }

    // Create Comment
    const comment = new Comment({
        ...body,
    });
    if (!comment) {
        return res.status(400).json({ success: false, error: err });
    }

    comment
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: comment._id,
                message: "comment created!",
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error,
                message: "comment not created!",
            });
        });
};

exports.getComments = async (req, res) => {
    await Comment.find({}, (err, comments) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!comments.length) {
            return res
                .status(404)
                .json({ success: false, error: `order not found` });
        }
        return res.status(200).json({ success: true, data: comments });
    }).catch((err) => console.log(err));
};

exports.updateComment = async (req, res) => {
    const body = req.body;
    // console.log('body', body)

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "You must provide a body to update",
        });
    }
    Comment.findOne({ _id: req.params.id }, (err, comment) => {
        // console.log('comment', comment)
        if (err) {
            return res.status(404).json({
                err,
                message: "Comment not found! !",
            });
        }
        comment.orderNumber = body.orderNumber;
        comment.idProduct = body.idProduct;
        comment.by = body.by;
        comment.messageTitle = body.messageTitle;
        comment.message = body.message;
        comment.note = body.note;
        comment.dateBuy = body.dateBuy;
        comment.datePost = body.datePost;
        comment.status = body.status;
        comment
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: order._id,
                    message: "Comment updated!",
                });
            })
            .catch((error) => {
                return res.status(404).json({
                    error,
                    message: "Comment not updated!",
                });
            });
    });
};

exports.deleteComment = async (req, res) => {
    await Comment.findOneAndDelete({ _id: req.params.id }, (err, comment) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!comment) {
            return res
                .status(404)
                .json({ success: false, error: `comment not found` });
        }

        return res.status(200).json({ success: true, data: comment });
    }).catch((err) => console.log(err));
};

exports.commentsFilter = async (req, res) => {
    // console.log('req.body', req.body.filters)

    const sortValue = [];

    if (req.body.filters.status === true) {
        sortValue.push("true");
    } else {
        sortValue.push("false");
    }

    function sorting() {
        switch (sortValue[0]) {
            case "true":
                return { status: -1 };
                break;
            case "false":
                return { status: 1 };
                break;
            default:
                break;
        }
    }

    Comment.find()
        .sort(sorting())
        .then((comments) => {
            return res.status(200).json({ success: true, data: comments });
        })
        .catch((err) => console.log("Get products error :", err));
};
