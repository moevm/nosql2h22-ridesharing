
import neo4j from "neo4j-driver";
import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import path from "path";

const app = express();

app.set('view engine', 'ejs');
app.use(logger('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));


const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic('neo4j', '12345678'));
const session = driver.session()

const port = 5000;

const name = 'Some Person';

app.get('/', async (request, response) => {
    let respWrite, respRead;
    try {
        respWrite = await session.run(
            'CREATE (a:Person {name: $name}) RETURN a',
            {name: new Date().toISOString()}
        );

        respRead = await session.run(
            'MATCH (n:Person) RETURN n, labels(n) as l LIMIT 10'
        )


    } catch (error) {
        console.log(error);
    }

    if (respRead) {
        // @ts-ignore
        const str = JSON.stringify(respRead.records.map((record) => record["_fields"][0].properties));
        console.log(str, respRead.records[0]["_fields"]);
        response.send(str);
    } else {
        response.send('Nothing found in db');
    }

});
app.listen(port, () => console.log(`Running on port ${port}`));