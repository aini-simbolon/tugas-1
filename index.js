const express = require("express");
const expHbs = require("express-handlebars");
const path = require("path");

const app = express();
const port = 3012  ;
  
//connect to database
const {Client} = require("pg");
const { title } = require("process");
const db  = new Client({
    user: "postgres",
    host: "localhost",
    database: "MyDataBase",
    password: "aini",
});

db
.connect()
.then(() => {
    console.log("Connected to PostgreSQL");
})
.catch(() => {
    console.log("Error Connecting to PostgreSQL");
})

const hbs = expHbs.create({
    helpers: {
        increment: (value) => {
            return value + 1;
          },
    },
});



app.use(express.urlencoded({extended: true}));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {

    const data = {
        title: "ini halaman form"
    }
    res.render("form", data);
});


app.get("/tabel", async (req, res) => {

    const query = `SELECT * FROM public."Todos";`;

    const result = await db.query(query);

  console.log(result.rows);
   
    const data = {
        title: "ini halaman tabel",
        todos: result.rows,
    }

    res.render("table", data);
});


app.post("/todos", async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    const query = `INSERT INTO public."Todos"(name, email, message)
               VALUES ('${name}', '${email}', '${message}');`;

                   const result = await db.query(query);
                   res.redirect("/tabel")
});


app.get("/delete-todo/:id", async (req , res) =>  {
    const id = req.params.id;

  const query = `DELETE FROM public."Todos" WHERE id=${id};`;

  await db.query(query);
  res.redirect("/tabel");

});


app.get("/update-todo/:id",async (req, res) => {
    const id = req.params.id;

    const query = `SELECT * FROM public."Todos" WHERE id=${id};`;

   const result = await db.query(query);


    const data = {
        title : "ini halaman update",
        todo : result.rows[0],

    };
    res.render("update", data);
});

app.post("/todos/update/:id", async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    const sendAt = req.body.sendAt ;

    const query = `UPDATE public."Todos"
                   SET name='${name}', email='${email}', message='${message}', sendAt='${sendAt}'
                   WHERE id=${id};`;

       await db.query(query);
                   res.redirect("/tabel")
});




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});