const MemberModel = require('../models').member
const {Op} = require('sequelize')

async function tambahMember (req,res){
    try {
        const payload = req.body
        const {nama,alamat,jenis_kelamin,tlp} = payload

        if (req.role === "admin") {
            await MemberModel.create({
                nama,
                alamat,
                jenis_kelamin,
                tlp
            })
        }
        res.json({
            status: "Success",
            msg: "berhasil tambah member",
          });
    } catch (error) {
        res.status(403).json({
            status: "fail",
            msg: "Ada kesalahan",
            err: error,
          });
    }
}
async function getMember (req,res) {
  const {keyword,page,pageSize,offset} = req.query
    try {
        const member = await MemberModel.findAndCountAll({
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          where : {
            [Op.or] : [
              {
                nama : {
                  [Op.substring] : keyword
                },
                // jenis_kelamin : {
                //   [Op.substring] : jenisklmn
                // }
              }
            ]
          },
          limit : pageSize,
          offset : offset
        })
        res.json({
            status: "Success",
            msg: "member berhasil ditemukan",
            pagination : {
              currentPage : page,
              pageSize : pageSize,
              totalData : member.count
            },
            data : member
          });
    } catch (error) {
        res.status(403).json({
            status: "fail",
            msg: "Ada kesalahan",
            err: error,
          });
    }
}
async function deleteMember(req, res) {
    try {
      const { id } = req.params;
      const member = await MemberModel.findByPk(id);
  
      if (member === null) {
        res.status(403).json({
          status: "Fail",
          msg: "member tidak ditemukan",
        });
      }
  
      await MemberModel.destroy({
        where: {
          id: id,
        },
      });
      res.json({
        status: "Success",
        msg: "member berhasil dihapus",
      });
    } catch (error) {
      console.log(error);
      res.status(403).json({
        status: "fail",
        msg: "Ada kesalahan",
        err: error,
      });
    }
  }

  async function detailMember(req, res) {
    try {
      const { id } = req.params;
      const member = await MemberModel.findOne({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        where : {
          id : id
        }
      });
      res.json({
        status: "Success",
        msg: "detail member berhasil ditemukan",
        data: member,
      });
  
    } catch (error) {
      console.log(error);
      res.json({
        status: "Fail",
        msg: "ada kesalahan",
      });
    }
  }

  async function updateMember(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body;
      const { nama,alamat,jenis_kelamin,tlp } = payload;
      const member = await MemberModel.findByPk(id);
  
      if (member === null) {
        res.json({
          status: "Fail",
          msg: " tidak ditemukan",
        });
      }
  
      await MemberModel.update(
        {
          nama,
          alamat,
          jenis_kelamin,
          tlp
        },
        {
          where: {
            id: id,
          },
        }
      );
      res.json({
        status: "Success",
        msg: "member berhasil diupdate",
      });
    } catch (error) {
      res.json({
        status: "Fail",
        msg: "ada kesalahan",
      });
    }
  }
module.exports = {tambahMember,getMember,deleteMember,detailMember,updateMember}