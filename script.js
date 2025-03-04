document.addEventListener("DOMContentLoaded", () => {
  const suratList = document.getElementById("surat-list");
  const surahDetail = document.getElementById("surah-detail");
  const surahTitle = document.getElementById("surah-title");
  const surahDescription = document.getElementById("surah-description");
  const ayatList = document.getElementById("ayat-list");
  const searchInput = document.getElementById("search-input");

  // Dark mode toggle
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const darkModeToggleMobile = document.getElementById(
    "dark-mode-toggle-mobile"
  );

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);

    // Update both toggle buttons
    const updateText = isDarkMode
      ? '<i class="bi bi-sun"></i> Light Mode'
      : '<i class="bi bi-moon"></i> Dark Mode';
    if (darkModeToggle) darkModeToggle.innerHTML = updateText;
    if (darkModeToggleMobile) darkModeToggleMobile.innerHTML = updateText;
  };

  // Initialize dark mode based on saved preference
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    const lightModeText = '<i class="bi bi-sun"></i> Light Mode';
    if (darkModeToggle) darkModeToggle.innerHTML = lightModeText;
    if (darkModeToggleMobile) darkModeToggleMobile.innerHTML = lightModeText;
  }

  // Add click event listeners to both buttons
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", toggleDarkMode);
  }

  if (darkModeToggleMobile) {
    darkModeToggleMobile.addEventListener("click", toggleDarkMode);
  }
  // REMOVE THIS DUPLICATE DARK MODE CODE BLOCK
  // if (darkModeToggle) {
  //   // Initialize dark mode based on saved preference
  //   if (localStorage.getItem("darkMode") === "true") {
  //     document.body.classList.add("dark-mode");
  //     darkModeToggle.innerHTML = '<i class="bi bi-sun"></i> Light Mode';
  //   }
  //
  //   // Add click event listener
  //   darkModeToggle.addEventListener("click", () => {
  //     document.body.classList.toggle("dark-mode");
  //     const isDarkMode = document.body.classList.contains("dark-mode");
  //     localStorage.setItem("darkMode", isDarkMode);
  //
  //     // Update icon and text
  //     darkModeToggle.innerHTML = isDarkMode
  //       ? '<i class="bi bi-sun"></i> Light Mode'
  //       : '<i class="bi bi-moon"></i> Dark Mode';
  //   });
  // }
  // Add bookmark functionality
  window.bookmarkAyat = (surahNumber, ayatNumber) => {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const bookmark = {
      surahNumber,
      ayatNumber,
      timestamp: new Date().toISOString(),
    };

    // Check if already bookmarked
    const exists = bookmarks.some(
      (b) => b.surahNumber === surahNumber && b.ayatNumber === ayatNumber
    );

    if (!exists) {
      bookmarks.push(bookmark);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      alert("Ayat berhasil disimpan!");
    } else {
      // Remove bookmark if it exists
      bookmarks = bookmarks.filter(
        (b) => !(b.surahNumber === surahNumber && b.ayatNumber === ayatNumber)
      );
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      alert("Bookmark dihapus!");
    }
  };

  // Add search functionality
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const suratCards = document.querySelectorAll("#surat-list .col-md-4");

      suratCards.forEach((card) => {
        const suratName = card
          .querySelector(".card-title")
          .textContent.toLowerCase();
        if (suratName.includes(searchTerm)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  }
  // Fetch all surahs
  async function fetchSurahs() {
    try {
      // Show loading spinner
      suratList.innerHTML = `
        <div class="col-12 loading-spinner">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      `;

      const response = await fetch("https://equran.id/api/v2/surat", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.code === 200) {
        // Clear loading spinner
        suratList.innerHTML = "";

        data.data.forEach((surah) => {
          const card = document.createElement("div");
          card.className = "col-md-4";
          card.innerHTML = `
            <div class="card" onclick="loadSurah(${surah.nomor})">
              <div class="card-body">
                <h5 class="card-title">${surah.namaLatin} (${surah.nama})</h5>
                <p class="card-text text-muted">Ayat: ${surah.jumlahAyat} | Tempat Turun: ${surah.tempatTurun}</p>
              </div>
            </div>
          `;
          suratList.appendChild(card);
        });
      }
    } catch (error) {
      console.error("Error fetching surahs:", error);
      suratList.innerHTML = `
        <div class="col-12 text-center">
          <p class="text-danger">Gagal memuat data. Error: ${error.message}</p>
          <button onclick="fetchSurahs()" class="btn btn-primary mt-2">Coba Lagi</button>
        </div>
      `;
    }
  }
  // Load a specific surah
  window.loadSurah = async (nomor) => {
    try {
      // Show back button
      const backButton = document.getElementById("back-button");
      if (backButton) {
        backButton.style.display = "inline-block";
      }

      // Show loading indicator
      surahDetail.innerHTML = `
          <div class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Memuat surat...</p>
          </div>
        `;
      surahDetail.style.display = "block";
      suratList.style.display = "none";

      const response = await fetch(`https://equran.id/api/v2/surat/${nomor}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.code === 200) {
        const surah = data.data;

        // Restore the original structure
        surahDetail.innerHTML = `
            <h2 id="surah-title" class="mb-3"></h2>
            <p id="surah-description" class="text-muted mb-4"></p>
            <div id="ayat-list"></div>
          `;

        // Re-get elements after restoring structure
        const surahTitle = document.getElementById("surah-title");
        const surahDescription = document.getElementById("surah-description");
        const ayatList = document.getElementById("ayat-list");

        // Update surah details
        surahTitle.textContent = `${surah.namaLatin} (${surah.nama})`;
        surahDescription.innerHTML = surah.deskripsi;

        // Clear previous ayat list
        ayatList.innerHTML = "";

        // Populate ayat list
        surah.ayat.forEach((ayat) => {
          const ayatDiv = document.createElement("div");
          ayatDiv.className = "mb-4 p-4 bg-white rounded shadow-sm";

          // Map qori keys to proper names
          const qoriNames = {
            "01": "Abdullah-Al-Juhany",
            "02": "Abdul-Muhsin-Al-Qasim",
            "03": "Abdurrahman-as-Sudais",
            "04": "Ibrahim-Al-Dossari",
            "05": "Misyari-Rasyid-Al-Afasi",
          };

          const qoriOptions = Object.keys(ayat.audio)
            .map(
              (key) =>
                `<option value="${ayat.audio[key]}">${
                  qoriNames[key] || `Qori ${key}`
                }</option>`
            )
            .join("");

          ayatDiv.innerHTML = `
              <div class="d-flex justify-content-between align-items-center">
                <h6>Ayat ${ayat.nomorAyat}</h6>
                <button class="btn btn-sm btn-outline-primary bookmark-btn" onclick="bookmarkAyat(${surah.nomor}, ${ayat.nomorAyat})">
                  <i class="bi bi-bookmark"></i>
                </button>
              </div>
              <p class="arabic" dir="rtl">${ayat.teksArab}</p>
              <p class="latin text-muted">${ayat.teksLatin}</p>
              <p class="indonesian">${ayat.teksIndonesia}</p>
              <select class="form-select mb-2 qori-selector">
                ${qoriOptions}
              </select>
              <audio controls class="audio-player w-100" preload="none">
                <source src="${ayat.audio["01"]}" type="audio/mpeg">
                Your browser does not support the audio element.
              </audio>
            `;

          const qoriSelector = ayatDiv.querySelector(".qori-selector");
          const audioPlayer = ayatDiv.querySelector(".audio-player");
          qoriSelector.addEventListener("change", (event) => {
            audioPlayer.src = event.target.value;
          });

          ayatList.appendChild(ayatDiv);
        });

        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error("Error loading surah:", error);
      surahDetail.innerHTML = `
          <div class="alert alert-danger">
            <p>Gagal memuat surat. Error: ${error.message}</p>
            <button onclick="loadSurah(${nomor})" class="btn btn-primary mt-2">Coba Lagi</button>
            <button onclick="backToList()" class="btn btn-secondary mt-2 ms-2">
              ← Kembali ke Daftar Surat
            </button>
          </div>
        `;
    }
  };
  // Back to list function
  window.backToList = () => {
    surahDetail.style.display = "none";
    suratList.style.display = "flex";
    window.scrollTo(0, 0);
  };
  // Initial fetch
  fetchSurahs();
});
