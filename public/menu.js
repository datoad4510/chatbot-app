const server = "https://neural-network123.herokuapp.com";

async function insertLabeledSentence(data) {
    return fetch(`${server}/add_item`, {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.text())
        .catch((error) => {
            console.error("Error:", error);
        });
}

function showBalance() {
    const showBalance = document.createElement("div");
    showBalance.className = "menu-item-container";

    const showBalanceBtn = document.createElement("button");
    showBalanceBtn.className = "menu-item";
    showBalanceBtn.innerText = "ბალანსის შემოწმება";
    showBalanceBtn.addEventListener("click", () => {
        if (showBalanceBtn.nextElementSibling) return;
        const balance = document.createElement("span");
        balance.innerText = "თქვენს ბალანსზე არის 5.00 ლარი";
        showBalanceBtn.after(balance);
    });
    showBalance.append(showBalanceBtn);
    return showBalance;
}

function fillBalance() {
    const fillBalance = document.createElement("div");
    fillBalance.className = "menu-item-container";
    const fillBalanceBtn = document.createElement("button");
    fillBalanceBtn.className = "menu-item";
    fillBalanceBtn.href = "#";
    fillBalanceBtn.innerText = "ბალანსის შევსება";

    fillBalanceBtn.addEventListener("click", () => {
        if (fillBalanceBtn.nextElementSibling) return;
        const label = document.createElement("label");
        label.innerText = "შეიყვანეთ შესავსები რაოდენობა:";
        const input = document.createElement("input");
        input.type = "number";
        fillBalanceBtn.after(input);
        fillBalanceBtn.after(label);
    });

    fillBalance.append(fillBalanceBtn);

    return fillBalance;
}

function transferMoney() {
    const transferMoney = document.createElement("div");
    transferMoney.className = "menu-item-container";
    const transferMoneyBtn = document.createElement("button");
    transferMoneyBtn.className = "menu-item";
    transferMoneyBtn.href = "#";
    transferMoneyBtn.innerText = "ფულის გადარიცხვა";

    transferMoneyBtn.addEventListener("click", () => {
        if (transferMoneyBtn.nextElementSibling) return;

        const label2 = document.createElement("label");
        label2.innerText = "გადასარიცხი რაოდენობა:";
        const input2 = document.createElement("input");
        input2.type = "number";
        transferMoneyBtn.after(input2);
        transferMoneyBtn.after(label2);

        const label1 = document.createElement("label");
        label1.innerText = "მიმღების ანგარიშის ნომერი:";
        const input1 = document.createElement("input");
        input1.type = "number";
        transferMoneyBtn.after(input1);
        transferMoneyBtn.after(label1);
    });

    transferMoney.append(transferMoneyBtn);

    return transferMoney;
}

function checkAnswer() {
    const checkAnswer = document.createElement("div");
    checkAnswer.className = "menu-item-container";
    const correctAnswerBtn = document.createElement("button");
    correctAnswerBtn.className = "menu-item";
    correctAnswerBtn.classList.add("correct");
    correctAnswerBtn.innerText = "ეს ვიგულისხმე";

    const input = document.getElementById("input-text");

    correctAnswerBtn.addEventListener("click", async () => {
        const lastMessage = document.getElementById("messages").lastChild;

        const data = lastMessage.innerData;
        await insertLabeledSentence(data);
    });
    const wrongAnswerBtn = document.createElement("button");
    wrongAnswerBtn.className = "menu-item";
    wrongAnswerBtn.classList.add("incorrect");
    wrongAnswerBtn.innerText = "სხვა რამე ვიგულისხმე";

    wrongAnswerBtn.addEventListener("click", () => {
        if (wrongAnswerBtn.nextElementSibling) return;

        const optionsContainer = document.createElement("div");
        optionsContainer.className = "options-container";

        const option1 = document.createElement("button");
        option1.className = "menu-item";
        option1.href = "#";
        option1.innerText = "ბალანსის შესახებ მაქვს მოთხოვნა";

        option1.addEventListener("click", async () => {
            const lastMessage = document.getElementById("messages").lastChild;

            const menuContainer =
                lastMessage.getElementsByClassName("menu-container")[0];

            const data = lastMessage.innerData;
            data.label = 1;

            await insertLabeledSentence(data);

            menuContainer.remove();

            lastMessage.appendChild(createBalanceMenu());
        });

        const option2 = document.createElement("button");
        option2.className = "menu-item";
        option2.href = "#";
        option2.innerText = "თარიღის შესახებ მაქვს მოთხოვნა";

        option2.addEventListener("click", async () => {
            const lastMessage = document.getElementById("messages").lastChild;
            const menuContainer =
                lastMessage.getElementsByClassName("menu-container")[0];

            const data = lastMessage.innerData;
            data.label = 0;

            await insertLabeledSentence(data);

            menuContainer.remove();

            lastMessage.appendChild(createDateMenu());
        });

        optionsContainer.append(option1);
        optionsContainer.append(option2);

        wrongAnswerBtn.after(optionsContainer);
    });

    checkAnswer.append(correctAnswerBtn);
    checkAnswer.append(wrongAnswerBtn);

    return checkAnswer;
}

// creates menu after node
export function createBalanceMenu() {
    const menuContainer = document.createElement("div");
    menuContainer.className = "menu-container";

    menuContainer.append(showBalance());
    menuContainer.append(fillBalance());
    menuContainer.append(transferMoney());
    menuContainer.append(checkAnswer());

    return menuContainer;
}

function showPromotions() {
    const promotions = document.createElement("div");
    promotions.className = "menu-item-container";
    const promotionsBtn = document.createElement("button");
    promotionsBtn.className = "menu-item";
    promotionsBtn.innerText = "აქციების თარიღების დათვალიერება";

    promotionsBtn.addEventListener("click", () => {
        if (promotionsBtn.nextElementSibling) return;

        const list = document.createElement("ul");

        const item1 = document.createElement("li");
        item1.innerText =
            "შემდეგ კვირაში ბანკომატიდან ჩარიცხვის საკომისიო გადასახადები არ იქნება.";
        const item2 = document.createElement("li");
        item2.innerText = "3 მარტს სესხებზე 5%-იანი ფასდაკლება!";

        list.append(item1, item2);

        promotionsBtn.after(list);
    });

    promotions.append(promotionsBtn);

    return promotions;
}

function showTransactions() {
    const transactions = document.createElement("div");
    transactions.className = "menu-item-container";
    const transactionsBtn = document.createElement("button");
    transactionsBtn.className = "menu-item";
    transactionsBtn.innerText = "ტრანზაქციების თარიღების დათვალიერება";

    transactionsBtn.addEventListener("click", () => {
        if (transactionsBtn.nextElementSibling) return;

        const list = document.createElement("ul");

        const item1 = document.createElement("li");
        item1.innerText = "2 ივნისს სერგო ჯანიანმა გადმოგირიცხათ 15 ლარი";
        const item2 = document.createElement("li");
        item2.innerText = "5 ივნისს სერგო ჯანიანს გადაურიცხეთ 30 ლარი";

        list.append(item1, item2);

        transactionsBtn.after(list);
    });

    transactions.append(transactionsBtn);

    return transactions;
}

export function createDateMenu() {
    const menuContainer = document.createElement("div");
    menuContainer.className = "menu-container";

    menuContainer.append(showPromotions());
    menuContainer.append(showTransactions());
    menuContainer.append(checkAnswer());

    return menuContainer;
}
