const express = require('express')
const router = express.Router()
// const teamCreate = require('../router_handle/teamCreate')
const {
    teamQuit,
    teamCreate,
    teamSearch,
    teamJoin,
    teamJoinStatus,
    deleteJoinStatus,
    teamSetPic,
    teamInfoSet,
    teamPicSet,
    teamDelete
} = require('../router_handle/teamOption')

const { createTeamActivity,getTeamActivity,deleteActivity } = require('../router_handle/TeamActivity')
const { getTeamMember } = require('../router_handle/getTeamMember')
const { getTeamInfo } = require('../router_handle/getTeamInfo')
// router.post('/create',(req,res)=>{
//     console.log(req.body)
//     res.func('ok')
// })
const multer  = require('multer')
const upload = multer({ dest: './uploads/img' })

router.post('/setPic',upload.single('avatar'),teamSetPic)
router.post('/create',teamCreate)
router.get('/teamList',teamSearch)
router.post('/join',teamJoin)
router.post('/joinStatus',teamJoinStatus)
router.post('/deleteJoinStatus',deleteJoinStatus)
router.post('/quit',teamQuit)
router.post('/member',getTeamMember)
router.get('/teamInfo',getTeamInfo)
router.post('/createTeamActivity',createTeamActivity)
router.get('/Activity',getTeamActivity)
router.post('/deleteActivity',deleteActivity)
router.post('/setTeamInfo',teamInfoSet)
router.post('/setTeamPic',upload.single('avatar'),teamPicSet)
router.post('/delete',teamDelete)







module.exports = router
