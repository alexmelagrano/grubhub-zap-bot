exports.config = (app) => {
    app.get('/', (req, res) => res.render('pages/index'))
}
