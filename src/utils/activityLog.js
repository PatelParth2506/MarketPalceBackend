const activityLog = async(item,modelName)=>{
    const itemjson = item.toJSON()
    try {
        await modelName.create({ ...itemjson })
    } catch (error) {
        console.log(`Error Inserting In ${modelName} This Error Occur ${error}`)
    }
}

module.exports = activityLog