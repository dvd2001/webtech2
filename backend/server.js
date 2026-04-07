let express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    dbConfig = require('./database/db');

let now = new Date();

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected successfully ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds());
}).catch(err => {
    console.log('Could not connect to database : ' + err);
});

const productRpute = require('./routes/product.route');
const userRoute = require('./routes/user.route');
const { server } = require('typescript');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors());
app.use('/', express.static(path.join(__dirname, 'dist/webtech2')));
app.use('/api', productRpute);
app.use('/api', userRoute);

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port + ' Time:' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds());
});