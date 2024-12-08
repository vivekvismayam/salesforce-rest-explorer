// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
var apiKey;
//Command : Open Rest Explorer
let panel = undefined;
function activate(context) {
	const openRestExplorer = vscode.commands.registerCommand('salesforce-rest-explorer.openRestExplorer', function () {
		//Finding the column
		const columnToShowIn = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		if (panel) {
			panel.reveal(columnToShowIn);
		} else {
			panel = vscode.window.createWebviewPanel(
				'restExplorer', // Identifies the type of the webview. Used internally
				'Salesforce Rest Explorer', // Title of the panel displayed to the user
				vscode.ViewColumn.One, // Editor column to show the new webview panel in.
				{
					// Enable scripts in the webview
					enableScripts: true,
					enableFindWidget:true,
					retainContextWhenHidden: true
				}
			);
			const pathToHtml = vscode.Uri.file(
				path.join(context.extensionPath, 'index.html')
			);

			const pathUri = pathToHtml.with({ scheme: 'vscode-resource' });
			panel.webview.html = fs.readFileSync(pathUri.fsPath, 'utf8');

			// Handle messages from the webview to ext
			panel.webview.onDidReceiveMessage(
				message => {
					switch (message.command) {
						case 'refresh':
							/*SFDX Commands*/
							const config = vscode.workspace.getConfiguration('salesforce-rest-explorer');
							const cliCommand = config.get('CLI Command') || 'sf';
							const commandStr=cliCommand=='sf'?'sf org display --json':'sfdx force:org:display --json';
							exec(commandStr, (error, stdout, stderr) => {
								if (stderr) {
									console.log(stderr)
									vscode.window.showErrorMessage(stderr);
								}
								//else {
								if(stdout){
									const result = JSON.parse(stdout);
									//post details here
									console.log(result)
									apiKey = result?.result?.accessToken;
									panel?.webview?.postMessage({ result: { instanceUrl: result?.result?.instanceUrl, username: result?.result?.username }, command: 'refresh' });
									if(apiKey){
										vscode.window.showInformationMessage('Salesforce Rest Explorer : Org Set to Default org');
									}else{
										vscode.window.showInformationMessage('Salesforce Rest Explorer : Please select a Default org and click on "Set Default Org" Button');

									}
									
								}
							})
							return;
						case 'error':
							vscode.window.showErrorMessage(message.text);
							return;
						case 'callout':
							//vscode.window.showErrorMessage(message.text);
							fetchData(message.details)
							return;
						case 'message':
							vscode.window.showInformationMessage(message.text);
							return;
					}

				},
				undefined,
				context.subscriptions
			);
			panel.onDidDispose(
				() => {
					// When the panel is closed,make panel undefined to open a new panel next time
					panel = undefined;
				},
				null,
				context.subscriptions
			);
		}

	});
	context.subscriptions.push(openRestExplorer);
}
async function fetchData(details) {
	console.log(details)
	let headerWithAuth = details?.headers ? { ...details?.headers, "Authorization": `Bearer ${apiKey}` } : { "Authorization": `Bearer ${apiKey}` }
	console.log(headerWithAuth)

	let options;

	if (['GET', 'HEAD'].includes(details?.method)) {
		options = {
			method: details?.method,
			headers: headerWithAuth,
		}

	} else {
		options = {
			method: details?.method,
			headers: headerWithAuth,
			body: details?.body ? JSON.stringify(details?.body) : null
		}
	}
	let response;
	let time;
	let resText;
	let headers = {};
	try {
		let time1 = performance.now();
		response = await fetch(details?.endpoint, options);
		let time2 = performance.now();
		time = (time2 - time1);
		//headers = Object.fromEntries(response?.headers)
		headers = Object.fromEntries(response?.headers?.entries())
		resText = await response.text();
		//let responseJson = await response.json();
		let responseJson = JSON.parse(resText);
		panel?.webview?.postMessage({
			result: {
				body: responseJson, time: time,
				headers: headers,
				status: response?.status, statusText: response?.statusText, size: Buffer.byteLength(JSON.stringify(response))
			}, command: 'calloutresponse'
		});
		vscode.window.showInformationMessage('Salesforce Rest Explorer : Callout Completed');
	} catch (e) {
		panel?.webview?.postMessage({
			result: {
				body: resText, time: time,
				headers: headers,
				status: response?.status, statusText: response?.statusText, size: Buffer.byteLength(JSON.stringify(response))
			}, command: 'calloutresponse', exception: true
		});
	}

}

// This method is called when your extension is deactivated
function deactivate() {
	vscode.window.showInformationMessage('See you Soon! We will miss you!');
}

module.exports = {
	activate,
	deactivate
}
