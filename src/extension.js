const vscode = require('vscode');

async function activate(context) {
    let clipboard;
    try {
        clipboard = await import('clipboardy');
    } catch (err) {
        console.log('Failed to import clipboardy:', err);
        return;
    }

    let openDocuments = [...vscode.workspace.textDocuments];
    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "🟢 CopyTab: Tracking";

    vscode.workspace.onDidOpenTextDocument((document) => {
        openDocuments.push(document);
        updateStatusBarItem();
    });

    vscode.workspace.onDidCloseTextDocument((document) => {
        openDocuments = openDocuments.filter((doc) => doc !== document);
        updateStatusBarItem();
    });

    vscode.window.onDidChangeActiveTextEditor((editor) => {
        updateStatusBarItem();
    });

    let disposable = vscode.commands.registerCommand('extension.copyAllOpenFiles', async () => {
        let allContent = '';
    
        for (let document of openDocuments) {
            allContent += document.getText() + '\n';
        }
    
        clipboard.default.writeSync(allContent);
    
        vscode.window.showInformationMessage('Copied all open files to clipboard!');
    });
    

    context.subscriptions.push(disposable);
    context.subscriptions.push(statusBarItem);

    function updateStatusBarItem() {
        let activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && openDocuments.includes(activeEditor.document)) {
            statusBarItem.show();
        } else {
            statusBarItem.hide();
        }
    }

    updateStatusBarItem();
}

function deactivate() {}

exports.activate = activate;
exports.deactivate = deactivate;
