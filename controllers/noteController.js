const Note = require('../models/note.model');

// class handle req.query
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObject = { ...this.queryString };
        const excludeKeys = [
            'sort',
            'page',
            'limit',
            'fields',
        ];
        excludeKeys.forEach((el) => delete queryObject[el]);
        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(
            /\b(gt|gte|lt|lte)\b/,
            (match) => `$${match}`
        );
        this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortOptions = this.queryString.sort
                .split(',')
                .join('');
            this.query = this.query.sort(sortOptions);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fieldOptions = this.queryString.fields
                .split(',')
                .join('');
            this.query = this.query.select(fieldOptions);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page || 1;
        const limit = this.queryString.limit || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

    query() {}
}

// [GET] - Notes
exports.getAllNotes = async (req, res) => {
    try {
        const features = new APIFeatures(
            Note.find(),
            req.query
        )
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const allNotes = await features.query;

        res.status(200).json({
            createdAt: req.createDate,
            lenght: allNotes.length,
            status: 'success',
            data: { notes: allNotes },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: `ERR:  ${err}`,
        });
    }
};

// [GET] - Note
exports.getNotebyId = async (req, res) => {
    try {
        // const note = await Note.findById(req.params.id);
        const note = await Note.findOne({
            _id: req.params.id,
        });

        res.status(200).json({
            status: 'success',
            data: { note },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: `ERR:  ${err}`,
        });
    }
};

// [POST] - Note
exports.createNewNote = async (req, res) => {
    try {
        const newNote = await Note.create(req.body);
        res.status(201).json({
            status: 'success',
            note: newNote,
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: `Invalid data input --- ${err}`,
        });
    }
};

// [PATCH] - Note
exports.updateNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );
        res.status(200).json({
            status: 'success',
            data: { note },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            messsage: `ERR: ${err}`,
        });
    }
};

// [DELETE] - Note
exports.removeNote = async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            messsage: `ERR: ${err}`,
        });
    }
};
