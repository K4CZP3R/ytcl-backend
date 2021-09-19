const { cwd } = require("process");
const {spawn} = require("child_process");

module.exports = async function testSetup() {
    const command = "redis-server";

    const arguments = [
        '--port', '6969'
    ]

    const options = {
        shell: true,
        cwd: cwd()
    }

    const server = spawn(
        command,
        arguments,
        options
    )

    global.__REDIS__ = server
};