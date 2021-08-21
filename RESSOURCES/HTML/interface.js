// ==================================================================================================================
//  III  N   N  TTTTT  EEEEE  RRRR   FFFFF    A     CCC   EEEEE        GGG   EEEEE   SSS   TTTTT  III   OOO   N   N
//   I   NN  N    T    E      R   R  F       A A   C   C  E           G   G  E      S        T     I   O   O  NN  N
//   I   N N N    T    EEE    R   R  FFF    A   A  C      EEE         G      EEE     SSS     T     I   O   O  N N N
//   I   N  NN    T    E      RRRR   F      AAAAA  C      E           G  GG  E          S    T     I   O   O  N  NN
//   I   N   N    T    E      R  R   F      A   A  C   C  E           G   G  E          S    T     I   O   O  N   N
//  III  N   N    T    EEEEE  R   R  F      A   A   CCC   EEEEE        GGGG  EEEEE  SSSS     T    III   OOO   N   N
// ==================================================================================================================
// * * * Gestion de l'interface

clog('interface') ;


// ===============================================================================
//   1   EEEEE  RRRR   EEEEE         A    RRRR   RRRR   III  V   V  EEEEE  EEEEE
//  11   E      R   R  E            A A   R   R  R   R   I   V   V  E      E
//   1   EEE    R   R  EEE         A   A  R   R  R   R   I   V   V  EEE    EEE
//   1   E      RRRR   E           AAAAA  RRRR   RRRR    I    V V   E      E
//   1   E      R  R   E           A   A  R  R   R  R    I    V V   E      E
//  111  EEEEE  R   R  EEEEE       A   A  R   R  R   R  III    V    EEEEE  EEEEE
// ===============================================================================
// * * * 1ere Arrivée : demande de reception des parametres * * *
vscode.postMessage({
    action:  '1er Affichage'
}) ;


// ====================================================================================================================
//  M   M  EEEEE   SSS    SSS     A     GGG   EEEEE       RRRR   EEEEE   CCC   EEEEE  PPPP   TTTTT  III   OOO   N   N
//  MM MM  E      S      S       A A   G   G  E           R   R  E      C   C  E      P   P    T     I   O   O  NN  N
//  M M M  EEE     SSS    SSS   A   A  G      EEE         R   R  EEE    C      EEE    P   P    T     I   O   O  N N N
//  M   M  E          S      S  AAAAA  G  GG  E           RRRR   E      C      E      PPPP     T     I   O   O  N  NN
//  M   M  E          S      S  A   A  G   G  E           R  R   E      C   C  E      P        T     I   O   O  N   N
//  M   M  EEEEE  SSSS   SSSS   A   A   GGGG  EEEEE       R   R  EEEEE   CCC   EEEEE  P        T    III   OOO   N   N
// ====================================================================================================================
// * * * Reception Messages envoyés par la partie VSCode de l'application
window.addEventListener('message', event => {

    const message = event.data ; 
    clog('int mess', message) ;

    if (message.action == '1er Affichage') {
        clog('Interface 1e Affichage') ;
        usine.setContenu(message.contenu) ;
        usine.affich() ;
    }

} )


// =============================================================================================================
//    A    PPPP   PPPP   EEEEE  L           TTTTT  RRRR     A    III  TTTTT  EEEEE  M   M  EEEEE  N   N  TTTTT
//   A A   P   P  P   P  E      L             T    R   R   A A    I     T    E      MM MM  E      NN  N    T
//  A   A  P   P  P   P  EEE    L             T    R   R  A   A   I     T    EEE    M M M  EEE    N N N    T
//  AAAAA  PPPP   PPPP   E      L             T    RRRR   AAAAA   I     T    E      M   M  E      N  NN    T
//  A   A  P      P      E      L             T    R  R   A   A   I     T    E      M   M  E      N   N    T
//  A   A  P      P      EEEEE  LLLLL         T    R   R  A   A  III    T    EEEEE  M   M  EEEEE  N   N    T
// =============================================================================================================
// * * * Appel du Traitement, récup des valeurs * * *
function traitement(final = false, intermediaire = false) {
    let param = recupDonnee() ;
    usine.traitement(param, final, intermediaire) ;
    if (final) {
        // * * * retour * * *
        vscode.postMessage({
            action:  'retour Donnees'
        ,   contenu:  usine.contenuAff
        }) ;
    } else if (intermediaire) {
        usine.affich() ;
        effaceChamps() ;
    } else {
        usine.affich() ;
    }
}

// * * * Bouton Annuler * * *
function annuler() {
    vscode.postMessage({
        action:  'annuler'
    }) ;
}

// ==========================================================================================================================================================================
//  FFFFF   OOO   N   N   CCC   TTTTT  III   OOO   N   N   SSS         CCC    OOO   M   M  PPPP   L      EEEEE  M   M  EEEEE  N   N  TTTTT    A    III  RRRR   EEEEE   SSS
//  F      O   O  NN  N  C   C    T     I   O   O  NN  N  S           C   C  O   O  MM MM  P   P  L      E      MM MM  E      NN  N    T     A A    I   R   R  E      S
//  FFF    O   O  N N N  C        T     I   O   O  N N N   SSS        C      O   O  M M M  P   P  L      EEE    M M M  EEE    N N N    T    A   A   I   R   R  EEE     SSS
//  F      O   O  N  NN  C        T     I   O   O  N  NN      S       C      O   O  M   M  PPPP   L      E      M   M  E      N  NN    T    AAAAA   I   RRRR   E          S
//  F      O   O  N   N  C   C    T     I   O   O  N   N      S       C   C  O   O  M   M  P      L      E      M   M  E      N   N    T    A   A   I   R  R   E          S
//  F       OOO   N   N   CCC     T    III   OOO   N   N  SSSS         CCC    OOO   M   M  P      LLLLL  EEEEE  M   M  EEEEE  N   N    T    A   A  III  R   R  EEEEE  SSSS
// ==========================================================================================================================================================================
// * * * Fonctions Complementaires

// * * * Récupération des champs saisis dans un objet * * *
function recupDonnee() {
    let param = {} ;
    // * * * div donnée pour récupérer tous les champs * * *
    let dv = document.getElementById('donnees') ;  
    let tabElt = [] ;
    tabElt = [ ...dv.getElementsByTagName('input') , ...dv.getElementsByTagName('select') ] ; 
    // * * * Boucle pour alimenter les cles/valeurs * * *
    for(let elt of tabElt) {
        if (elt.name != undefined) {
            if (elt.type == 'checkbox') {
                param[elt.name] = elt.checked ;
            } else {
                param[elt.name] = elt.value ;
            }
        }
    }
    // * * * Retour des champs * * *
    return param ;
}

// * * * Affacement des champs * * *
function effaceChamps() {
    let param = {} ;
    // * * * div donnée pour récupérer tous les champs * * *
    let dv = document.getElementById('donnees') ;  
    let tabElt = [] ;
    tabElt = [ ...dv.getElementsByTagName('input') , ...dv.getElementsByTagName('select') ] ; 
    // * * * Boucle pour alimenter les cles/valeurs * * *
    for(let elt of tabElt) {
        if (elt.name != undefined) {
            if (elt.type == 'checkbox') {
                elt.checked = false;
            } else {
                elt.value = '' ;
            }
        }
    }
    // * * * Retour * * *
    return ;
}
