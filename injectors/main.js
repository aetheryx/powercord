const rmdirRf = require('../src/fake_node_modules/powercord/util/rmdirRf');
const { existsSync } = require('fs');
const { mkdir, writeFile } = require('fs').promises;
const { join, sep } = require('path');
const { AnsiEscapes } = require('./log');

exports.inject = async ({ getAppDir }) => {
  const appDir = await getAppDir();
  if (existsSync(appDir)) {
    /*
     * @todo: verify if there is nothing in discord_desktop_core as well
     * @todo: prompt to automatically uninject and continue
     */
    console.log('Looks like you already have an injector in place. Try unplugging (`npm run unplug`) and try again.', '\n');
    console.log(`${AnsiEscapes.YELLOW}NOTE:${AnsiEscapes.RESET} If you already have BetterDiscord or another client mod injected, Powercord cannot run along with it!`);
    console.log('Read our FAQ for more details: https://powercord.dev/faq#bd-and-pc');
    return false;
  } else if (appDir.includes('flatpak')) {
    const command = appDir.startsWith('/var') ? 'sudo flatpak override' : 'flatpak override --user';

    console.log(`${AnsiEscapes.YELLOW}NOTE:${AnsiEscapes.RESET} It seems like your Discord Canary install is a flatpak`);
    console.log('      You need to update its permissions so it can access the powercord directory');
    console.log(`      You can do so by running ${AnsiEscapes.YELLOW}${command} --filesystem=${join(__dirname, '..')} com.discordapp.DiscordCanary${AnsiEscapes.RESET}`);
  }

  await mkdir(appDir);
  await Promise.all([
    writeFile(
      join(appDir, 'index.js'),
      `require(\`${__dirname.replace(RegExp(sep.repeat(2), 'g'), '/')}/../src/patcher.js\`)`
    ),
    writeFile(
      join(appDir, 'package.json'),
      JSON.stringify({
        main: 'index.js',
        name: 'discord'
      })
    )
  ]);

  return true;
};

exports.uninject = async ({ getAppDir }) => {
  const appDir = await getAppDir();

  if (!existsSync(appDir)) {
    console.log('There is nothing to unplug. You are already running Discord without mods.');
    return false;
  }

  await rmdirRf(appDir);
  return true;
};
