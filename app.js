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

        // แสดงป๊อปอัพแจ้งเตือน
        const popup = document.getElementById("popup");
        popup.style.display = "block";
        setTimeout(() => popup.style.display = "none", 2000);

        document.getElementById("wish").value = ""; // ล้างช่องป้อนข้อความ
    }
};

// ฟังก์ชันเพิ่มกระทงให้ลอยแบบกระจายตัว
function addKrathong(wish, delay = 0, positionIndex) {
    const krathong = document.createElement("div");
    krathong.className = "krathong";

    // กระจายตำแหน่งกระทงให้ไม่ซ้ำกัน
    const topPositions = [12, 15, 18, 21, 24, 27, 30]; // ระดับความสูงของกระทง
    const topPosition = topPositions[positionIndex % topPositions.length];

    krathong.style.top = `${topPosition}vh`;
    krathong.style.left = "-100px";
    krathong.style.animation = `floatKrathong 30s linear infinite ${delay}s`;

    const img = document.createElement("img");
    img.src = "krathong.png"; // เปลี่ยนเป็นพาธรูปกระทงของคุณ

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
    document.getElementById("river").innerHTML = ""; // ลบกระทงเก่าทั้งหมดก่อนเพิ่มใหม่
    if (data) {
        let index = 0;
        Object.values(data).forEach((entry, i) => {
            addKrathong(entry.wish, i * 2, index);
            index++;
        });
    }
});
