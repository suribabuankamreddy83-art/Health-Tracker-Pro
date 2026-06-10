/* =========================
   🌙 DARK MODE
========================= */
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

/* =========================
   💧 WATER TRACKER
========================= */
let waterGlasses = 0;

function addWater() {
    waterGlasses++;
    updateWater();
}

function removeWater() {
    if (waterGlasses > 0) {
        waterGlasses--;
    }
    updateWater();
}

function updateWater() {
    document.getElementById("waterTracker").innerText =
        waterGlasses + " / 8 Glasses";
}

/* =========================
   🧠 BMI CALCULATOR
========================= */
function calculateBMI() {

    let weight =
        Number(document.getElementById("weight").value);

    let height =
        Number(document.getElementById("height").value) / 100;

    if (!weight || !height) {
        alert("Please enter valid values");
        return;
    }

    let bmi =
        weight / (height * height);

    document.getElementById("bmiValue").innerText =
        bmi.toFixed(1);

    let status =
        document.getElementById("bmiStatus");

    let result =
        document.getElementById("result");

    let advice =
        document.getElementById("advice");

    let diet =
        document.getElementById("dietPlan");

    let healthyRange =
        document.getElementById("healthyRange");

    if (bmi < 18.5) {

        status.innerText =
            "😟 Underweight";

        result.innerText =
            "BMI: " + bmi.toFixed(1);

        advice.innerText =
            "Increase healthy calorie intake.";

        diet.innerText =
            "🥛 Milk, 🍌 Banana, 🥚 Eggs";

    }

    else if (bmi < 25) {

        status.innerText =
            "😊 Healthy";

        result.innerText =
            "BMI: " + bmi.toFixed(1);

        advice.innerText =
            "Maintain your healthy lifestyle.";

        diet.innerText =
            "🥗 Fruits, Vegetables, Protein";

    }

    else {

        status.innerText =
            "⚠️ Overweight";

        result.innerText =
            "BMI: " + bmi.toFixed(1);

        advice.innerText =
            "Exercise regularly and reduce sugar.";

        diet.innerText =
            "🥗 Salads, Oats, Lean Protein";
    }

    let minWeight =
        18.5 * height * height;

    let maxWeight =
        24.9 * height * height;

    healthyRange.innerText =
        "Healthy Weight Range: " +
        minWeight.toFixed(1) +
        "kg - " +
        maxWeight.toFixed(1) +
        "kg";

    saveHistory(weight, bmi);

    drawChart();
}
/* =========================
   📋 HISTORY
========================= */

function saveHistory(weight, bmi) {

    let history =
        JSON.parse(
            localStorage.getItem("weights")
        ) || [];

    history.push({
        weight: weight,
        bmi: bmi.toFixed(1),
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem(
        "weights",
        JSON.stringify(history)
    );

    loadHistory();
}

function loadHistory() {

    let history =
        JSON.parse(
            localStorage.getItem("weights")
        ) || [];

    let historyList =
        document.getElementById("history");

    historyList.innerHTML = "";

    history.forEach(item => {

        let li =
            document.createElement("li");

        li.textContent =
            item.date +
            " | Weight: " +
            item.weight +
            "kg | BMI: " +
            item.bmi;

        historyList.appendChild(li);
    });
}

function clearHistory() {

    localStorage.removeItem("weights");

    document.getElementById("history").innerHTML = "";

    drawChart();

    alert("History Cleared");
}

/* =========================
   📈 CHART
========================= */

function drawChart() {

    let canvas =
        document.getElementById("weightChart");

    let ctx =
        canvas.getContext("2d");

    let history =
        JSON.parse(
            localStorage.getItem("weights")
        ) || [];

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (history.length === 0) {
        return;
    }

    ctx.beginPath();

    history.forEach((item, index) => {

        let x =
            index * 40 + 20;

        let y =
            200 - item.weight;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.strokeStyle = "#00e5ff";
    ctx.lineWidth = 3;
    ctx.stroke();
}

/* =========================
   👤 PROFILE SYSTEM
========================= */

function loadProfile() {

    let profileName =
        document.getElementById("profileList").value;

    if (!profileName) return;

    document.getElementById("profileName").value =
        profileName;
}

function deleteProfile() {

    let profileName =
        document.getElementById("profileName").value;

    if (profileName === "") {
        alert("Enter Profile Name");
        return;
    }

    localStorage.removeItem(
        "profile_" + profileName
    );

    alert("Profile Deleted");
}
/* =========================
   🔔 NOTIFICATIONS
========================= */

function enableNotifications() {

    if (!("Notification" in window)) {
        alert("Notifications not supported");
        return;
    }

    Notification.requestPermission()
        .then(permission => {

            if (permission === "granted") {

                document.getElementById(
                    "notifStatus"
                ).innerText =
                    "Notifications: ON";

                alert("Notifications Enabled");
            }
        });
}

let reminderInterval = null;

function startWaterReminder() {

    if (Notification.permission !== "granted") {
        alert("Enable notifications first");
        return;
    }

    reminderInterval =
        setInterval(() => {

            new Notification(
                "💧 Water Reminder",
                {
                    body: "Time to drink water!"
                }
            );

        }, 3600000);

    alert("Water Reminder Started");
}

function stopWaterReminder() {

    clearInterval(reminderInterval);

    document.getElementById(
        "notifStatus"
    ).innerText =
        "Notifications: OFF";

    alert("Water Reminder Stopped");
}

/* =========================
   🚀 LOAD APP
========================= */

window.addEventListener("load", () => {

    let savedTheme =
        localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add(
            "dark-mode"
        );
    }

    loadHistory();
    drawChart();
});

/* =========================
   📱 PWA SERVICE WORKER
========================= */

if ("serviceWorker" in navigator) {

    navigator.serviceWorker
        .register("sw.js")
        .then(() => {

            console.log(
                "Service Worker Registered"
            );

        })
        .catch(error => {

            console.log(error);

        });
}

