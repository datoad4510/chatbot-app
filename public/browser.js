import { createBalanceMenu, createDateMenu } from "./menu.js";

function createMessage(data) {
    const message = document.createElement("div");
    const darker = data.isAi ? " darker" : "";
    message.className = "container" + darker;

    const img = document.createElement("img");
    img.src = data.imgURL;
    img.alt = "Avatar";
    img.className = data.isAi ? "left" : "right";

    const text = document.createElement("p");
    text.innerText = data.text;

    const timeSpan = document.createElement("span");
    timeSpan.className = data.isAi ? "time-right" : "time-left";
    timeSpan.innerText = data.time;

    // message.append([img, text, timeSpan]);
    message.appendChild(img);
    message.appendChild(text);
    message.appendChild(timeSpan);

    if (data.isAi) {
        if (data.label === 0) {
            message.append(createDateMenu());
        } else if (data.label === 1) {
            message.append(createBalanceMenu());
        }
    }

    if (data.isAi) {
        message.innerData = {
            text: data.inputText,
            label: data.label,
        };
    }

    return message;
}

function addMessage(message) {
    const messagesContainer = document.getElementById("messages");

    messagesContainer.append(message);
}

function addSubmitListener() {
    const submitBtn = document.getElementById("send");

    submitBtn.addEventListener("click", async (e) => {
        const input = document.getElementById("input-text");
        const sentence = input.value;

        // don't refresh
        e.preventDefault();

        // add user message
        addMessage(
            createMessage({
                imgURL: "images/human.jpg",
                text: sentence,
                time: new Date().toLocaleTimeString(),
                isAi: false,
            })
        );

        const inputText = input.value;
        // reset input
        input.value = "";

        const label = await evaluateModel(sentence);
        console.log(label);

        let answer;

        if (label === 0) {
            answer = "თქვენი შეკითხვა არის თარიღთან დაკავშირებული";
        } else if (label === 1) {
            answer = "თქვენი შეკითხვა არის ბალანსთან დაკავშირებული";
        }

        // add ai message
        addMessage(
            createMessage({
                imgURL: "images/bert.png",
                text: answer,
                time: new Date().toLocaleTimeString(),
                isAi: true,
                label: label,
                inputText: inputText,
            })
        );
    });
}

async function evaluateModel(sent) {
    const json_to_send = {
        sentence: sent,
    };

    const answer = await fetch(
        "http://localhost:3000/evaluate_neural_network",
        {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json_to_send),
        }
    )
        .then((response) => response.json())
        .then((data) => {
            console.log("Success:", data);
            return data.answer;
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    return answer;
}

window.onload = () => {
    addSubmitListener();
};
