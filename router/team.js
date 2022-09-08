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
    teamDelete
} = require('../router_handle/team/teamOption')

const { createActivity, getActivity, deleteActivity } = require('../router_handle/activity/activity')
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
router.post('/setTeamInfo', teamInfoSet)
router.post('/delete', teamDelete)

module.exports = router
