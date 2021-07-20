/*Firmware controller*/
const firmwareCtrl = {}; /*controller object */



/*Test GET function*/
firmwareCtrl.main = (req, res) =>{
    res.json({
        status : 'this is the firmware section'
    });
}

/*Test POST function*/
firmwareCtrl.latest = async(req,res) =>{
    res.json({
        "version":0.2,
        "file":"https://www.watchbird.org/latest.bin"
    });
}


module.exports = firmwareCtrl;