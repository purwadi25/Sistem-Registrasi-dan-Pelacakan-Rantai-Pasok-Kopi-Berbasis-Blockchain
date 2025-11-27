// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RegistrasiKopi {
    // Struktur data untuk menyimpan informasi kopi
    struct DataKopi {
        uint256 idKopi;
        string namaPetani;
        string lokasiKebun;
        string jenisKopi;
        string tanggalPanen;
        string sertifikasi;
        address pemilikSekarang;
        bool sudahTerdaftar;
    }

    // Daftar semua kopi
    mapping(uint256 => DataKopi) private daftarKopi;

    // Nomor ID berikutnya
    uint256 private idBerikutnya;

    // Constructor
    constructor() {
        idBerikutnya = 1;
    }

    // ======== EVENT ========
    event KopiTerdaftar(uint256 idKopi, string namaPetani, address indexed pemilik);
    event KepemilikanBerpindah(uint256 idKopi, address indexed dari, address indexed ke);
    event AktivitasDicatat(uint256 idKopi, string keterangan, address indexed dilakukanOleh);

    // ===============================================================
    // 🏷️ Fungsi: Registrasi Kopi Baru
    // ===============================================================
    function daftarKopiBaru(
        string memory _namaPetani,
        string memory _lokasiKebun,
        string memory _jenisKopi,
        string memory _tanggalPanen,
        string memory _sertifikasi
    ) public {
        daftarKopi[idBerikutnya] = DataKopi({
            idKopi: idBerikutnya,
            namaPetani: _namaPetani,
            lokasiKebun: _lokasiKebun,
            jenisKopi: _jenisKopi,
            tanggalPanen: _tanggalPanen,
            sertifikasi: _sertifikasi,
            pemilikSekarang: msg.sender, 
            sudahTerdaftar: true
        });

        emit KopiTerdaftar(idBerikutnya, _namaPetani, msg.sender);
        idBerikutnya++;
    }

    // ===============================================================
    // 🔄 Fungsi: Pindah Kepemilikan
    // ===============================================================
    function pindahKepemilikan(uint256 _idKopi, address _pemilikBaru) public {
        require(daftarKopi[_idKopi].sudahTerdaftar, "Data kopi tidak ditemukan");
        require(msg.sender == daftarKopi[_idKopi].pemilikSekarang, "Hanya pemilik saat ini yang dapat memindahkan");

        address pemilikLama = daftarKopi[_idKopi].pemilikSekarang;
        daftarKopi[_idKopi].pemilikSekarang = _pemilikBaru;

        emit KepemilikanBerpindah(_idKopi, pemilikLama, _pemilikBaru);
    }

    // ===============================================================
    // 🔍 Fungsi: Lihat Detail Kopi
    // ===============================================================
    function lihatDetailKopi(uint256 _idKopi)
        public
        view
        returns (
            string memory namaPetani,
            string memory lokasiKebun,
            string memory jenisKopi,
            string memory tanggalPanen,
            string memory sertifikasi,
            address pemilikSekarang
        )
    {
        require(daftarKopi[_idKopi].sudahTerdaftar, "Data kopi tidak ditemukan");
        DataKopi memory kopi = daftarKopi[_idKopi];
        return (
            kopi.namaPetani,
            kopi.lokasiKebun,
            kopi.jenisKopi,
            kopi.tanggalPanen,
            kopi.sertifikasi,
            kopi.pemilikSekarang
        );
    }

    // ===============================================================
    // 🧾 Fungsi: Catat Aktivitas
    // ===============================================================
    function catatAktivitas(uint256 _idKopi, string memory _keterangan) public {
        require(daftarKopi[_idKopi].sudahTerdaftar, "Data kopi tidak ditemukan");
        emit AktivitasDicatat(_idKopi, _keterangan, msg.sender);
    }
}
