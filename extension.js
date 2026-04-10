const vscode = require("vscode");

const MOTIVATE_COMMAND = "code-motivator.motivate";
const CONFIG_SECTION = "codeMotivator";
const MESSAGE_INTERVAL_KEY = "messageInterval";
const CELEBRATION_STEP = 50;
const DEFAULT_MESSAGE_INTERVAL = 300000;
const MOTIVATION_MESSAGE_DURATION = 8000;

const MESSAGES = [
  "🔥 ¡Vas increíble! Sigue así",
  "💪 Cada línea de código cuenta",
  "🚀 Eres un crack del código",
  "⚡ El bug no tiene chance contra ti",
  "🎯 Focus mode: ACTIVATED",
  "🌟 Tu código es arte",
  "💻 Tú puedes con esto",
  "🦾 Debugging = ser detective",
  "💻 Hoy serás imparable",
  "🎨 El código limpio es poesía",
  "😎 Ese commit va a quedar legendario",
  "🤙 Tranqui, ya casi sale",
  "🧠 Tu cerebro está en modo pro",
  "☕ Respira, estás haciendo magia",
  "🎮 Programar es tu superpoder",
  "👾 Los bugs tiemblan cuando te ven",
  "🌮 Después de esto, te mereces algo rico",
  "🔮 Tu yo del futuro te lo va a agradecer",
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
  "🌊 Fluyes al programar",
  "🎪 Este proyecto será épico",
  "🍔 Code, test, commit, repeat",
  "🎤 Tu código canta",
  "🌈 Estás creando algo increíble",
  "⭐ Ese algoritmo quedó perfecto",
  "🎲 La suerte está de tu lado hoy",
  "🧩 Cada función encaja perfecto",
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

function getRandomMessage(random = Math.random) {
  return MESSAGES[Math.floor(random() * MESSAGES.length)];
}

function getConfiguredInterval(workspace = vscode.workspace) {
  const rawValue = workspace
    .getConfiguration(CONFIG_SECTION)
    .get(MESSAGE_INTERVAL_KEY, DEFAULT_MESSAGE_INTERVAL);

  return Number.isFinite(rawValue) && rawValue > 0
    ? rawValue
    : DEFAULT_MESSAGE_INTERVAL;
}

function createSessionTracker(documents = []) {
  const lineCountsByDocument = new Map();
  let totalAddedLines = 0;
  let nextCelebrationTarget = CELEBRATION_STEP;

  for (const document of documents) {
    lineCountsByDocument.set(document.uri.toString(), document.lineCount);
  }

  return {
    registerDocument(document) {
      lineCountsByDocument.set(document.uri.toString(), document.lineCount);
    },
    unregisterDocument(document) {
      lineCountsByDocument.delete(document.uri.toString());
    },
    trackDocumentChange(document) {
      const documentKey = document.uri.toString();
      const previousLineCount = lineCountsByDocument.get(documentKey) ?? document.lineCount;
      const currentLineCount = document.lineCount;
      const addedLines = Math.max(0, currentLineCount - previousLineCount);

      lineCountsByDocument.set(documentKey, currentLineCount);

      if (addedLines > 0) {
        totalAddedLines += addedLines;
      }

      const reachedCelebrationTarget = totalAddedLines >= nextCelebrationTarget;
      if (reachedCelebrationTarget) {
        while (totalAddedLines >= nextCelebrationTarget) {
          nextCelebrationTarget += CELEBRATION_STEP;
        }
      }

      return {
        totalAddedLines,
        reachedCelebrationTarget,
      };
    },
    getTotalAddedLines() {
      return totalAddedLines;
    },
  };
}

function updateStatusBar(statusBarItem, totalAddedLines) {
  statusBarItem.text = `$(rocket) ${totalAddedLines} líneas añadidas`;
}

function createTemporaryStatusMessagePresenter(statusBarItem, duration = MOTIVATION_MESSAGE_DURATION) {
  /** @type {NodeJS.Timeout | undefined} */
  let resetTimer;

  return (message) => {
    if (resetTimer) {
      clearTimeout(resetTimer);
    }

    statusBarItem.text = `$(sparkle) ${message}`;
    statusBarItem.tooltip = "Code Motivator";
    statusBarItem.show();

    resetTimer = setTimeout(() => {
      statusBarItem.hide();
      resetTimer = undefined;
    }, duration);
  };
}

function showMotivationalMessage(
  showMessage,
  random = Math.random,
) {
  const message = getRandomMessage(random);
  showMessage(message);
  return message;
}

function activate(context) {
  console.log("Code Motivator está activo!");

  const sessionTracker = createSessionTracker(vscode.workspace.textDocuments);
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100,
  );
  statusBarItem.tooltip = "Code Motivator";
  updateStatusBar(statusBarItem, sessionTracker.getTotalAddedLines());
  statusBarItem.show();

  const motivationStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  );
  motivationStatusBarItem.command = MOTIVATE_COMMAND;
  motivationStatusBarItem.tooltip = "Mostrar otro mensaje motivacional";

  const presentMotivationMessage = createTemporaryStatusMessagePresenter(
    motivationStatusBarItem,
  );

  let motivationalTimer;

  const restartMotivationalTimer = () => {
    if (motivationalTimer) {
      clearInterval(motivationalTimer);
      motivationalTimer = undefined;
    }

    const interval = getConfiguredInterval();
    motivationalTimer = setInterval(() => {
      showMotivationalMessage(presentMotivationMessage);
    }, interval);
  };

  const motivateCommand = vscode.commands.registerCommand(MOTIVATE_COMMAND, () => {
    showMotivationalMessage(presentMotivationMessage);
  });

  const textDocumentChangeListener = vscode.workspace.onDidChangeTextDocument((event) => {
    const { totalAddedLines, reachedCelebrationTarget } = sessionTracker.trackDocumentChange(
      event.document,
    );

    updateStatusBar(statusBarItem, totalAddedLines);

    if (reachedCelebrationTarget) {
      presentMotivationMessage(
        `🔥 ¡${totalAddedLines} líneas añadidas en esta sesión!`,
      );
    }
  });

  const textDocumentOpenListener = vscode.workspace.onDidOpenTextDocument((document) => {
    sessionTracker.registerDocument(document);
  });

  const textDocumentCloseListener = vscode.workspace.onDidCloseTextDocument((document) => {
    sessionTracker.unregisterDocument(document);
  });

  const configurationChangeListener = vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration(`${CONFIG_SECTION}.${MESSAGE_INTERVAL_KEY}`)) {
      restartMotivationalTimer();
    }
  });

  restartMotivationalTimer();

  presentMotivationMessage(
    "💪 Code Motivator activado. Usa Ctrl+Alt+M o Cmd+Alt+M para motivarte.",
  );

  context.subscriptions.push(
    motivateCommand,
    statusBarItem,
    motivationStatusBarItem,
    textDocumentChangeListener,
    textDocumentOpenListener,
    textDocumentCloseListener,
    configurationChangeListener,
    new vscode.Disposable(() => {
      if (motivationalTimer) {
        clearInterval(motivationalTimer);
      }

      motivationStatusBarItem.hide();
    }),
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
  __testing: {
    CELEBRATION_STEP,
    DEFAULT_MESSAGE_INTERVAL,
    MESSAGES,
    MOTIVATION_MESSAGE_DURATION,
    createTemporaryStatusMessagePresenter,
    createSessionTracker,
    getConfiguredInterval,
    getRandomMessage,
    showMotivationalMessage,
    updateStatusBar,
  },
};
