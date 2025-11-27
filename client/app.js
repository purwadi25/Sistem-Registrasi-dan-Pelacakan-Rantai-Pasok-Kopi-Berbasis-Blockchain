let web3;
let kontrak;
let akun;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const akunList = await web3.eth.getAccounts();
        akun = akunList[0];
        
        const statusEl = document.getElementById("status");
        if (statusEl) {
            statusEl.innerText = "✅ Terhubung ke akun: " + akun;
        }

        const dataKontrak = await fetch("RegistrasiKopi.json");
        const json = await dataKontrak.json();

        const networkId = await web3.eth.net.getId();
        const alamat = json.networks[networkId]?.address;

        if (!alamat) {
            alert("❌ Kontrak belum dideploy ke jaringan ini!");
            return;
        }

        kontrak = new web3.eth.Contract(json.abi, alamat);
        console.log("Kontrak terhubung di:", alamat); 
        // --- Event Listeners untuk semua tombol ---
        document.getElementById("daftarBtn").addEventListener("click", daftarKopi);
        document.getElementById("lihatBtn").addEventListener("click", lihatDetail);
        document.getElementById("tombolPindah").addEventListener("click", pindahKepemilikan);
        document.getElementById("tombolCatat").addEventListener("click", catatAktivitas);

    } else {
        alert("❌ MetaMask tidak ditemukan. Silakan instal MetaMask terlebih dahulu.");
    }
}); // <-- Penutup 'load' event listener


async function daftarKopi() {
    const nama = document.getElementById("namaPetani").value;
    const lokasi = document.getElementById("lokasiKebun").value;
    const jenis = document.getElementById("jenisKopi").value;
    const tanggal = document.getElementById("tanggalPanen").value;
    const sertif = document.getElementById("sertifikasi").value;

    if (!kontrak) {
        alert("❌ Kontrak belum terhubung!"); 
        return;
    }

    try {
        await kontrak.methods.daftarKopiBaru(nama, lokasi, jenis, tanggal, sertif)
            .send({ from: akun });
        alert("✅ Kopi berhasil didaftarkan!");
    } catch (err) {
        console.error("Error saat mendaftar kopi:", err);
        alert("Gagal mendaftar kopi. Cek console (F12) untuk detail.");
    }
}


async function lihatDetail() {
    const id = document.getElementById("idKopi").value;
    if (!kontrak) {
        alert("❌ Kontrak belum terhubung!");
        return;
    }

    try {
        const hasil = await kontrak.methods.lihatDetailKopi(id).call();
        
        const hasilEl = document.getElementById("hasilDetail");
        if (hasilEl) {
            hasilEl.innerText = `
                Nama Petani: ${hasil.namaPetani}
                Lokasi Kebun: ${hasil.lokasiKebun}
                Jenis Kopi: ${hasil.jenisKopi}
                Tanggal Panen: ${hasil.tanggalPanen}
                Sertifikasi: ${hasil.sertifikasi}
                Pemilik Sekarang: ${hasil.pemilikSekarang}
            `;
        }
    } catch (err) {
        console.error("Error saat melihat detail:", err);
        alert("Gagal mengambil detail. Cek console (F12) untuk detail.");
    }
}

// Fungsi untuk memindahkan kepemilikan
async function pindahKepemilikan() {
    const id = document.getElementById("pindahIdKopi").value;
    const alamatBaru = document.getElementById("pindahAlamatBaru").value;

    if (!id || !alamatBaru) {
        alert("Harap isi ID Kopi dan Alamat Pemilik Baru");
        return;
    }

    if (!kontrak) {
        alert("❌ Kontrak belum terhubung!");
        return;
    }

    try {
        await kontrak.methods.pindahKepemilikan(id, alamatBaru)
            .send({ from: akun }); 

        alert("✅ Kepemilikan kopi berhasil dipindahkan!");
    
    } catch (err) {
        console.error("Error saat memindahkan kepemilikan:", err);
        
        if (err.message && err.message.includes("Hanya pemilik saat ini yang dapat memindahkan")) {
             alert("Gagal: Hanya pemilik saat ini yang dapat memindahkan.");
        } else if (err.message && err.message.includes("Data kopi tidak ditemukan")) {
             alert("Gagal: Data kopi dengan ID tersebut tidak ditemukan.");
        } else {
             alert("Gagal memindahkan kepemilikan. Cek console (F12) untuk detail.");
        }
    }
}


async function catatAktivitas() {
    const id = document.getElementById("catatIdKopi").value;
    const keterangan = document.getElementById("catatKeterangan").value;

    if (!id || !keterangan) {
        alert("Harap isi ID Kopi dan Keterangan Aktivitas");
        return;
    }

    if (!kontrak) {
        alert("❌ Kontrak belum terhubung!");
        return;
    }

    try {
        // Panggil fungsi catatAktivitas di smart contract
        await kontrak.methods.catatAktivitas(id, keterangan)
            .send({ from: akun }); // Kirim transaksi dari akun yang terhubung

        alert("✅ Aktivitas berhasil dicatat!");
    
    } catch (err) {
        // Mengembalikan console.error yang wajar untuk error handling
        console.error("Error saat mencatat aktivitas:", err);
        
        if (err.message && err.message.includes("Data kopi tidak ditemukan")) {
             alert("Gagal: Data kopi dengan ID tersebut tidak ditemukan.");
        } else {
             alert("Gagal mencatat aktivitas. Cek console (F12) untuk detail.");
        }
    }
}