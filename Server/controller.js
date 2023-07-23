require("dotenv").config();
const { CONNECTION_STRING } = process.env;

const Sequelize = require("sequelize");

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = {
  seed: (req, res) => {
    sequelize
      .query(
        `
      drop table if exists listItems;
      
      CREATE TABLE listItems(
                id SERIAL PRIMARY KEY,
                text VARCHAR(40) NOT NULL,
                is_completed BOOLEAN
            );
            
        INSERT INTO listItems (text, is_completed)
        VALUES ('Open list', false),
        ('Complete challenge', false),
        ('Review lecture', false);
            `
      )
      .then(() => {
        console.log("DB seeded!");
        res.sendStatus(200);
      })
      .catch((err) => console.log("error seeding DB", err));
  },

  getList: (req, res) => {
    sequelize
      .query(`SELECT * FROM listItems
      ORDER BY id;`)
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      })
      .catch((err) => console.log("error when retrieving the list", err));
  },

  addTask: (req, res) => {
    const { text, isCompleted } = req.body;
    sequelize
      .query(
        `INSERT INTO listItems (text, is_completed)
        VALUES ('${text}', ${isCompleted});
        `
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      })
      .catch((err) => console.log("error when adding a task", err));
  },

  deleteTask: (req, res) => {
    const { id } = req.query;
    if (!id) {
      sequelize
      .query(`
      DELETE
        FROM listItems;
      `).then((dbRes)=> {
        res.status(200).send(dbRes[0]);
      })
      .catch((err) => console.log("error when deleting the entire list", err));
    } else {
      sequelize
        .query(
          `DELETE
        FROM listItems
        WHERE id = ${id};
        `
        )
        .then((dbRes) => {
          res.status(200).send(dbRes[0]);
        })
        .catch((err) => console.log("error when deleting a task", err));
    }
  },

  isCompleteToggle: (req, res) => {
    const { id } = req.params;
    sequelize
      .query(
        `
        UPDATE listItems
        SET is_completed = NOT is_completed
        WHERE id = ${id};
        `
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      })
      .catch((err) => console.log("error when toggling isComplete", err));
  },
};
