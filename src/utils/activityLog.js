const activityLog = async(item,modelName)=>{
    const itemjson = item.toJSON()
    try {
        await modelName.create({ ...itemjson })
    } catch (error) {
        
    }
}

module.exports = activityLog