const fs = require('fs')
const url = require('url')
const path = require('path')
const qs = require('querystring')
const copy = require('copy-text-to-clipboard')
const crypto = require('crypto')

/* Database instance. */

let PouchDB = require('pouchdb-browser')
PouchDB.plugin(require('pouchdb-find'))
let db = new PouchDB('lbc-feed-db')

/* User profile */

const PROFILE_DIR_PATH = path.join(require('os').homedir(), '.lbc-feed')

/* Tags table. */

const TAGSTBL = {
  // deleted
  deleted: '不感兴趣',

  // press
  pressCentral: '中央一级党报',
  pressProvincial: '省一级党报',
  pressUrban: '都市类党报',

  // type
  typePure: '纯净新闻',
  typeFeature: '特稿与特写',
  typeCommentary: '评论',
  typeMisc: '其他新闻类型',

  // topic
  // - topicHelp
  topicHelpDonation: '帮助新闻种类/单纯一次捐款捐物',
  topicHelpTravel: '帮助新闻种类/旅游活动安排',
  topicHelpFree: '帮助新闻种类/免费开放',
  topicHelpFunding: '帮助新闻种类/设立长期资助项目',
  topicHelpMisc: '帮助新闻种类/其他',
  // - topicHelpyBy
  topicHelpByGovernment: '帮助新闻主体/政府',
  topicHelpByEnterprise: '帮助新闻主体/企业',
  topicHelpByInstitution: '帮助新闻主体/事业单位',
  topicHelpByCharity: '帮助新闻主体/公益团体',
  topicHelpByPersonal: '帮助新闻主体/个人',
  // - topicOpinion
  topicOpinion: '社会各界看法及建议',
  // - topicCommend
  topicCommendGovernment: '表彰新闻主体/政府',
  topicCommendEnterprise: '表彰新闻主体/企业',
  topicCommendInstitution: '表彰新闻主体/事业单位',
  topicCommendCharity: '表彰新闻主体/公益团体',
  topicCommendPersonal: '表彰新闻主体/个人',
  // - topicViolence
  topicViolenceMale: '遭受暴力/男',
  topicViolenceFemale: '遭受暴力/女',
  topicViolenceUnknown: '遭受暴力/性别未提及',
  // - topicSex
  topicSexMale: '遭受性侵犯/男',
  topicSexFemale: '遭受性侵犯/女',
  topicSexUnknown: '遭受性侵犯/性别未提及',
  // - topicCriminal
  topicCriminal: '留守儿童犯罪',
  // - topicDeath
  topicDeathMale: '意外死亡/男',
  topicDeathFemale: '意外死亡/女',
  topicDeathUnknown: '意外死亡/性别未提及',
  // - topicPositive
  topicPositive: '留守儿童努力上进',
  // - topicParents
  topicParents: '父母打工艰难生活',
  // - topicMisc
  topicMisc: '其他新闻主题',

  // src
  srcJournalist: '来源于记者',
  srcGovernment: '来源于政府',
  srcEnterprise: '来源于企业',
  srcInstitution: '来源于事业单位',
  srcCharity: '来源于公益团体',
  srcExpert: '来源于专家学者',
  srcLeader: '领导, 政协或人大代表',
  srcMisc: '其他来源',

  // pubimg
  pubimgPositiveMale: '积极健康/男',
  pubimgPositiveFemale: '积极健康/女',
  pubimgPositiveUnknown: '积极健康/性别未提及',
  pubimgMiserable: '可怜悲惨',
  pubimgHappy: '沐恩幸福',
  pubimgProblematic: '问题儿童',
  pubimgMisc: '其他媒介形象',

  // edu
  eduRegister: '无本地户籍难入公立学校',
  eduFee: '私立学校学费高',
  eduQuality: '私立学校教学质量没保障',
  eduQualification: '越来越多私立学校被国家取消办学资格',
  eduMisc: '其他教育原因'
}

/* Components rendering. */

// Render single component.
function render (id, text) {
  document.getElementById(id).innerHTML = text
}

// Key: DOM id; Value: Component text.
function renderAll (comps) {
  Object.keys(comps).forEach(c => {
    document.getElementById(c).innerHTML = comps[c]
  })
}
