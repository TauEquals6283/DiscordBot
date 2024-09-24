// date.jsのmodule.exportsを呼び出します。
const dateFile = require('./commands/date.js');

// discord.jsライブラリの中から必要な設定を呼び出し、変数に保存します
const { Client, Events, GatewayIntentBits } = require('discord.js');
// 設定ファイルからトークン情報を呼び出し、変数に保存します
const { token } = require('./config.json');
// クライアントインスタンスと呼ばれるオブジェクトを作成します
const client = new Client({ intents: [GatewayIntentBits.Guilds] });


// クライアントオブジェクトが準備OKとなったとき一度だけ実行されます
client.once(Events.ClientReady, c => {
	console.log(`準備OKです! ${c.user.tag}がログインします。`);
});


//スラッシュコマンドに応答するには、interactionCreateのイベントリスナーを使う必要があります
client.on(Events.InteractionCreate, async interaction => {

    // スラッシュ以外のコマンドの場合は対象外なので早期リターンさせて終了します
    // コマンドにスラッシュが使われているかどうかはisChatInputCommand()で判断しています
    if (!interaction.isChatInputCommand()) return;

    // dateコマンドに対する処理
    if (interaction.commandName === dateFile.data.name) {
      try {
          await dateFile.execute(interaction);
      } catch (error) {
          console.error(error);
          if (interaction.replied || interaction.deferred) {
              await interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
          } else {
              await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
          }
      }
  } else {
      console.error(`${interaction.commandName}というコマンドには対応していません。`);
  }
});


// ログインします
client.login(token);
