import { isUserLoggedIn } from "../auth/auth.js";

if (!isUserLoggedIn()) {
  window.location.href = "/cameraApp-show-photo/functions/login-page/index.html";
}

const baseApiLink =
  "https://camera-app-745e7-default-rtdb.firebaseio.com/.json";

const gallery = document.querySelector(".gallery");
const noPhotos = document.querySelector(".no-photos");

const getData = async () => {
  try {
    const response = await fetch(baseApiLink);
    if (!response.ok) {
      throw new Error("خطا در دریافت داده‌ها: " + response.status);
    }
    const data = await response.json();

    if (!data) {
      console.log("دیتابیس خالیه یا داده‌ها موجود نیست");
      noPhotos.classList.remove("hidden");
    } else {
      const objects = Object.values(data)[0];
      const urls = Object.values(objects);

      showImages(urls);
    }
  } catch (error) {
    console.error("مشکل:", error);
  }
};

const showImages = (links) => {
  if (links) {
    links.forEach((link) => {
      gallery.insertAdjacentHTML(
        "beforeend",
        `
      <div class="photo-card">
          <img src="${link.url}" alt="photo">
          <button onclick="deletePhoto('${link.url}')" class="delete-btn">حذف</button>
      </div>
      `,
      );
    });
  } else {
    noPhotos.classList.remove("hidden");
  }
};

window.deletePhoto = async (urlToDelete) => {
  try {
    // دریافت داده‌ها برای پیدا کردن کلید عکس
    const response = await fetch(baseApiLink);
    if (!response.ok) throw new Error("خطا در دریافت داده‌ها");

    const data = await response.json();
    const objects = Object.values(data)[0]; // فرض بر همون ساختار شما
    const objectKey = Object.keys(objects).find(
      (key) => objects[key].url === urlToDelete,
    );

    if (!objectKey) {
      console.log("عکس پیدا نشد!");
      return;
    }

    // مسیر حذف عکس
    const deleteUrl = `https://camera-app-745e7-default-rtdb.firebaseio.com/${Object.keys(data)[0]}/${objectKey}.json`;

    const deleteResponse = await fetch(deleteUrl, {
      method: "DELETE",
    });

    if (!deleteResponse.ok) throw new Error("خطا در حذف عکس");

    // حذف عکس از گالری HTML
    const photoCard = Array.from(document.querySelectorAll(".photo-card")).find(
      (card) => card.querySelector("img").src === urlToDelete,
    );
    if (photoCard) photoCard.remove();

    console.log("عکس با موفقیت حذف شد!");
  } catch (error) {
    console.error("مشکل در حذف عکس:", error);
  }
};

getData();
