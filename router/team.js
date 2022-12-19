const express = require('express')
const router = express.Router()
const {
    teamQuit,
    teamCreate,
    teamSearch,
    teamJoin,
    teamJoinStatus,
    deleteTeamJoin,
    teamSetPic,
    teamInfoSet,
    teamInfoCheck,
    teamDelete,
    captainAgreeJoin
} = require('../router_handle/team/teamOption')

const { createActivity, getActivity, deleteActivity, getMyActivity,setActivity,joinActivity,getJoinActiMsg } = require('../router_handle/activity/activity')
const { getTeamMember } = require('../router_handle/team/getTeamMember')
const { getTeamInfo } = require('../router_handle/team/getTeamInfo')

const multer = require('multer')
const upload = multer({ dest: './uploads/img' })

router.post('/setPic', upload.single('avatar'), teamSetPic)
router.post('/create', teamCreate)
router.get('/teamList', teamSearch)
router.post('/join', teamJoin)
router.post('/joinStatus', teamJoinStatus)
router.post('/deleteTeamJoin', deleteTeamJoin)
router.post('/quit', teamQuit)
router.post('/member', getTeamMember)
router.get('/teamInfo', getTeamInfo)
router.post('/createActivity', createActivity)
router.get('/Activity', getActivity)
router.post('/deleteActivity', deleteActivity)
router.post('/getMyActivity', getMyActivity)
router.post('/setActivity', setActivity)
router.post('/joinActivity', joinActivity)
router.post('/getJoinActiMsg', getJoinActiMsg)
router.post('/setTeamInfo', teamInfoSet)
router.post('/teamInfoCheck', teamInfoCheck)
router.post('/delete', teamDelete)
router.post('/captainAgreeJoin',captainAgreeJoin)



module.exports = router
