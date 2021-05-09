const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const { format } = require('date-fns');
const { ptBR, enUS } = require('date-fns/locale');


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.render('index')
});

app.post('/key', (req, res) => {
    res.json({
        key: process.env.KEY
    })
})

app.get('/date', (req, res) => {
    let dateNow = Date.now();
    let formatDate = format(dateNow, "EEEE, dd 'de' MMMM", {locale: ptBR});
    res.json({
        date: formatDate
    })
})

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`))