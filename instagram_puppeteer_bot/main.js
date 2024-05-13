const InstagramBot = require('./InstagramBot');

async function main() {
  const instagramBot = new InstagramBot();

  await instagramBot.init();
  const isLogged = await instagramBot.signin({
    username: 'adilmajhoul',
    password: 'instagramskhon1-',
  });

  console.log('🚀 isLogged:', isLogged);
}

main().then(console.error);

// hi there
