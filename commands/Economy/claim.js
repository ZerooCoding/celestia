const Command = require('../../base/Command.js');
const { RichEmbed } = require('discord.js');
const db = require('quick.db');
const parseMilliseconds = require('parse-ms');

class Claim extends Command {
  constructor(client) {
    super(client, {
      name: "claim",
      description: "Claim your daily rewards.",
      category: "Economy",
      usage: "claim",
    });
  }

  async run(message, args, level, settings) { 

    let dailyCooldown = 8.64e+7; // = 24 hours in ms

    let lastDaily = await db.get(`dailyRewardInfo_${message.author.id}.lastDaily`); 

    if ((lastDaily !== null) && (dailyCooldown - (Date.now() - lastDaily) > 0)) {
      let remainingTime = parseMilliseconds(dailyCooldown - (Date.now() - lastDaily));

      // If the user already collected their reward earlier, send this:
      message.channel.send(`You already collected your reward! You can use this command again in **${remainingTime.hours}h ${remainingTime.minutes}m**`);

    } else { // If not, continue, and give them their reward for today:

      const embed = new RichEmbed()
        .setColor("RANDOM")
        .setTitle(`__**${message.author.username}'s Daily Reward**__`)
        .addField(`Reward Collected`, `75 Money`)
      message.channel.send({ embed }); 

      // Sets the daily reward
      db.set(`dailyRewardInfo_${message.author.id}.lastDaily`, Date.now());
      // Adds the money to the author 
      db.add(`money_${message.author.id}`, 75); 
    }
  }
}

module.exports = Claim;