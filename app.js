import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// ตั้งค่า Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBI7EP6DRvPkCfuRKo75HgG2oSi0ciSND8",
    authDomain: "loikrathong-79265.firebaseapp.com",
    databaseURL: "https://loikrathong-79265-default-rtdb.firebaseio.com",
    projectId: "loikrathong-79265",
    storageBucket: "loikrathong-79265.appspot.com",
    messagingSenderId: "539436992765",
    appId: "1:539436992765:web:bf6845ccd72629e1551694",
    measurementId: "G-ZTFN0TD0S2"
};

// เชื่อมต่อ Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const krathongsRef = ref(db, "krathongs");

// ฟังก์ชันลอยกระทง
window.sendKrathong = function () {
    const wishText = document.getElementById("wish").value;
    if (wishText.trim() !== "") {
        push(krathongsRef, { wish: wishText });

        // แสดงป๊อปอัพ
        const popup = document.getElementById("popup");
        popup.style.display = "block";
        setTimeout(() => popup.style.display = "none", 2000);

        document.getElementById("wish").value = ""; // ล้างช่องป้อนข้อความ
    }
};

// ฟังก์ชันเพิ่มกระทงให้ลอยแบบกระจาย
function addKrathong(wish, delay = 0) {
    const krathong = document.createElement("div");
    krathong.className = "krathong";

    // ตั้งค่าตำแหน่งเริ่มต้นแบบสุ่มเพื่อให้กระทงไม่ซ้อนกัน
    const randomTop = Math.floor(Math.random() * 25) + 10; // กระจายตั้งแต่ 10vh ถึง 35vh
    const randomLeft = Math.floor(Math.random() * 80) + 10; // กระจายตำแหน่ง left
    krathong.style.top = `${randomTop}vh`;
    krathong.style.left = `${randomLeft}vw`;
    krathong.style.animation = `floatKrathong 30s linear infinite ${delay}s`;

    // รูปกระทง
    const img = document.createElement("img");
    img.src = "krathong.png";

    // คำอวยพร
    const wishDiv = document.createElement("div");
    wishDiv.className = "wish";
    wishDiv.textContent = wish;

    krathong.appendChild(img);
    krathong.appendChild(wishDiv);
    document.getElementById("river").appendChild(krathong);
}

// ดึงข้อมูลกระทงจาก Firebase และกระจายให้ไม่ติดกัน
onValue(krathongsRef, (snapshot) => {
    const data = snapshot.val();
    document.getElementById("river").innerHTML = ""; // ล้างกระทงเก่า
    if (data) {
        let delay = 0;
        Object.values(data).forEach((entry) => {
            addKrathong(entry.wish, delay);
            delay += 3; // เพิ่มระยะห่างของเวลาให้กระทงออกมาไม่พร้อมกัน
        });
    }
});
