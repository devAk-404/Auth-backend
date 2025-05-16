const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(morgan('dev'))

app.use('/', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});