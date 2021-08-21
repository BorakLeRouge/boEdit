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

    // * * * * * * * * * * * * * * * * * * * * *
	// * * * Reception des lignes du texte * * *
    // * * * * * * * * * * * * * * * * * * * * *
    let textEdit = vscode.window.activeTextEditor ;
    let ligDebut = textEdit.selection.start.line ; 
    let ligFin   = textEdit.selection.end.line ; 
	let position = new vscode.Range(new vscode.Position(ligDebut, 0), new vscode.Position(ligFin + 1, 0)) ; 
	let leTexte  = textEdit.document.getText(position) ;  	
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
    panel.webview.html = getWebviewContent(context, panel.webview) ;

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
                majEditeur(context, textEdit, position, message) ;
                panel.dispose() ;
                break ;
            case 'annuler':
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

        <h1>boEdit - Traitements multi-lignes</h1>
          
        <p class="extrait">Extrait de contrôle :</p>
        <textarea id="contenu" class="contenu" readonly="readonly" cols=80 rows=10></textarea>

        <!-- Les champs à récupérer -->
          
        <div id="donnees">

            <fieldset><legend>Ajout sauts de ligne et tabulations</legend>
                <p>
                    <input name="aslB" id="aslB" type="checkbox" onchange="traitement()" />
                    <label for="aslB">Remplacer les caractères</label> 
                    <input name="arsl" type="text" value="" size="20" onchange="traitement()" onkeyup="traitement()" /> par des sauts de ligne.
                    <br />
                    <span class="tabul"></span><input name="aslG" id="aslG" type="checkbox" onchange="traitement()" /> <label for="aslG">Garder le séparateur</label> 
                </p>
                <p>
                    <input name="atbB" id="atbB" type="checkbox" onchange="traitement()" />
                    <label for="atbB">Remplacer les caractères</label> 
                    <input name="atbl" type="text" value="" size="20" onchange="traitement()" onkeyup="traitement()" /> par des tabulations
                    <br />
                    <span class="tabul"></span><input name="atbG" id="atbG" type="checkbox" onchange="traitement()" /> <label for="atbG">Garder le séparateur</label> 
                </p>
            </fieldset>
        
            <fieldset><legend>Travail sur lignes</legend>
                <p><label>Rognage des blancs : </label>
                    <select name="rogn" onchange="traitement()">
                        <option value="n" selected="selected">non</option>
                        <option value="g">gauche</option>
                        <option value="d">droite</option>
                        <option value="gd">totale</option>
                    </select>
                </p>
                <p>
                    <input name="retirPar" id="retirPar" type="checkbox" onchange="traitement()" />
                    <label for="retirPar">Retirer les parenthèses / </label>
                    <input name="retirApo" id="retirApo" type="checkbox" onchange="traitement()" />
                    <label for="retirApo">Les apostrophes / </label>
                    <input name="retirGui" id="retirGui" type="checkbox" onchange="traitement()" />
                    <label for="retirGui">Les guillemets</label>
                </p>
                <p>
                    <label for="rempl">Remplacer </label>
                    <input name="rempl" type="text" value="" size="20" onchange="traitement()" onkeyup="traitement()"/>
                    <label for="by"> par </label>
                    <input name="by" id="by" type="text" value="" size="20" onchange="traitement()" onkeyup="traitement()" />
                    <br />
                    <label for="rempl2">Remplacer </label>
                    <input name="rempl2" type="text" value="" size="20" onchange="traitement()" onkeyup="traitement()"/>
                    <label for="by2"> par </label>
                    <input name="by2" type="text" value="" size="20" onchange="traitement()" onkeyup="traitement()" />
                    <br />
                    <label for="rempl3">Remplacer </label>
                    <input name="rempl3" type="text" value="" size="20" onchange="traitement()" onkeyup="traitement()"/>
                    <label for="by3"> par </label>
                    <input name="by3" type="text" value="" size="20" onchange="traitement()" onkeyup="traitement()" />
                </p>
                <p>
                    <label for="rtrtG">Retrait à gauche </label>
                    <input name="rtrtG" type="number" value="" size="3" maxlength="3" min="0" max="999" onchange="traitement()" onkeyup="traitement()" />
                    <label for="rtrtD"> Retrait à droite </label>
                    <input name="rtrtD" type="number" value="" size="3" maxlength="3" min="0" max="999" onchange="traitement()" onkeyup="traitement()" />
                </p>
                <p>
                    <label for="rogn2">Rognage des blancs après retrait: </label>
                    <select name="rogn2" onchange="traitement()">
                        <option value="n" selected="selected">non</option>
                        <option value="g">gauche</option>
                        <option value="d">droite</option>
                        <option value="gd">totale</option>
                    </select>
                </p>
                <p>
                    <label for="tronc">troncature et complément à </label>
                    <input name="tronc" type="number" value="" size="3" maxlength="3" min="0" max="999" onchange="traitement()" onkeyup="traitement()" /> caractères
                </p>
                <p>
                    <label for="ajtG">Ajout à Gauche </label>
                    <input name="ajtG" type="text" value="" size="10" onchange="traitement()" onkeyup="traitement()" />
                    <label for="ajtD"> ajout à droite </label>
                    <input name="ajtD" type="text" value="" size="10" onchange="traitement()" onkeyup="traitement()" />
                </p>
            </fieldset>
             
            <fieldset><legend>Retrait sauts de ligne et tabulations</legend>
                <p>
                    <label for="prem">Ajout début 1ère ligne </label>
                    <input name="prem" type="text" value="" size="20" onchange="traitement()" onkeyup="traitement()" />
                </p>
                <p>
                    <label for="end">Ajout fin dernière ligne </label>
                    <input name="end" type="text" value="" size="20" onchange="traitement()" onkeyup="traitement()" />
                </p>
                <p>
                    <input name="rtbB" id="rtbB" type="checkbox" onchange="traitement()" />
                    <label for="rtbB">Remplacer tabulation par </label>
                    <input name="rtb" type="text" value="" size="20" onchange="traitement()" onkeyup="traitement()" />
                </p>
                <p>
                    <input name="rslB" id="rslB" type="checkbox" onchange="traitement()" />
                    <label for="rslB">Remplacer sauts de ligne par </label>
                    <input name="rsl" type="text" value="" size="5" onchange="traitement()" onkeyup="traitement()" />
                    <input name="rslF" type="text" value="" size="5" onchange="traitement()" onkeyup="traitement()" />
                    <label for="rslLmt"> limité à </label>
                    <input name="rslLmt" type="number" value="" size="3" maxlength="3" min="0" max="999" onchange="traitement()" onkeyup="traitement()" /> caractères.
                </p>
            </fieldset>
             
        </div>

        <!-- Bouton d'envoi -->
        <p class="centre">Actions :</p>
        <p class="centre">
        <button name="final" id="final" type="button" onclick="annuler()" >Annuler</button> 
        <button name="final" id="final" type="button" onclick="traitement(false, true)" >Validation intermédiaire</button> 
        <button name="final" id="final" type="button" onclick="traitement(true)" >Validation finale des mises à jour</button> 
        </p>

        <!-- Objet récupéré de vscode -->
        <script>
            const vscode = acquireVsCodeApi() ;
        </script>

        <!-- Script de construction des pages -->
        <script src="${UsineJsUri}"></script>
        <script src="${interfaceJsUri}"></script>
  
    </body>
    </html>`;
}


// ============================================================================================================================
//  M   M  III   SSS   EEEEE         A           JJJ   OOO   U   U  RRRR        EEEEE  DDD    III  TTTTT  EEEEE  U   U  RRRR
//  MM MM   I   S      E            A A           J   O   O  U   U  R   R       E      D  D    I     T    E      U   U  R   R
//  M M M   I    SSS   EEE         A   A          J   O   O  U   U  R   R       EEE    D   D   I     T    EEE    U   U  R   R
//  M   M   I       S  E           AAAAA          J   O   O  U   U  RRRR        E      D   D   I     T    E      U   U  RRRR
//  M   M   I       S  E           A   A       J  J   O   O  U   U  R  R        E      D  D    I     T    E      U   U  R  R
//  M   M  III  SSSS   EEEEE       A   A        JJ     OOO    UUU   R   R       EEEEE  DDD    III    T    EEEEE   UUU   R   R
// ============================================================================================================================
// * * * Mise à jour Editeur
async function majEditeur(context, textEdit, position, message) {
    try {   clog('maj demandée', textEdit, position, message) ;
        // Raf de la fenetre editeur
        let rafTextEdit = await vscode.window.showTextDocument(textEdit.document) ; clog('raf OK') ;
        // * Insertion des lignes *
        rafTextEdit.edit( builder => { builder.replace(position, message.contenu) })  ; clog('update') ;
    } catch (error) {
        clog('ERROR', error) ;
        vscode.window.showErrorMessage('ITCE - Anomalie maj') ;
        return
    }
}
