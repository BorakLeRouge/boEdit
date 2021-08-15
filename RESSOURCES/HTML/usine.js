
// ===========================================================================================================
//  U   U   SSS   III  N   N  EEEEE       TTTTT  RRRR     A    III  TTTTT  EEEEE  M   M  EEEEE  N   N  TTTTT
//  U   U  S       I   NN  N  E             T    R   R   A A    I     T    E      MM MM  E      NN  N    T
//  U   U   SSS    I   N N N  EEE           T    R   R  A   A   I     T    EEE    M M M  EEE    N N N    T
//  U   U      S   I   N  NN  E             T    RRRR   AAAAA   I     T    E      M   M  E      N  NN    T
//  U   U      S   I   N   N  E             T    R  R   A   A   I     T    E      M   M  E      N   N    T
//   UUU   SSSS   III  N   N  EEEEE         T    R   R  A   A  III    T    EEEEE  M   M  EEEEE  N   N    T
// ===========================================================================================================
// * * * Usine Traitement

// =============================
//   CCC   L       OOO    GGG
//  C   C  L      O   O  G   G
//  C      L      O   O  G
//  C      L      O   O  G  GG
//  C   C  L      O   O  G   G
//   CCC   LLLLL   OOO    GGGG
// =============================
// * * * clog
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

clog('usine') ;

// ==============================================================================================================================
//  U   U   SSS   III  N   N  EEEEE       DDD    EEEEE       TTTTT  RRRR     A    III  TTTTT  EEEEE  M   M  EEEEE  N   N  TTTTT
//  U   U  S       I   NN  N  E           D  D   E             T    R   R   A A    I     T    E      MM MM  E      NN  N    T
//  U   U   SSS    I   N N N  EEE         D   D  EEE           T    R   R  A   A   I     T    EEE    M M M  EEE    N N N    T
//  U   U      S   I   N  NN  E           D   D  E             T    RRRR   AAAAA   I     T    E      M   M  E      N  NN    T
//  U   U      S   I   N   N  E           D  D   E             T    R  R   A   A   I     T    E      M   M  E      N   N    T
//   UUU   SSSS   III  N   N  EEEEE       DDD    EEEEE         T    R   R  A   A  III    T    EEEEE  M   M  EEEEE  N   N    T
// ==============================================================================================================================
// * * * Usine de traitement


// * * * Usine * * *
let usine = {

    contenu:    [] ,
    contenuRed: [] ,
    contenuRes: [] ,
    contenuAff: '' ,
    // * * reception du contenu * *
    setContenu(c) {
        c = c.replaceAll("\r\n", "\r").replaceAll("\n", "\r") ;
        this.contenu = c.split("\r") ;
        for (let i = 0; i <= 9; i++) {
            if (this.contenu[i] != undefined) {
                this.contenuRed[i] = this.contenu[i] ;
            }
        }
        this.contenuTst = this.contenuRed.join("\r\n") ;
        this.contenuAff = this.contenuRed.join("\r\n") ;
    }
    ,
    // * * Affichage * *
    affich() {
        document.getElementById('contenu').innerHTML = this.contenuAff ;
        clog('usn contenu', this.contenu) ;
    }
    ,
    // * * Traitement * *
    traitement(param, final) {
        if (final) { cont = this.contenu ; }
        else       { cont = this.contenuRed ; }
        let res = [] ;
        // boucle sur ligne
        let i = 0 ;
        for (let lg of cont) {
            r = lg ;
            // Rognage
            if(param.rogn == "g") { r = r.trimStart() ; }
            if(param.rogn == "d") { r = r.trimEnd() ; }
            if(param.rogn == "gd") { r = r.trim() ; }
            // fin traitement
            res[i++] = r ;
        }
        this.contenuRes = res ;
        this.contenuAff = res.join("\r\n") ;
    }
}
