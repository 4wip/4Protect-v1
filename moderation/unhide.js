const Discord = require("discord.js")
const db = require('quick.db')
const owner = new db.table("Owner")
const modlog = new db.table("modlog")
const config = require("../config")
const fs = require('fs')
const moment = require('moment')
const p2 = new db.table("Perm2")
const p3 = new db.table("Perm3")

module.exports = {
    name: 'unhide',
    usage: 'unhide',
    description: `Permet de unhide un salon`,
    async execute(client, message, args, color) {

        const perm2 = p2.fetch(`perm2_${message.guild.id}`)
        const perm3 = p3.fetch(`perm3_${message.guild.id}`)

        if (owner.get(`owners.${message.author.id}`) || config.bot.buyer.includes(message.author.id) || config.bot.funny.includes(message.author.id) === true) {

            let color = db.fetch(`color_${message.guild.id}`)
            if (color == null) color = config.bot.couleur


            if (owner.get(`owners.${message.author.id}`) || message.member.roles.cache.has(perm2) || message.member.roles.cache.has(perm3) || config.bot.buyer.includes(message.author.id) || config.bot.funny.includes(message.author.id) === true) {
                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel

                        channel.permissionOverwrites.edit(message.guild.id, {
                            VIEW_CHANNEL: null,
                        });
                message.channel.send(`Les membres peuvent à nouveau voir le salon <#${channel.id}>`);
                message.delete();
            }


            let channellogs = db.get(`${message.guild.id}.modlog`)
            if (channellogs == null) return

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`<@${message.author.id}> a utilisé la commande \`unhide\` le salon <#${message.channel.id}>`)
                .setTimestamp()
                .setFooter({ text: `📚` })
            const logchannel = client.channels.cache.get(channellogs)
            if (logchannel) logchannel.send({ embeds: [embed] }).catch(() => false)

        }
    }
}