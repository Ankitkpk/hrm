const {createNotification} = require('../utils/notification')

const setReminder = (data)=>{
    const date = new Date(data.date)
    date.setMinutes(date.getMinutes()-data.reminder)
    const time = date.setMinutes - Date.now()
    const body = {
        title:'Reminder',
        message:`Meeting in ${data.reminder}`,
        type:'Reminder',
        user:'670397af1ee0328002773230',
        companyId:data.companyId,
        isRead:false
    }
    setTimeout(()=>{
        createNotification(body)
    },time)
}
module.exports = setReminder;