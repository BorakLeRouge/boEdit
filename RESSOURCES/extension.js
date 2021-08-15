// * * * les modules à utiliser * * *
const vscode = require('vscode');
//const path   = require('path') ;
//const fs     = require('fs') ;

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

	let disposable = vscode.commands.registerCommand('boedit.edit', async function () {
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
async function appelBoEdit(context) {
	vscode.window.showInformationMessage('boEdit départ !');

    // * * * * * * * * * * * * * * * * * * * * *
	// * * * Reception des lignes du texte * * *
    // * * * * * * * * * * * * * * * * * * * * *
    let ligDebut = vscode.window.activeTextEditor.selection.start.line ; 
    let ligFin   = vscode.window.activeTextEditor.selection.end.line ; 
	let position = new vscode.Range(new vscode.Position(ligDebut, 0), new vscode.Position(ligFin + 1, 0)) ; 
	let leTexte  = vscode.window.activeTextEditor.document.getText(position) ;  	
	let leType   = vscode.window.activeTextEditor.document.languageId.toUpperCase() ;

    clog('BoEdit : leTexte', leTexte, ligDebut, ligFin) ;

    // * * * * * * * * * * * * * * * * * * * * * * * * *
    // * * * Appel de la webview de transformation * * *
    // * * * * * * * * * * * * * * * * * * * * * * * * *
    const panel = vscode.window.createWebviewPanel(
        'boEdit',
        'boEdit',
        vscode.ViewColumn.One,
        {
          // Enable scripts in the webview
          enableScripts: true 
          // Garde le contenu quand la page est cachée
        , retainContextWhenHidden: true
        }
    );
    // * * * Alimentation du contenu html de base * * *
    panel.webview.html = await getWebviewContent(context, panel.webview) ;

    // * * * Gestion des messages entrants * * *
    panel.webview.onDidReceiveMessage(
        message => {
            clog('vsc message', message) ;
            switch (message.action) {
            case '1er Affichage':
                clog('vsc texte', leTexte) ;
                panel.webview.postMessage({action: message.action, contenu: leTexte})
                break ;
            case 'retour Donnees':
                clog('vsc retour', message.contenu) ;
                /*
                try {
                    // * * * Insertion des lignes * * * * * *
                    // * Ligne en cours de selection + modif *
                    let rg    = new vscode.Range(new vscode.Position(0, 0) , new vscode.Position(nbLig, 0))
                    // * réactivation de l'éditeur *
                    let rafTextEdit = await vscode.window.showTextDocument(vscode.window.activeTextEditor.document) ;
                    // * Insertion des lignes *
                    await rafTextEdit.edit( builder => { builder.replace(position, message.contenu) })  
                } catch (error) {
                    vscode.window.showErrorMessage('ITCE - Anomalie retrait - ' + marge + ' lg:' + nbLig.toString()) ;
                    return
                };
                */
                panel.dispose() ;
                break ;
            default:
                vscode.window.showErrorMessage('Message non traité : '+message.action);
                break ;
            }
        },
        undefined,
        context.subscriptions
    )

}

// ====================================================================================================================
//  H   H  TTTTT  M   M  L            CCC    OOO   N   N   SSS   TTTTT  RRRR   U   U   CCC   TTTTT  III   OOO   N   N
//  H   H    T    MM MM  L           C   C  O   O  NN  N  S        T    R   R  U   U  C   C    T     I   O   O  NN  N
//  HHHHH    T    M M M  L           C      O   O  N N N   SSS     T    R   R  U   U  C        T     I   O   O  N N N
//  H   H    T    M   M  L           C      O   O  N  NN      S    T    RRRR   U   U  C        T     I   O   O  N  NN
//  H   H    T    M   M  L           C   C  O   O  N   N      S    T    R  R   U   U  C   C    T     I   O   O  N   N
//  H   H    T    M   M  LLLLL        CCC    OOO   N   N  SSSS     T    R   R   UUU    CCC     T    III   OOO   N   N
// ====================================================================================================================
// * * * HTML Construction


function getWebviewContent(context, webview) {

    // * * * Nom du document * * *
    //let adrFich     = textEdit.document.fileName ;  
    //let nomFich     = path.basename(adrFich) ; 
    //let nomExtens   = path.extname(adrFich) ;
    //let nomElement  = path.basename(adrFich, nomExtens) ; 

    // * * * Identification du Squelette * * *
    const CSSUri         = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'RESSOURCES', 'HTML', 'base.css')); 
    const UsineJsUri     = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'RESSOURCES', 'HTML', 'usine.js'));
    const interfaceJsUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'RESSOURCES', 'HTML', 'interface.js'));

    return `<!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${CSSUri}" rel="stylesheet" />
        <title>boEdit</title>
    </head>
    <body>

        <h1>boEdit</h1>
   
        <p>Ca marche ? </p>
        
        <textarea id="contenu" class="contenu" readonly="readonly" cols=80 rows=10></textarea>

        <!-- Les champs à récupérer -->
        <div id="donnees">
            <p>Rognage des blancs :
                <select name="rogn" onchange="traitement()">
                    <option value="n" selected="selected">non</option>
                    <option value="g">gauche</option>
                    <option value="d">droite</option>
                    <option value="gd">totale</option>
                </select>
            <br />
                <label for="="retirPar">Retirer les parenthèses</label>
                <input name="retirPar" id="retirPar" type="checkbox" onchange="traitement()" />
            </p>
            <p>
                <label for="rempl">Remplacer </label>
                <input name="rempl" type="text" value="" size="20" onchange="traitement()" />
                <label for="by"> par </label>
                <input name="by" type="text" value="" size="20" onchange="traitement()" />
            </p>
            <p>
                <label for="rtrtG">Retrait à gauche </label>
                <input name="rtrtG" type="number" value="" size="3" onchange="traitement()" />
                <label for="rtrtD"> Retrait à droite </label>
                <input name="rtrtD" type="number" value="" size="3" onchange="traitement()" />
            </p>

        </div>

        <!-- Bouton d'envoi -->
        <p><label for="final">Validation et application des modifications :</label>
        <button name="final" id="final" type="button" onclick="traitement(true)" >OK</button></p>


        <!-- Objet récupéré de vscode -->
        <script>
            const vscode = acquireVsCodeApi() ;

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

            clog ('debut HTML js') ;
        </script>

        <!-- Script de construction des pages -->
        <script src="${UsineJsUri}"></script>
        <script src="${interfaceJsUri}"></script>
  
    </body>
    </html>`;
}