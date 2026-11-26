SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS kunjungan_profil;
DROP TABLE IF EXISTS riwayat_pencarian;
DROP TABLE IF EXISTS perbandingan_detail;
DROP TABLE IF EXISTS perbandingan;
DROP TABLE IF EXISTS favorit;
DROP TABLE IF EXISTS ulasan;
DROP TABLE IF EXISTS promosi;
DROP TABLE IF EXISTS lembaga_mapel;
DROP TABLE IF EXISTS mata_pelajaran;
DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS lembaga;
DROP TABLE IF EXISTS siswa;
DROP TABLE IF EXISTS user;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE user (
    user_id       INT             NOT NULL AUTO_INCREMENT,
    first_name    VARCHAR(50)     NOT NULL,
    last_name     VARCHAR(50)     NOT NULL,
    email         VARCHAR(100)    NOT NULL,
    password_hash VARCHAR(255)    NOT NULL,
    role          ENUM('siswa','lembaga','admin') NOT NULL,
    created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_user        PRIMARY KEY (user_id),
    CONSTRAINT uq_user_email  UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE siswa (
    siswa_id   INT          NOT NULL AUTO_INCREMENT,
    user_id    INT          NOT NULL,
    no_telepon VARCHAR(20),
    kota       VARCHAR(100),
    jenjang    VARCHAR(50),
    CONSTRAINT pk_siswa      PRIMARY KEY (siswa_id),
    CONSTRAINT uq_siswa_user UNIQUE (user_id),
    CONSTRAINT fk_siswa_user FOREIGN KEY (user_id) REFERENCES user (user_id)
                                 ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE lembaga (
    lembaga_id        INT          NOT NULL AUTO_INCREMENT,
    user_id           INT          NOT NULL,
    nama_lembaga      VARCHAR(150) NOT NULL,
    kota              VARCHAR(100) NOT NULL,
    kecamatan         VARCHAR(100),
    alamat_lengkap    TEXT,
    no_telepon        VARCHAR(20),
    email_lembaga     VARCHAR(100),
    deskripsi         TEXT,
    logo_url          VARCHAR(255),
    status_verifikasi ENUM('pending','verified','rejected') NOT NULL DEFAULT 'pending',
    verified_at       DATETIME,
    CONSTRAINT pk_lembaga        PRIMARY KEY (lembaga_id),
    CONSTRAINT uq_lembaga_user   UNIQUE (user_id),
    CONSTRAINT fk_lembaga_user   FOREIGN KEY (user_id) REFERENCES user (user_id)
                                     ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE admin (
    admin_id INT NOT NULL AUTO_INCREMENT,
    user_id  INT NOT NULL,
    CONSTRAINT pk_admin      PRIMARY KEY (admin_id),
    CONSTRAINT uq_admin_user UNIQUE (user_id),
    CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES user (user_id)
                                 ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE mata_pelajaran (
    mapel_id   INT          NOT NULL AUTO_INCREMENT,
    nama_mapel VARCHAR(100) NOT NULL,
    CONSTRAINT pk_mapel PRIMARY KEY (mapel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE lembaga_mapel (
    lembaga_id      INT NOT NULL,
    mapel_id        INT NOT NULL,
    harga_per_bulan INT NOT NULL DEFAULT 0,
    CONSTRAINT pk_lembaga_mapel PRIMARY KEY (lembaga_id, mapel_id),
    CONSTRAINT chk_harga        CHECK (harga_per_bulan >= 0),
    CONSTRAINT fk_lm_lembaga    FOREIGN KEY (lembaga_id) REFERENCES lembaga (lembaga_id)
                                     ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_lm_mapel      FOREIGN KEY (mapel_id)  REFERENCES mata_pelajaran (mapel_id)
                                     ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE promosi (
    promosi_id    INT          NOT NULL AUTO_INCREMENT,
    lembaga_id    INT          NOT NULL,
    judul         VARCHAR(150) NOT NULL,
    deskripsi     TEXT,
    tanggal_mulai DATE         NOT NULL,
    tanggal_akhir DATE         NOT NULL,
    status        ENUM('draft','aktif','berakhir') NOT NULL DEFAULT 'draft',
    CONSTRAINT pk_promosi          PRIMARY KEY (promosi_id),
    CONSTRAINT chk_tanggal_promosi CHECK (tanggal_akhir >= tanggal_mulai),
    CONSTRAINT fk_promosi_lembaga  FOREIGN KEY (lembaga_id) REFERENCES lembaga (lembaga_id)
                                       ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ulasan (
    ulasan_id  INT      NOT NULL AUTO_INCREMENT,
    siswa_id   INT      NOT NULL,
    lembaga_id INT      NOT NULL,
    rating     TINYINT  NOT NULL,
    komentar   TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_ulasan         PRIMARY KEY (ulasan_id),
    CONSTRAINT uq_ulasan         UNIQUE (siswa_id, lembaga_id),
    CONSTRAINT chk_rating        CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT fk_ulasan_siswa   FOREIGN KEY (siswa_id)   REFERENCES siswa (siswa_id)
                                     ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ulasan_lembaga FOREIGN KEY (lembaga_id) REFERENCES lembaga (lembaga_id)
                                     ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE favorit (
    favorit_id     INT      NOT NULL AUTO_INCREMENT,
    siswa_id       INT      NOT NULL,
    lembaga_id     INT      NOT NULL,
    ditambahkan_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_favorit         PRIMARY KEY (favorit_id),
    CONSTRAINT uq_favorit         UNIQUE (siswa_id, lembaga_id),
    CONSTRAINT fk_favorit_siswa   FOREIGN KEY (siswa_id)   REFERENCES siswa (siswa_id)
                                      ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_favorit_lembaga FOREIGN KEY (lembaga_id) REFERENCES lembaga (lembaga_id)
                                      ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE perbandingan (
    perbandingan_id INT      NOT NULL AUTO_INCREMENT,
    siswa_id        INT      NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_perbandingan       PRIMARY KEY (perbandingan_id),
    CONSTRAINT fk_perbandingan_siswa FOREIGN KEY (siswa_id) REFERENCES siswa (siswa_id)
                                         ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE perbandingan_detail (
    perbandingan_id INT NOT NULL,
    lembaga_id      INT NOT NULL,
    CONSTRAINT pk_perbandingan_detail PRIMARY KEY (perbandingan_id, lembaga_id),
    CONSTRAINT fk_pd_perbandingan     FOREIGN KEY (perbandingan_id) REFERENCES perbandingan (perbandingan_id)
                                          ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_pd_lembaga          FOREIGN KEY (lembaga_id) REFERENCES lembaga (lembaga_id)
                                          ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE riwayat_pencarian (
    riwayat_id   INT          NOT NULL AUTO_INCREMENT,
    siswa_id     INT          NOT NULL,
    keyword      VARCHAR(255),
    filter_kota  VARCHAR(100),
    filter_mapel VARCHAR(100),
    dicari_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_riwayat       PRIMARY KEY (riwayat_id),
    CONSTRAINT fk_riwayat_siswa FOREIGN KEY (siswa_id) REFERENCES siswa (siswa_id)
                                    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE kunjungan_profil (
    kunjungan_id  INT      NOT NULL AUTO_INCREMENT,
    lembaga_id    INT      NOT NULL,
    siswa_id      INT,
    dikunjungi_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_kunjungan         PRIMARY KEY (kunjungan_id),
    CONSTRAINT fk_kunjungan_lembaga FOREIGN KEY (lembaga_id) REFERENCES lembaga (lembaga_id)
                                        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_kunjungan_siswa   FOREIGN KEY (siswa_id)   REFERENCES siswa (siswa_id)
                                        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO mata_pelajaran (nama_mapel) VALUES
  ('Matematika'), ('Bahasa Inggris'), ('IPA'),
  ('IPS'), ('Bahasa Indonesia'), ('Fisika'),
  ('Kimia'), ('Biologi'), ('SNBT');
