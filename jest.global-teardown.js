module.exports = async function testTeardown() {
    process.stdout.write("Killing redis!");

    global.__REDIS__.kill();

  };