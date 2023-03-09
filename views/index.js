const express = require('express')
const app = express()
const { query } = require('express')
const bodyParser = require('body-parser');

const { connectToDb, getDb } = require('./db')
const { ObjectId } = require('mongodb')

// db connection
let db
connectToDb((err) => {
    if (!err) {
        app.listen(process.env.PORT || 2004, () => {
        })
        db = getDb()
    }
})


// ejs setup
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }));

// for deleting down
app.post('/', (req, res) => {


    db.collection('blogs')
        .deleteOne({ _id: ObjectId(req.query.id) })
        .then(result => {

            res.status(200)

            res.redirect('/');
        })
        .catch(err => {
            res.status(500).json({ error: 'Could not delete task' })
        })


})


app.use(bodyParser.urlencoded({ extended: true }));
app.post('/article', (req, res) => {

    let newBlog = req.body



    db.collection('blogs')
        .insertOne(newBlog)
        .then(result => {


            var stringID = req.body._id.toString()


            res.redirect(`/article?v=${stringID}`)




            res.status(200)

        })
        .catch(err => {
            res.status(500)
            res.send(`Error:${err}`)
        })

})







app.use(bodyParser.urlencoded({ extended: true }));

app.get('/article', (req, res) => {

    db.collection('blogs')
        .findOne({ _id: ObjectId(req.query.v) })
        .then(result => {

            if (result) {
                res.render('article', { articles: result })
            } else {

                res.redirect('/')
            }

        })





})


app.get('/', (req, res) => {

    let blogs = []
    db.collection('blogs')
        .find()
        .sort({ _id: -1 })
        .forEach(blog => blogs.push(blog))
        .then(() => {

            res.render('index', { articles: blogs })
        })
        .catch((err) => {
            res.status(500).json({ error: 'could not get data' })
        })

})

app.get('/new', (req, res) => {
    res.render('new')

})

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/edit', (req, res) => {

    let bh = req.query.id


    let blogs = []
    db.collection('blogs')
        .findOne({ _id: ObjectId(req.query.id) })
        .then(result => {
            res.render('edit', { articles: result })
        })
        .catch((err) => {
            res.status(500).json({ error: 'could not get data' })
        })

    let blog = { title: "Temporary title", description: "Temporary description", markdown: 'Temporary markdown' }


})
app.post('/edit', (req, res) => {

    let updatedTitle = req.body.title
    let updatedDescription = req.body.description
    let updatedMarkdown = req.body.markdown

    db.collection('blogs')

        .findOneAndUpdate({ _id: ObjectId(req.body.id) }, {

            $set: {
                "title": updatedTitle,
                "description": updatedDescription,
                "markdown": updatedMarkdown
            }
        })
        .then(result => {

            res.redirect(`/article?v=${req.body.id}`)
        })
        .catch((err) => {

            res.status(500).json({ error: 'could not get data' })
        })







})


app.get('/features', (req, res) => {
    let updates = []
    db.collection('updates')
        .find()
        .sort({ _id: -1 })
        .forEach(blog => updates.push(blog))
        .then(() => {

            res.render('features', { updates: updates })
        })
        .catch((err) => {
            res.status(500).json({ error: 'could not get data' })
        })
 
})












