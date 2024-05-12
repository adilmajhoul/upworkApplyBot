const InstagramBot = require('./InstagramBot');

async function main() {
  const instagramBot = new InstagramBot();

  await instagramBot.init();
  await instagramBot.signin({
    username: process.env.username,
    // password: process.env.password,
  });
}

main().then(console.error);
