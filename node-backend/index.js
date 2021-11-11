let express = require("express"),
  path = require("path"),
  mongoose = require("mongoose"),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  mongoDb = require("./database/db");

mongoose.Promise = global.Promise;
mongoose
  .connect(mongoDb.db, {
    useNewURLParser: true,

    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database successfully connected");
    },
    (error) => {
      console.log("Database error: " + error);
    }
  );

const bookRoutes = require("./routes/book.routes");

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extensions: false,
  })
);
app.use(cors());

// Static directory path
app.use(express.static(path.join(__dirname, "dist/")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

// API Root
app.use("/api", bookRoutes);

//PORT
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Listen on port " + port);
});

// 404 Handler
app.use((req, res, next) => {
  next(createError(404));
});

//errors Handler
app.use((err, req, res, next) => {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
