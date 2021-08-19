
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

// ============================================================================================================================================================
//  TTTTT  RRRR     A    N   N   SSS   FFFFF   OOO   RRRR   M   M    A    TTTTT  III   OOO   N   N       DDD    EEEEE       TTTTT  EEEEE  X   X  TTTTT  EEEEE
//    T    R   R   A A   NN  N  S      F      O   O  R   R  MM MM   A A     T     I   O   O  NN  N       D  D   E             T    E       X X     T    E
//    T    R   R  A   A  N N N   SSS   FFF    O   O  R   R  M M M  A   A    T     I   O   O  N N N       D   D  EEE           T    EEE      X      T    EEE
//    T    RRRR   AAAAA  N  NN      S  F      O   O  RRRR   M   M  AAAAA    T     I   O   O  N  NN       D   D  E             T    E       X X     T    E
//    T    R  R   A   A  N   N      S  F      O   O  R  R   M   M  A   A    T     I   O   O  N   N       D  D   E             T    E      X   X    T    E
//    T    R   R  A   A  N   N  SSSS   F       OOO   R   R  M   M  A   A    T    III   OOO   N   N       DDD    EEEEE         T    EEEEE  X   X    T    EEEEE
// ============================================================================================================================================================
// * * * Transformation de texte


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
    traitement(param, final, intermedaire) {
        clog('Traitement : param', param) ;
        let cont ;
        if (final)             { cont = this.contenu ; }
        else if (intermedaire) { cont = this.contenu ; }
        else                   { cont = this.contenuRed ; }
        let res = [] ;
        //  * * * boucle sur ligne -  traitement lignes / lignes * * *
        let i = 0 ;
        for (let lg of cont) {
            let r = lg ;
            // * * * Rognage * * *
            if(param.rogn == "g") { r = r.trimStart() ; }
            if(param.rogn == "d") { r = r.trimEnd() ; }
            if(param.rogn == "gd") { r = r.trim() ; }
            // * * * Retire Parenthese * * *
            if(param.retirPar) { r = r.replaceAll('(', '').replaceAll(')', '') ; }
            // * * * Remplacement * * *
            if(param.rempl + param.by != '' ) { r = r.replaceAll(param.rempl, param.by) ; }
            // * * * Retrait * * *
            if(param.rtrtG > 0) { r = r.substr(param.rtrtG) ; } 
            if(param.rtrtD > 0) { 
                if (param.rtrtD > r.length) { r = '' ; }
                else { r = r.substr(0, r.length - param.rtrtD) ; } 
            }
            // * * * Rognage 2 * * *
            if(param.rogn2 == "g") { r = r.trimStart() ; }
            if(param.rogn2 == "d") { r = r.trimEnd() ; }
            if(param.rogn2 == "gd") { r = r.trim() ; }
            // * * * Troncature et complément * * *
            if(param.tronc > 0) { r = r.substr(0, param.tronc).padEnd(param.tronc, ' ') ; }  // 
            // * * * Ajout * * *
            if(param.ajtG.length > 0) { r = param.ajtG + r ; } 
            if(param.ajtD.length > 0) { r = r + param.ajtD ; } 

            // * * * fin traitement * * *
            res[i++] = r ;
        }
        if (!intermedaire) {
            this.contenuRes = res ;
            this.contenuAff = res.join("\r\n") ;
        } else {
            this.setContenu(res.join("\r\n")) ;
        }
    }
}
