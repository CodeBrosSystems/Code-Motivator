const vscode = require("vscode");

function activate(context) {
  console.log("Code Motivator está activo!");

  // ====== COMANDO MANUAL ======
  let motivateCommand = vscode.commands.registerCommand(
    "code-motivator.motivate",
    function () {
      const messages = [
        "🔥 ¡Vas increíble! Sigue así",
        "💪 Cada línea de código cuenta",
        "🚀 Eres un crack del código",
        "⚡ El bug no tiene chance contra ti",
        "🎯 Focus mode: ACTIVATED",
        "🌟 Tu código es arte",
        "💻 Tu puedes osiosi",
        "🦾 Debugging = Ser detective",
        "💻 Hoy serás imparable",
        "🎨 El código limpio es poesía",
        "😎 Ese commit va a quedar legendario",
        "🤙 Tranqui, ya casi sale",
        "🧠 Tu cerebro está en modo pro",
        "☕ Respira, estás haciendo magia",
        "🎮 Programar es tu superpoder",
        "👾 Los bugs tiemblan cuando te ven",
        "🌮 Después de esto, te mereces algo rico",
        "🔮 El futuro dev que serás te agradecerá esto",
        "💯 Estás rompiendo el teclado de lo pro que eres",
        "🏆 Este código merece un premio",
        "🎸 Estás codeando como rockstar",
        "🍕 Stack Overflow estaría orgulloso",
        "🐛 Los bugs te tienen miedo",
        "✨ Esa función quedó hermosa",
        "🎯 100% concentración, 0% distracciones",
        "🚁 Estás volando con este código",
        "🔊 Tu código habla por sí solo",
        "🎭 Shakespeare escribía, tú programas",
        "🦸 Eres el héroe que este proyecto necesita",
        "📚 Cada error es aprendizaje",
        "🌊 Fluyes como el agua al programar",
        "🎪 Este proyecto será épico",
        "🍔 Code, test, commit, repeat",
        "🎤 Tu código canta",
        "🌈 Estás creando algo increíble",
        "⭐ Ese algoritmo quedó perfecto",
        "🎲 La suerte está de tu lado hoy",
        "🧩 Cada función encaja perfecta",
        "🎊 ¡BOOM! Esa solución fue brillante",
        "🌙 Codeando hasta el amanecer (pero descansa)",
        "🎈 La motivación está a tope",
        "🥇 Primera clase, primera línea",
        "🎵 Tu código tiene ritmo",
        "🌺 Ese merge va a quedar limpio",
        "🎿 Deslizándote entre las líneas",
        "🏄 Surfeando el código como nadie",
        "🥳 Celebremos cada pequeño avance",
        "🍿 Este código es mejor que una película",
        "🌻 Tu esfuerzo florecerá pronto",
        "🎓 Aprendiendo y mejorando cada día",
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      vscode.window.showInformationMessage(randomMsg);
    },
  );

  // ====== CONTADOR DE LÍNEAS ======
  let lineCount = 0;

  vscode.workspace.onDidChangeTextDocument((event) => {
    lineCount += event.contentChanges.length;

    if (lineCount % 50 === 0 && lineCount > 0) {
      vscode.window.showInformationMessage(
        `🔥 ¡${lineCount} líneas en esta sesión!`,
      );
    }
  });

  // ====== STATUS BAR ======
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100,
  );
  statusBarItem.text = "$(rocket) 0 líneas";
  statusBarItem.tooltip = "Code Motivator";
  statusBarItem.show();

  vscode.workspace.onDidChangeTextDocument(() => {
    statusBarItem.text = `$(rocket) ${lineCount} líneas`;
  });

  // ====== BIENVENIDA ======
  vscode.window.showInformationMessage(
    "💪 Code Motivator activado! Ctrl+Shift+M para motivarte",
  );

  context.subscriptions.push(motivateCommand);
  context.subscriptions.push(statusBarItem);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
