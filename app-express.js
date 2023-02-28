
/*
  ============= EXPRESS ==============
  для инициализации используется импорт функции express::
  const express = require('express');
  const app = express();

  начало прослушивания порта с помощью функции listen::
  app.listen(3000, 'localhost', (error) => error ? console.log(error) : console.log('Listeting on port 3000') );

  обработка запросов get/post::
  app.get(path, (req, res) => {})
  app.post(path, (req, res) => {})

  для парсинга тела пост запросов используем express.urlencoded, либо нужно подключить body-parser и задействовать его как мидлвэйр (устаревший способ, советуют юзануть первое)::
  const bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  
  или
  app.use(express.urlencoded({ extended: false }));

  когда приходит на сервер запрос, обработчики срабатывают по очереди от первого к последнему таким образом, как они расположены в коде.
  если необходимо добавить errorPage, в конце после всех возможных роутов ставим app.use и возвращаем страницу ошибки::
  app.use((req, res) => {
    res.status(404).send('404 Not found');
  });

  =============== EJS ================
  ejs - динамическая отрисовка внутри html с помощью <%%> типо как у php
  нужно инсталить модуль `npm i ejs`, импортировать не надо::
  app.set('view engine', 'ejs');

  ( в помощнике парсера пути необходимо поменять расширение на ejs
  const getPath = (to) => path.resolve(__dirname, 'ejs-views', to); )

  внутри самого ejs вывод значения "<%= value =>" ; любое js выражение "<% %>"
  ========== MIDDLEWARE ==============
  мидлвэйр - промежуточный обработчик перед тем как чекать вхождение в роуты (обычно авторизация и т.д)
  подключается через app.use(callback) где третим аргументом калбэка передается функция next() для перехода к следующему мидлвэйру::
  app.use((req, res, next) => {
    console.log('middleware 1');
    next();
  });

  app.use((req, res, next) => {
    console.log('middleware 2');
    next();
  });

  app.use((req, res, next) => {
    console.log('middleware 3');
    next();
  });
  после чего дальше идет по порядку проверка на вхождение в другие роуты
  список самых популярных сторонних мидлваров https://expressjs.com/en/resources/middleware.html ( body-parser один из них )
  ========= STATIC FILES =============
  в ноде установлена защита на прямой доступ к файлам , например к файлам стилей и нельзя просто подключить .css файл из левой папки
  для этого необходимо добавить мидлвэйр-разрешение на подключение статичных файлов по данному пути
  используется функция express.static(path) которая передается в use (как обычный мидлвэйр)::
  app.use(express.static('styles'));

  строчка выше разрешает доступ к всем файлам папки styles
  после чего все файлы доступны в корне сайта, без попадания внутрь папки
  на наглядном примере::
  в папке ./styles лежит main.css
  мы подключили статическую папку styles с помощью мидлвэйра и теперь можем получить доступ к файлу по пути ./main.css из любого html/js/ejs файла
  то есть в ejs пишем <link rel="stylesheet" href="/main.css"> 
  ======== MONGODB MONGOOSE ===========
  в монго внутри баз данных используются collections (аналог таблиц в sql базах)
  для корректной работы с монго и правильной валидации запросов используется модуль mongoose, который полностью управляет всеми подключениями к бд/поиском/изменением данных
  const mongoose = require('mongoose');
  
  для конектра нужно получить ссылку с сайта https://cloud.mongodb.com/v2/63f7adc77a31f14564dc5fb4#/overview 
  далее используем метод mongoose.connect
  для отслеживания успешного запуска или ошибок используем then/catch от промиса::
  const DB = "mongodb+srv://maiklr1ch:<password>@cluster0.ihhhhhv.mongodb.net/<db-name>?retryWrites=true&w=majority";
  mongoose.connect(DB).then(() => console.log('Connected to DB')).catch(err => console.log(err));
  ========== CRUD MONGOOSE ===========
  сначала нужно создать схему(Schema) - описать структуру данных, в которой должна храниться инфа в определенной таблице
  после этого создаем модель, используя данную схему::
  ( в models/post.js )
  const { Schema } = mongoose;

  const postSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    body: String,
    author: String
  }, { timestamps: true });
  const Post = mongoose.model('Post', postSchema);
  module.exports = Post;
  в основном файле сервера:: const Post = require('./models/post');

  для создания экземпляра создается объект импортированного класса и вызывается его метод save для INSERT в бд::
  const post = new Post({
    title: req.body.title,
    body: req.body.text || null,
    author: req.body.author || null
  });
  post
    .save()
    .then(() => res.status(201).send(post))
    .catch(err => {
      res.status(503).send({});
      console.log(err);
    });
  
  для получения из об обращаемся к модели вызывая методы .find() .findById()
  для апдейта или удаления данных соответственно .findByIdAndUpdate() .findByIdAndDelete()::
  1) GET /api/posts
  Post
    .find()
    .sort({ createdAt: -1 }) 
    .then(data => res.send(data))
    .catch(error => res.status(500).send({ error }));
  ( применяется сортировка по дате по убыванию )

  2) GET /api/posts/:id
  Post
    .findById(req.params.id)
    .then(data => res.send(data))
    .catch(error => res.status(500).send({ error }));
  
  3) PUT /api/posts/:id
  const { title, body, author } = req.body;
  Post
    .findByIdAndUpdate(req.params.id, { title, body, author })
    .then(data => res.send(data))
    .catch(error => res.status(500).send({ error }));
  
  4) DELETE /api/posts/:id
  Post
    .findByIdAndDelete(req.params.id)
    .then(data => res.send(data))
    .catch(error => res.status(500).send({ error }));
  =========== DOTENV ==============
  для использования переменных окружения в основной директории проекта создается .env файл с переменными KEY=VALUE
  для чтения подключается dotenv библиотека и вызывается ее метод config
  переменные доступны через process.env.{name}::
  require('dotenv').config();
  чтобы получить переменную PORT ---> process.env.PORT
  =========== CHALK ===============
  для покраски сообщений в консоли используется модуль chalk
  функции называются так же как и цвета, возвращают текст с измененным цветом::
  const chalk = require('chalk');
  console.log(chalk.white.bgGreen(text)) - белые буквы на зеленом фоне
  =================================
*/

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const postRoutes = require('./routes/post-routes');
const contactRoutes = require('./routes/contact-routes');
const apiContactRoutes = require('./routes/api-contact-routes');
const apiPostRoutes = require('./routes/api-post-routes');
const getPath = require('./helpers/get-path');
const chalk = require('chalk');
require('dotenv').config();

const errorMsg = chalk.bgWhite.bold.redBright;
const successMsg = chalk.bgGreenBright.bold;

const app = express();
const port = process.env.PORT || 8000;

mongoose
  .set('strictQuery', true)
  .connect(process.env.MONGO_URL)
  .then(() => console.log(successMsg('Connected to DB')))
  .catch(err => console.log(errorMsg(err)));

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('tiny'));
app.use(express.static('styles'));

app.get('/', (req, res) => {
  res.render(getPath('index.ejs'), { title: 'Home' });
});

app.get('/api', (req, res) => {
  res.render(getPath('api.ejs'), { title: 'API' });
});

app.use(contactRoutes);
app.use(postRoutes);
app.use(apiContactRoutes);
app.use(apiPostRoutes);

app.use((req, res) => {
  const title = 'Error Page';
  res.status(404).render(getPath('error.ejs'), { title, errorCode: 404, errorText: "Page not found" });
});

app.listen(port, (error) => console.log(error ? errorMsg(error) : successMsg(`Listening on port ${port}...`)));
