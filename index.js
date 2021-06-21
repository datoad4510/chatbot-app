const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const spawn = require("child_process").spawn;
const { send } = require("process");

const path = require("path");

const app = express();

app.use(express.static("public"));

app.use(cors());

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

let pythonProcess;

async function spawnProcess() {
    // promisify so we actually wait for the model to be loaded
    const spawnPromise = new Promise(function (resolve) {
        const pythonProcess = spawn("python", [
            path.join(__dirname, "model-test", "evaluate-model-loop.py"),
        ]);

        // wait for loop to start
        pythonProcess.stdout.once("data", (chunk) => {
            // pipe child process output to server so we can see
            pythonProcess.stdout.pipe(process.stdout);

            resolve(pythonProcess);
        });
    });

    return await spawnPromise;
}

app.post("/evaluate_neural_network", async (req, res) => {
    // if first message, initialize
    if (typeof pythonProcess === "undefined")
        pythonProcess = await spawnProcess();

    const sentence = req.body.sentence;

    // pass sentence to python stdin
    pythonProcess.stdin.write(Buffer.from(`${sentence}\n`));

    // single time event listener, send back data on out
    pythonProcess.stdout.once("data", (data) => {
        const json_to_send_back = {
            answer: parseInt(data),
        };
        res.send(json_to_send_back);
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
