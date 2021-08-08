const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */

// =============================
//   CCC   L       OOO    GGG
//  C   C  L      O   O  G   G
//  C      L      O   O  G
//  C      L      O   O  G  GG
//  C   C  L      O   O  G   G
//   CCC   LLLLL   OOO    GGGG
// =============================
// * * * clog

// Version à Groupement
function clog(...tb) {
    if(tb.length == 1) {
        console.log(tb[0]);
    } else {
        let first = true ;
        for (let c of tb) {
            if (first) {
                console.groupCollapsed(c) ;
                first = false ;
            } else {
                console.log(c) ;
        }   }
        console.groupEnd() ;
}   }

// ==================================================================================================================
//   GGG   EEEEE   SSS   TTTTT  III   OOO   N   N       EEEEE  X   X  TTTTT  EEEEE  N   N   SSS   III   OOO   N   N
//  G   G  E      S        T     I   O   O  NN  N       E       X X     T    E      NN  N  S       I   O   O  NN  N
//  G      EEE     SSS     T     I   O   O  N N N       EEE      X      T    EEE    N N N   SSS    I   O   O  N N N
//  G  GG  E          S    T     I   O   O  N  NN       E       X X     T    E      N  NN      S   I   O   O  N  NN
//  G   G  E          S    T     I   O   O  N   N       E      X   X    T    E      N   N      S   I   O   O  N   N
//   GGGG  EEEEE  SSSS     T    III   OOO   N   N       EEEEE  X   X    T    EEEEE  N   N  SSSS   III   OOO   N   N
// ==================================================================================================================
// * * * Gestion Extension

function deactivate() {}
function activate(context) {

	console.log('Congratulations, your extension "boedit" is now active!');

	let disposable = vscode.commands.registerCommand('boedit.edit', function () {
		appelBoEdit(context) ;
	});

	context.subscriptions.push(disposable);
}

module.exports = {
	activate,
	deactivate
}

// ========================================================================================
//    A    PPPP   PPPP   EEEEE  L           W   W  EEEEE  BBB    V   V  III  EEEEE  W   W
//   A A   P   P  P   P  E      L           W   W  E      B  B   V   V   I   E      W   W
//  A   A  P   P  P   P  EEE    L           W   W  EEE    BBBB   V   V   I   EEE    W   W
//  AAAAA  PPPP   PPPP   E      L           W W W  E      B   B   V V    I   E      W W W
//  A   A  P      P      E      L           W W W  E      B   B   V V    I   E      W W W
//  A   A  P      P      EEEEE  LLLLL        W W   EEEEE  BBBB     V    III  EEEEE   W W
// ========================================================================================
// * * * Appel WebView boEdit
function appelBoEdit(context) {
	vscode.window.showInformationMessage('boEdit départ !');

	// * * * Reception du texte * * *

}