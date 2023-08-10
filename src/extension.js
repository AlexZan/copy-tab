const vscode = require('vscode');

function activate(context) {
    let openDocuments = [];
    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "🟢 CopyTab: Tracking";
    statusBarItem.command = 'extension.copyAllOpenFiles';

    vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor && !openDocuments.includes(editor.document.uri)) {
            openDocuments.push(editor.document.uri);
            console.log(`[CopyTab] Document ${editor.document.uri} added to tracking.`);
        }
        updateStatusBarItem();
    });

    vscode.workspace.onDidCloseTextDocument((document) => {
        openDocuments = openDocuments.filter(uri => uri.toString() !== document.uri.toString());
        console.log(`[CopyTab] Document ${document.uri} removed from tracking.`);
        updateStatusBarItem();
    });

    let disposable = vscode.commands.registerCommand('extension.copyAllOpenFiles', async () => {
        let allContent = '';

        for (let uri of openDocuments) {
            let document = await vscode.workspace.openTextDocument(uri);
            allContent += document.getText() + '\n';
        }

        await vscode.env.clipboard.writeText(allContent);
        vscode.window.showInformationMessage('Copied all open files to clipboard!');
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(statusBarItem);

    function updateStatusBarItem() {
        if (openDocuments.length > 0) {
            console.log('[CopyTab] Showing status bar item.');
            statusBarItem.show();
        } else {
            console.log('[CopyTab] Hiding status bar item.');
            statusBarItem.hide();
        }
    }

    if (vscode.window.activeTextEditor) {
        openDocuments.push(vscode.window.activeTextEditor.document.uri);
        console.log(`[CopyTab] Document ${vscode.window.activeTextEditor.document.uri} added to tracking.`);
        updateStatusBarItem();
    }
}

function deactivate() {}

exports.activate = activate;
exports.deactivate = deactivate;
