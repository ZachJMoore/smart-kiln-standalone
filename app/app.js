const express = require("express");
const app = express();
const kilnController = require("./routes/kilnController")
const port = 2222;

const isLocal = (req, res, next)=>{

    var ip = req.connection.remoteAddress;
    if (ip === "::1" || ip === "::ffff:172.17.0.1"){
        next()
        return res.status(403).send("invalid client")
    }
};

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "x-access-token, Content-Type");
    next();
})


app.use("/api/kiln", kilnController);
app.use("*", express.static('app/public'))

const server = app.listen(port, console.log(new Date() + ": server running on port: " + port));