const vscode = require('vscode');

function activate(context) {
    console.log('🚀 Code Motivator está activo!');

    // ====== COMANDO MANUAL ======
    let motivateCommand = vscode.commands.registerCommand('code-motivator.motivate', function () {
        const messages = [
            '🔥 ¡Vas increíble! Sigue así',
            '💪 Cada línea de código cuenta',
            '🚀 Eres un crack del código',
            '⚡ El bug no tiene chance contra ti',
            '🎯 Focus mode: ACTIVATED',
            '🌟 Tu código es arte',
            '☕ ¿Break? Nah, sigamos programando',
            '🦾 Debugging = Ser detective',
            '💻 Hoy serás imparable',
            '🎨 El código limpio es poesía'
        ];
        
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        vscode.window.showInformationMessage(randomMsg);
    });

    // ====== CONTADOR DE LÍNEAS ======
    let lineCount = 0;
    
    vscode.workspace.onDidChangeTextDocument((event) => {
        lineCount += event.contentChanges.length;
        
        if (lineCount % 50 === 0 && lineCount > 0) {
            vscode.window.showInformationMessage(`🔥 ¡${lineCount} líneas en esta sesión!`);
        }
    });

    // ====== STATUS BAR ======
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.text = '$(rocket) 0 líneas';
    statusBarItem.tooltip = 'Code Motivator';
    statusBarItem.show();

    vscode.workspace.onDidChangeTextDocument(() => {
        statusBarItem.text = `$(rocket) ${lineCount} líneas`;
    });

    // ====== BIENVENIDA ======
    vscode.window.showInformationMessage('💪 Code Motivator activado! Ctrl+Shift+M para motivarte');

    context.subscriptions.push(motivateCommand);
    context.subscriptions.push(statusBarItem);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};