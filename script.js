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
let waterGlasses = Number(localStorage.getItem("water")) || 0;

function addWater() {
    waterGlasses++;
    saveWater();
}

function removeWater() {
    if (waterGlasses > 0) {
        waterGlasses--;
    }
    saveWater();
}

function saveWater() {
    localStorage.setItem("water", waterGlasses);

    document.getElementById("waterTracker").innerText =
        waterGlasses + " / 8 Glasses";
}

/* =========================
   👤 PROFILE SYSTEM
========================= */

function saveProfile() {

    let profileName =
        document.getElementById("profileName").value;

    if (profileName === "") {
        alert("Enter Profile Name");
        return;
    }

    let profileData = {
        weight: document.getElementById("weight").value,
        height: document.getElementById("height").value,
        goalWeight: document.getElementById("goalWeight").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value
    };

    localStorage.setItem(
        "profile_" + profileName,
        JSON.stringify(profileData)
    );

    updateProfileList();

    alert("Profile Saved");
}

function updateProfileList() {

    let profileList =
        document.getElementById("profileList");

    profileList.innerHTML =
        '<option value="">Select Profile</option>';

    for (let key in localStorage) {

        if (key.startsWith("profile_")) {

            let profileName =
                key.replace("profile_", "");

            let option =
                document.createElement("option");

            option.value = profileName;
            option.textContent = profileName;

            profileList.appendChild(option);
        }
    }
}

function loadProfile() {

    let profileName =
        document.getElementById("profileList").value;

    if (!profileName) return;

    let profileData =
        JSON.parse(
            localStorage.getItem(
                "profile_" + profileName
            )
        );

    if (!profileData) return;

    document.getElementById("profileName").value =
        profileName;

    document.getElementById("weight").value =
        profileData.weight;

    document.getElementById("height").value =
        profileData.height;

    document.getElementById("goalWeight").value =
        profileData.goalWeight;

    document.getElementById("age").value =
        profileData.age;

    document.getElementById("gender").value =
        profileData.gender;
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

    updateProfileList();

    alert("Profile Deleted");
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

        advice.innerText =
            "Increase healthy calorie intake.";

        diet.innerText =
            "🥛 Milk, 🍌 Banana, 🥚 Eggs";

    } else if (bmi < 25) {

        status.innerText =
            "😊 Healthy";

        advice.innerText =
            "Maintain your healthy lifestyle.";

        diet.innerText =
            "🥗 Fruits, Vegetables, Protein";

    } else {

        status.innerText =
            "⚠️ Overweight";

        advice.innerText =
            "Exercise regularly and reduce sugar.";

        diet.innerText =
            "🥗 Salads, Oats, Lean Protein";
    }

    result.innerText =
        "BMI: " + bmi.toFixed(1);

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

    if (history.length === 0) return;

    let maxWeight =
        Math.max(...history.map(i => i.weight));

    let minWeight =
        Math.min(...history.map(i => i.weight));

    let range =
        maxWeight - minWeight || 1;

    ctx.beginPath();

    history.forEach((item, index) => {

        let x =
            index * 40 + 20;

        let y =
            180 -
            ((item.weight - minWeight) / range) * 150;

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

    document.getElementById(
        "waterTracker"
    ).innerText =
        waterGlasses + " / 8 Glasses";

    updateProfileList();
    loadHistory();
    drawChart();
});

/* =========================
   📱 SERVICE WORKER
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
