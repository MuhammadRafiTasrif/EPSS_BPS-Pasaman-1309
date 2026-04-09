function searchMateri() {
    let input = document.getElementById('docSearch').value.toLowerCase();
    let cards = document.getElementsByClassName('materi-item');
    
    for (let i = 0; i < cards.length; i++) {
        let title = cards[i].querySelector('h6').innerText.toLowerCase();
        let desc = cards[i].querySelector('p').innerText.toLowerCase();
        
        if (title.includes(input) || desc.includes(input)) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}

function searchMateri() {
    let input = document.getElementById('docSearch').value.toLowerCase();
    let rows = document.getElementById('materiList').getElementsByClassName('materi-item');
    
    for (let i = 0; i < rows.length; i++) {
        let textContent = rows[i].textContent.toLowerCase();
        if (textContent.includes(input)) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

function viewDoc(driveUrl, title) {
    // Mengubah link biasa menjadi link preview/embed
    // Contoh link drive: https://drive.google.com/file/d/ID_FILE/view
    // Harus diubah sedikit agar bisa di-embed
    let embedUrl = driveUrl.replace('/view', '/preview');
    
    document.getElementById('driveFrame').src = embedUrl;
    document.getElementById('documentTitle').innerText = title;
    $('#previewModal').modal('show');
}


function filterIndikator() {
    let inputSearch = document.getElementById("searchIndikator").value.toLowerCase();
    let selectDomain = document.getElementById("filterDomain").value;
    let rows = document.getElementById("bodyIndikator").getElementsByClassName("item-indikator");

    for (let i = 0; i < rows.length; i++) {
        let textIndikator = rows[i].cells[3].innerText.toLowerCase();
        let domainValue = rows[i].getAttribute("data-domain");

        // Logika Filter: Harus cocok dengan pencarian teks DAN pilihan dropdown
        let matchSearch = textIndikator.includes(inputSearch);
        let matchDomain = (selectDomain === "" || domainValue === selectDomain);

        if (matchSearch && matchDomain) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}


async function updateStatusOtomatis() {
    const apiLink = "https://script.google.com/macros/s/AKfycbzSe0WpkYSAQDO-CYYqom9ukzWiyX6hrISn-jIpptAKmFf1Ao9g_zapOK_sDgwPm7WiEg/exec";
    
    try {
        const response = await fetch(apiLink);
        const data = await response.json();

        // Loop untuk update tampilan tabel
        for (let key in data) {
            let status = data[key];
            let baris = document.getElementById(key); // Kita beri ID pada <tr> tabel

            if (status === "Terisi") {
                baris.classList.add("is-uploaded");
                baris.querySelector(".status-label").innerHTML = '<i class="feather icon-check-circle text-c-green"></i>';
            }
        }
    } catch (error) {
        console.log("Gagal mengambil data Drive:", error);
    }
}

// Jalankan fungsi saat halaman dibuka
window.onload = updateStatusOtomatis;