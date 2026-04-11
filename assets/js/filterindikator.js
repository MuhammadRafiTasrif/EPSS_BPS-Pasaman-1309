function filterIndikator() {
  let inputSearch = document
    .getElementById("searchIndikator")
    .value.toLowerCase();
  let selectDomain = document.getElementById("filterDomain").value;
  let rows = document
    .getElementById("bodyIndikator")
    .getElementsByClassName("item-indikator");

  for (let i = 0; i < rows.length; i++) {
    let textIndikator = rows[i].cells[3].innerText.toLowerCase();
    let domainValue = rows[i].getAttribute("data-domain");

    // Logika Filter: Harus cocok dengan pencarian teks DAN pilihan dropdown
    let matchSearch = textIndikator.includes(inputSearch);
    let matchDomain = selectDomain === "" || domainValue === selectDomain;

    if (matchSearch && matchDomain) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}