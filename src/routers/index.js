const express = require("express");

const router = express.Router();
const { login, tambahUser, authMe } = require("../controllers/authControllers");
const {
  getDetailTransaksi,
} = require("../controllers/detailTransaksiController");
const {
  tambahMember,
  getMember,
  deleteMember,
  detailMember,
  updateMember,
} = require("../controllers/memberController");
const {
  tambahOutlet,
  getOutlet,
  deleteOutlet,
  detailOutlet,
  updateOutlet,
} = require("../controllers/outletController");
const {
  TambahPaket,
  getPaket,
  deletePaket,
  detailPaket,
  updatePaket,
} = require("../controllers/paketController");
const {
  getTransaksi,
  TambahTransaksi,
  deleteTransaksi,
  detailTransaksi,
  updateTransaksi,
  downloadRekap,
} = require("../controllers/transaksiControllers");
const {
  getListUser,
  deleteUser,
  detailUser,
  updateUser,
} = require("../controllers/userController");
const jwtValidateMiddleware = require("../middleware/jwtValidatemiddleware");
const validationResultMiddleware = require("../middleware/validationResultMiddleware");
const outletValidator = require("../validator/outletValidator");
//auth

router.post("/login", login);

router.use(jwtValidateMiddleware);
router.get("/authMe", authMe);

router.get("/outlet/list", getOutlet);
router.post(
  "/outlet/tambah-outlet",
  outletValidator.createOutletValidator,
  validationResultMiddleware,
  tambahOutlet
);
router.delete("/outlet/delete/:id", deleteOutlet);
router.get("/outlet/detail/:id", detailOutlet);
router.put("/outlet/update/:id", updateOutlet);
//user
router.get("/user/list", getListUser);
router.post("/user/tambah-user", tambahUser);
router.delete("/user/delete/:id", deleteUser);
router.get("/user/detail/:id", detailUser);
router.put("/user/update/:id", updateUser);
//member
router.post("/member/tambah-member", tambahMember);
router.get("/member/list", getMember);
router.delete("/member/delete/:id", deleteMember);
router.get("/member/detail/:id", detailMember);
router.put("/member/update/:id", updateMember);
//paket
router.post("/paket/tambah-paket", TambahPaket);
router.get("/paket/list", getPaket);
router.delete("/paket/delete/:id", deletePaket);
router.get("/paket/detail/:id", detailPaket);
router.put("/paket/update/:id", updatePaket);

//transaksi
router.get("/transaksi/list", getTransaksi);
router.post("/transaksi/tambah-transaksi", TambahTransaksi);
router.delete("/transaksi/delete/:id", deleteTransaksi);
router.get("/transaksi/detail/:id", detailTransaksi);
router.put("/transaksi/update/:id", updateTransaksi);
//detail transaksi
router.get("/detail/transaksi/:id", getDetailTransaksi);

router.get("/laporan/download", downloadRekap);

module.exports = router;
